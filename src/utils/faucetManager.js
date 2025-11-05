import { ethers } from "ethers";
import { DirectSigner, CosmosQueryClient } from '@interchainjs/cosmos';
import { Secp256k1HDWallet } from '@interchainjs/cosmos';
import { StargateClient, SigningStargateClient, coins } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase.config";

class FaucetManager {
  constructor(blockchainType, chainId, rpcUrl, privateKeyOrMnemonic) {
    if (!rpcUrl) throw new Error("RPC URL is required");
    if (!privateKeyOrMnemonic) throw new Error("Private key or mnemonic is required");
    if (!chainId) throw new Error("Valid chainId is required");

    this.blockchainType = blockchainType; // 'ethereum' o 'cosmos'
    this.chainId = chainId;
    this.rpcUrl = rpcUrl;
    this.privateKeyOrMnemonic = privateKeyOrMnemonic;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      if (this.blockchainType === 'ethereum') {
        await this.initializeEthereum(this.privateKeyOrMnemonic);
      } else if (this.blockchainType === 'cosmos') {
        await this.initializeCosmos(this.privateKeyOrMnemonic);
      } else {
        throw new Error("Unsupported blockchain type");
      }
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing FaucetManager:", error);
      throw new Error("Failed to initialize faucet manager");
    }
  }

  async initializeEthereum(privateKey) {
    if (isNaN(this.chainId)) throw new Error("Valid chainId is required for Ethereum");

    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);

    // Asegurar que el provider esté listo
    this.provider.ready.then(() => {
      // Verificar que el chainId del provider coincida
      this.provider.getNetwork().then(network => {
        if (network.chainId !== this.chainId) {
          console.warn(`ChainId mismatch: Provider is ${network.chainId}, but ${this.chainId} was provided`);
        }
      });
    });
  }

  async initializeCosmos(mnemonicOrPrivateKey) {
    // Configuración específica para Passage
    if (this.chainId === 'passage-testnet-1' || this.chainId.includes('passage')) {
      this.addressPrefix = 'pasg';
      this.denom = 'upasg';
      this.validatorAddress = 'pasg1g6tyvjmqa9hsy4839ce0rd5me8qsadnwtel3t3';
      this.validatorPubkey = '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ajd9ND7EAoBswjOQtD/DPi/0/1FHg73/O9dSiRQDFYZ9"}';
    } else {
      // Configuración genérica para otros Cosmos chains
      this.addressPrefix = 'cosmos';
      this.denom = 'uatom';
    }

    // Determinar si es mnemonic o private key
    const isPrivateKey = mnemonicOrPrivateKey.length === 64 && /^[0-9a-fA-F]+$/.test(mnemonicOrPrivateKey);

    if (isPrivateKey) {
      // Crear wallet desde private key usando DirectSecp256k1HdWallet
      this.wallet = await DirectSecp256k1HdWallet.fromPrivateKey(
        mnemonicOrPrivateKey,
        this.addressPrefix
      );
    } else {
      // Crear wallet desde mnemonic usando DirectSecp256k1HdWallet
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonicOrPrivateKey,
        { prefix: this.addressPrefix }
      );
    }

    // Obtener la dirección del wallet
    try {
      const accounts = await this.wallet.getAccounts();
      if (accounts && accounts.length > 0) {
        this.walletAddress = accounts[0].address;
      }
    } catch (error) {
      console.error("Error obteniendo accounts del wallet:", error);
    }

    // Crear queryClient correctamente
    this.queryClient = new CosmosQueryClient({
      rpcEndpoint: this.rpcUrl,
      chainId: this.chainId
    });

    // Crear signer con queryClient
    this.signer = new DirectSigner(this.wallet, {
      chainId: this.chainId,
      queryClient: this.queryClient,
      addressPrefix: this.addressPrefix
    });

    // Intentar inicializar el signer si tiene método initialize
    if (typeof this.signer.initialize === 'function') {
      await this.signer.initialize();
    }
  }

  async sendTransaction(address, uuid) {
    try {
      // Verificar límite de 24h (común para ambos tipos)
      const transactionsRef = collection(db, "transactions");
      const twentyFourHoursAgo = Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      const q = query(
        transactionsRef,
        where("uuid", "==", uuid)
      );

      const querySnapshot = await getDocs(q);
      
      // Comparar Timestamps correctamente
      // Buscamos transacciones que sean más recientes que hace 24 horas
      const now = Date.now();
      const twentyFourHoursAgoMs = now - (24 * 60 * 60 * 1000);
      
      const recentTransactions = querySnapshot.docs.filter(doc => {
        const transactionTimestamp = doc.data().timestamp;
        if (!transactionTimestamp) return false;
        
        // Convertir Timestamp de Firebase a milisegundos para comparar
        const transactionMs = transactionTimestamp.toMillis 
          ? transactionTimestamp.toMillis() 
          : transactionTimestamp.toDate().getTime();
        
        // Si la transacción es más reciente que hace 24 horas, cuenta
        return transactionMs >= twentyFourHoursAgoMs;
      });

      if (recentTransactions.length > 0) {
        throw new Error("24-hour limit reached");
      }

      if (this.blockchainType === 'ethereum') {
        return await this.sendEthereumTransaction(address, uuid);
      } else if (this.blockchainType === 'cosmos') {
        return await this.sendCosmosTransaction(address, uuid);
      } else {
        throw new Error("Unsupported blockchain type");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  }

  async sendEthereumTransaction(address, uuid) {
    // Verificar balance del faucet
    const balance = await this.provider.getBalance(this.signer.address);
    const requiredAmount = ethers.utils.parseUnits("1.01", 18);

    if (balance.lt(requiredAmount)) {
      throw new Error("Insufficient funds in faucet wallet");
    }

    // Verificar formato de dirección
    if (!ethers.utils.isAddress(address)) {
      throw new Error("Invalid address format");
    }

    // Obtener el chainId actual de la red
    const network = await this.provider.getNetwork();
    const currentChainId = network.chainId;

    // Enviar transacción con el chainId correcto
    const txData = {
      to: address,
      value: ethers.utils.parseUnits("1", 18),
      gasLimit: ethers.BigNumber.from(21000),
      gasPrice: await this.provider.getGasPrice(),
      chainId: currentChainId, // Usar el chainId de la red actual
    };

    const txResponse = await this.signer.sendTransaction(txData);
    const txReceipt = await txResponse.wait();

    // Guardar transacción en Firebase
    await addDoc(collection(db, "transactions"), {
      uuid,
      timestamp: Timestamp.now(),
      hash: txResponse.hash,
      value: 1,
      chainId: currentChainId,
      address: address,
      status: 'completed',
      network: 'ethereum'
    });

    return txReceipt;
  }

  async sendCosmosTransaction(address, uuid) {
    // Verificar balance real del faucet
    const balance = await this.getBalance();
    const sendAmount = 10000000000; // 10,000 PASG (upasg tiene 6 decimales)
    const feeAmount = 2500000; // Comisión requerida por Passage
    const totalRequired = sendAmount + feeAmount; // Total necesario

    if (parseInt(balance.amount) < totalRequired) {
      throw new Error(`Insufficient funds in faucet wallet. Required: ${totalRequired} upasg, Available: ${balance.amount} upasg`);
    }

    // Validar formato de dirección de Cosmos (más flexible)
    const prefix = this.addressPrefix || 'pasg';
    const isValidAddress = (address.startsWith(prefix + '1') || address.startsWith('u' + prefix + '1')) && address.length >= 40 && address.length <= 50;

    if (!isValidAddress) {
      throw new Error(`Invalid ${prefix} address format`);
    }

    // Crear wallet desde mnemonic usando DirectSecp256k1HdWallet
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      this.privateKeyOrMnemonic,
      { prefix: this.addressPrefix }
    );

    // Obtener la cuenta del wallet
    const [account] = await wallet.getAccounts();

    // Conectar cliente firmante
    const client = await SigningStargateClient.connectWithSigner(this.rpcUrl, wallet);

    // Definir el monto a enviar (10,000 PASG)
    const amount = coins(10000000000, this.denom); // 10,000 PASG

    // Definir la comisión (Passage requiere 2,500,000 upasg mínimo)
    const fee = {
      amount: coins(2500000, this.denom), // Fee de gas requerido por Passage
      gas: "200000", // gas limit
    };

    // Enviar transacción
    const result = await client.sendTokens(
      account.address,
      address,
      amount,
      fee,
      `${this.chainId} Testnet Faucet`
    );

    // Guardar transacción en Firebase
    await addDoc(collection(db, "transactions"), {
      uuid,
      timestamp: Timestamp.now(),
      hash: result.transactionHash,
      value: 10000,
      chainId: this.chainId,
      address: address,
      status: 'completed',
      network: 'cosmos'
    });

    return result;
  }

  async checkUserTransactions(uuid) {
    try {
      const twentyFourHoursAgo = Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      // Consulta simplificada usando solo uuid
      const q = query(
        collection(db, "transactions"),
        where("uuid", "==", uuid)
      );

      const querySnapshot = await getDocs(q);

      // Filtrar manualmente por timestamp comparando Timestamps correctamente
      const now = Date.now();
      const twentyFourHoursAgoMs = now - (24 * 60 * 60 * 1000);
      
      const recentTransactions = querySnapshot.docs.filter(doc => {
        const transactionTimestamp = doc.data().timestamp;
        if (!transactionTimestamp) return false;
        
        // Convertir Timestamp de Firebase a milisegundos para comparar
        const transactionMs = transactionTimestamp.toMillis 
          ? transactionTimestamp.toMillis() 
          : transactionTimestamp.toDate().getTime();
        
        // Si la transacción es más reciente que hace 24 horas, cuenta
        return transactionMs >= twentyFourHoursAgoMs;
      });

      return recentTransactions.length > 0;
    } catch (error) {
      console.error("Error checking transactions:", error);
      throw new Error("Error checking transaction history");
    }
  }

  async getBalance() {
    try {
      if (this.blockchainType === 'ethereum') {
        const balance = await this.provider.getBalance(this.signer.address);
        return {
          amount: balance.toString(),
          formatted: ethers.utils.formatEther(balance) + ' ETH',
          denom: 'ETH'
        };
      } else if (this.blockchainType === 'cosmos') {
        // Conectar cliente de solo lectura usando el endpoint faucetRPC
        const client = await StargateClient.connect(this.rpcUrl);

        // Obtener balance real de Passage usando la dirección del wallet
        const balance = await client.getBalance(this.walletAddress, this.denom);

        // Formatear el balance (upasg tiene 6 decimales)
        const formattedAmount = (parseInt(balance.amount) / 1000000).toFixed(6);

        return {
          amount: balance.amount,
          formatted: `${formattedAmount} PASG`,
          denom: this.denom,
          simulated: false
        };
      }
    } catch (error) {
      console.error("Error getting balance:", error);
      throw new Error("Failed to get balance");
    }
  }

  getValidatorInfo() {
    if (this.blockchainType === 'cosmos' && (this.chainId === 'passage-testnet-1' || this.chainId.includes('passage'))) {
      return {
        address: this.validatorAddress,
        pubkey: this.validatorPubkey,
        chainId: this.chainId,
        rpcUrl: this.rpcUrl,
        type: 'local'
      };
    }
    return null;
  }

  getBlockchainInfo() {
    return {
      type: this.blockchainType,
      chainId: this.chainId,
      rpcUrl: this.rpcUrl,
      addressPrefix: this.addressPrefix || null,
      denom: this.denom || null
    };
  }

  validateAddress(address) {
    if (this.blockchainType === 'ethereum') {
      return ethers.utils.isAddress(address);
    } else if (this.blockchainType === 'cosmos') {
      // Validación más flexible para direcciones de Cosmos
      const prefix = this.addressPrefix || 'pasg';
      // Aceptar tanto 'pasg1' como 'upasg1'
      const isValid = (address.startsWith(prefix + '1') || address.startsWith('u' + prefix + '1')) && address.length >= 40 && address.length <= 50;
      return isValid;
    }
    return false;
  }

  getAddressPlaceholder() {
    if (this.blockchainType === 'ethereum') {
      return '0x...';
    } else if (this.blockchainType === 'cosmos') {
      return `${this.addressPrefix}1...`;
    }
    return '...';
  }
}

export default FaucetManager; 