import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import Contact from "../Components/Contact";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase.config";
import FaucetManager from "../utils/faucetManager";
import toast from "react-hot-toast";

const FaucetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blockchain, setBlockchain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faucetManager, setFaucetManager] = useState(null);
  const [balance, setBalance] = useState(null);
  const [validatorInfo, setValidatorInfo] = useState(null);
  const [availableBlockchains, setAvailableBlockchains] = useState([]);
  const [transactionHash, setTransactionHash] = useState(null);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const docRef = doc(db, "blockchains", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlockchain({ id: docSnap.id, ...data });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blockchain:", error);
        setLoading(false);
      }
    };

    const fetchAvailableBlockchains = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blockchains"));
        const blockchains = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Solo incluir blockchains que tengan faucet
          if (data.faucetLink && data.faucetLink !== "N/A") {
            blockchains.push({ id: doc.id, ...data });
          }
        });
        setAvailableBlockchains(blockchains);
      } catch (error) {
        console.error("Error fetching blockchains:", error);
      }
    };

    fetchBlockchain();
    fetchAvailableBlockchains();
  }, [id]);

  useEffect(() => {
    const initializeFaucet = async () => {
      if (!blockchain) return;

      // Limpiar estado anterior
      setFaucetManager(null);
      setBalance(null);
      setValidatorInfo(null);

      try {
        // Debug: mostrar todos los campos del blockchain
        console.log("Blockchain data:", blockchain);
        console.log("Available fields:", Object.keys(blockchain));
        console.log("faucetRPC:", blockchain.faucetRPC);
        console.log("faucetLink:", blockchain.faucetLink);

        console.log(
          "VITE_PASSAGE_FAUCET_MNEMONIC:",
          import.meta.env.VITE_PASSAGE_FAUCET_MNEMONIC
        );
        console.log(
          "VITE_FAUCET_PRIVATE_KEY:",
          import.meta.env.VITE_FAUCET_PRIVATE_KEY
        );

        let manager;
        let privateKeyOrMnemonic;

        if (blockchain.name === "Passage") {
          // Configuración para Passage - usar RPC de Firebase
          privateKeyOrMnemonic = import.meta.env.VITE_PASSAGE_FAUCET_MNEMONIC;
          if (!privateKeyOrMnemonic) {
            console.warn("the VITE_PASSAGE_FAUCET_MNEMONIC is not configured");
            return;
          }

          // Usar faucetRPC de Firebase
          const passageRpc = blockchain.faucetRPC;

          // Usar chain ID de Firebase o fallback
          const passageChainId = blockchain.chainId || "passage-testnet-1";

          manager = new FaucetManager(
            "cosmos",
            passageChainId,
            passageRpc,
            privateKeyOrMnemonic
          );
        } else {
          // Configuración para Ethereum/Story Protocol - usar configuración del blockchain
          privateKeyOrMnemonic = import.meta.env.VITE_FAUCET_PRIVATE_KEY;
          if (!privateKeyOrMnemonic) {
            console.warn("VITE_FAUCET_PRIVATE_KEY is not configured");
            return;
          }

          const chainId = parseInt(blockchain.chainId) || 1516;
          const ethereumRpc = blockchain.faucetRPC;

          manager = new FaucetManager(
            "ethereum",
            chainId,
            ethereumRpc,
            privateKeyOrMnemonic
          );
        }

        // Inicializar el manager
        console.log(`Inicializando faucet manager para: ${blockchain.name}`);
        await manager.initialize();

        try {
          const balanceInfo = await manager.getBalance();
          setBalance(balanceInfo);
        } catch (balanceError) {
          console.warn("Could not get balance, using simulated balance");
          setBalance({
            amount: "1000000000000000000",
            formatted: "1.0 ETH (simulado)",
            denom: "ETH",
            simulated: true,
          });
        }

        const validatorInfo = manager.getValidatorInfo();

        setFaucetManager(manager);
        // Solo mostrar validatorInfo para Cosmos
        if (blockchain.name === "Passage") {
          setValidatorInfo(validatorInfo);
        } else {
          setValidatorInfo(null);
        }
      } catch (error) {
        console.error("Error initializing faucet:", error);
        // No mostrar toast de error si es por variables de entorno faltantes
        if (!error.message.includes("Private key or mnemonic is required")) {
          toast.error("Error initializing faucet");
        }
      }
    };

    initializeFaucet();
  }, [blockchain]);

  const handleBlockchainChange = (blockchainId) => {
    if (blockchainId !== id) {
      navigate(`/faucets/${blockchainId}`);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsConnected(true);
      toast.success("Successfully connected with GitHub!");
    } catch (error) {
      console.error("GitHub auth error:", error);
      toast.error("Failed to connect with GitHub");
    }
  };

  const handleRequestTokens = async () => {
    if (!user || !walletAddress || isProcessing || !faucetManager) return;

    setIsProcessing(true);
    try {
      // Validar dirección según el tipo de blockchain
      if (!faucetManager.validateAddress(walletAddress)) {
        const placeholder = faucetManager.getAddressPlaceholder();
        throw new Error(
          `Formato de dirección inválido. Debe ser: ${placeholder}`
        );
      }

      const result = await faucetManager.sendTransaction(
        walletAddress,
        user.uid
      );

      // Capturar el hash de la transacción
      const hash = result.transactionHash || result.hash;
      setTransactionHash(hash);

      toast.success("¡Tokens enviados exitosamente!");

      // Actualizar balance
      const newBalance = await faucetManager.getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error("Faucet error:", error);
      toast.error(error.message || "Error sending tokens");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-morado2 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  if (!blockchain)
    return (
      <div className="min-h-screen bg-morado2 text-white flex items-center justify-center">
        Blockchain not found
      </div>
    );

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="min-h-[89vh] p-8 text-white">
        <motion.img
          src="https://appbot.nyc3.digitaloceanspaces.com/Landing_Nodefleet/home-lan.png"
          alt="home"
          className="absolute top-0 left-0 w-full h-screen"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda - Formulario del Faucet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#222038D4] p-8 rounded-2xl"
          >
            <div className="mb-8">
              <h3 className="text-gray-400 text-sm mb-2">Network</h3>
              <h1 className="text-4xl font-bold mb-4">
                {blockchain.name} Faucet
              </h1>

              {/* Selector de blockchain */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Select Blockchain
                </label>
                <select
                  value={id}
                  onChange={(e) => handleBlockchainChange(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-[#3d4954] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7a65d0]"
                >
                  {availableBlockchains.map((bc) => (
                    <option key={bc.id} value={bc.id}>
                      {bc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Información del validador para Cosmos */}
              {import.meta.env.MODE === "development" &&
                validatorInfo &&
                blockchain.name === "Passage" && (
                  <div className="mb-4 p-4 bg-[#3d4954] rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 text-[#7a65d0]">
                      Information about the Validator
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Address:</span>
                        <span className="text-white">
                          {validatorInfo.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Chain ID:</span>
                        <span className="text-white">
                          {validatorInfo.chainId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">RPC:</span>
                        <span className="text-white">
                          {validatorInfo.rpcUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {/* Balance del faucet - Solo en modo desarrollo */}
              {balance && import.meta.env.MODE === "development" && (
                <div className="mb-4 p-4 bg-[#3d4954] rounded-lg">
                  <h4 className="text-lg font-semibold mb-2 text-[#7a65d0]">
                    Faucet Balance (Dev Mode)
                  </h4>
                  <p className="text-2xl font-bold text-white">
                    {balance.formatted}
                  </p>
                </div>
              )}

              {/* Mensaje cuando no hay configuración */}
              {import.meta.env.MODE === "development" && !faucetManager && (
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2 text-yellow-400">
                    ⚠️ Required Configuration
                  </h4>
                  <p className="text-yellow-200 text-sm">
                    {blockchain.name === "Passage"
                      ? "For Passage faucet, configure VITE_PASSAGE_FAUCET_MNEMONIC (mnemonic or private key) in the environment variables."
                      : "For Story Protocol faucet, configure VITE_FAUCET_PRIVATE_KEY in the environment variables."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Paso 1 - Verificación */}
              <div className="border-l-2 border-[#3c7b97] pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3c7b97] text-white flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="text-lg mb-2">Verify your user</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Connect to your Github and validate your identity
                </p>
                <button
                  onClick={handleGithubLogin}
                  disabled={isConnected}
                  className="flex items-center gap-2 bg-[#7a65d0] px-4 py-2 rounded-lg hover:bg-[#5538ce] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isConnected ? "Connected" : "Connect"}{" "}
                  <i className="fab fa-github"></i>
                </button>
              </div>

              {/* Paso 2 - Wallet */}
              <div className="border-l-2 border-[#3c7b97] pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3c7b97] text-white flex items-center justify-center text-xs">
                  2
                </div>
                <h3 className="text-lg mb-2">Enter your wallet address</h3>
                <p className="text-gray-400 text-sm mb-2">
                  {blockchain.name === "Passage"
                    ? "Passage wallet address (starts with pasg1)"
                    : "Story Protocol wallet address (starts with 0x)"}
                </p>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={
                    faucetManager
                      ? faucetManager.getAddressPlaceholder()
                      : "..."
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#3d4954] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a65d0]"
                  disabled={!isConnected}
                />
              </div>

              {/* Paso 3 - Request Tokens */}
              <div className="border-l-2 border-[#3c7b97] pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3c7b97] text-white flex items-center justify-center text-xs">
                  3
                </div>
                <button
                  onClick={handleRequestTokens}
                  disabled={
                    !isConnected ||
                    !walletAddress ||
                    isProcessing ||
                    !faucetManager
                  }
                  className={`px-6 py-3 rounded-lg ${
                    isConnected &&
                    walletAddress &&
                    !isProcessing &&
                    faucetManager
                      ? "bg-[#7a65d0] hover:bg-[#5538ce]"
                      : "bg-gray-600 cursor-not-allowed"
                  } transition-colors`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <i className="fas fa-spinner animate-spin"></i>{" "}
                      Procesando...
                    </span>
                  ) : blockchain.name === "Passage" ? (
                    "Request tokens (1 PASG)" //  Solicitar tokens (1 PASG)
                  ) : (
                    "Request tokens (1 STORY)"
                  )}
                </button>
              </div>

              {/* Paso 4 - Transaction Hash */}
              <div className="border-l-2 border-[#3c7b97] pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3c7b97] text-white flex items-center justify-center text-xs">
                  4
                </div>
                {transactionHash ? (
                  <>
                    <h3 className="text-lg mb-2 text-green-400">
                      Transaction Completed!
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Your transaction has been processed successfully
                    </p>
                    <div className="bg-[#1a1a2e] p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Transaction Hash:
                      </p>
                      <p className="text-white font-mono text-sm break-all bg-[#0f0f1e] p-2 rounded">
                        {transactionHash}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(transactionHash)
                        }
                        className="flex items-center gap-2 bg-[#7a65d0] px-4 py-2 rounded-lg hover:bg-[#6b5bb8] transition-colors"
                      >
                        <i className="fas fa-copy"></i> Copiar Hash
                      </button>
                      <button className="flex items-center gap-2 bg-[#1DA1F2] px-4 py-2 rounded-lg hover:bg-[#1a8cd8] transition-colors">
                        Share <i className="fab fa-twitter"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg mb-2">Share a tweet about us</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Help us to get rid of the web3 scam
                    </p>
                    <button className="flex items-center gap-2 bg-[#1DA1F2] px-4 py-2 rounded-lg hover:bg-[#1a8cd8] transition-colors">
                      Share <i className="fab fa-twitter"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Columna derecha - FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#222038D4] p-8 rounded-2xl"
          >
            <h2 className="text-4xl font-bold mb-8">FAQ</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg mb-2">How do I use the faucet?</h3>
                <p className="text-gray-400">
                  Connect your Github account, enter your wallet address, and
                  request tokens. It's that simple!
                </p>
              </div>
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg mb-2">How does the faucet work?</h3>
                <p className="text-gray-400">
                  Our faucet distributes test tokens to developers for testing
                  purposes on the {blockchain.name} testnet.
                </p>
              </div>
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg mb-2">
                  I'm having issues - how do I ask for help?
                </h3>
                <p className="text-gray-400">
                  Join our Discord community for support or contact us through
                  our website.
                </p>
              </div>
              <div className="pb-4">
                <h3 className="text-lg mb-2">
                  How long will it take for me to receive my tokens?
                </h3>
                <p className="text-gray-400">
                  Tokens are usually sent within a few minutes after your
                  request is processed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Contact isFaucets={true} />
      </motion.div>
    </div>
  );
};

export default FaucetDetail;
