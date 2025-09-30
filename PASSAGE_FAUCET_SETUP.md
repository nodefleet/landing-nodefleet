# Configuración del Faucet de Passage

## Descripción

El faucet de Passage permite a los desarrolladores obtener tokens de prueba (PASG) para desarrollar en la testnet de Passage usando la librería InterchainJS.

## Características

- ✅ Integración con InterchainJS para transacciones de Cosmos
- ✅ Autenticación con GitHub
- ✅ Límite de 24 horas por usuario
- ✅ Interfaz personalizada para Passage
- ✅ Información del validador integrada
- ✅ Balance del faucet en tiempo real

## Configuración

### 1. Variables de Entorno

Agrega la siguiente variable de entorno a tu archivo `.env`:

```bash
REACT_APP_PASSAGE_FAUCET_MNEMONIC="tu mnemonic de 12 palabras aquí"
```

### 2. Información del Validador

El faucet está configurado con la siguiente información del validador:

```javascript
{
  name: "validator",
  type: "local",
  address: "pasg1g6tyvjmqa9hsy4839ce0rd5me8qsadnwtel3t3",
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ajd9ND7EAoBswjOQtD/DPi/0/1FHg73/O9dSiRQDFYZ9"}',
  mnemonic: "" // Se configura en las variables de entorno
}
```

### 3. Configuración de la Red

- **Chain ID**: `pasg-testnet-1`
<!-- - **RPC URL**: `https://tendermint-pasg.testnet.us.nodefleet.net` -->
- **Denominación**: `upasg` (6 decimales)
- **Prefijo de dirección**: `pasg`
- **Cantidad por solicitud**: 1 PASG (1,000,000 upasg)

## Uso

### Para Usuarios

1. Navega a la página de faucets
2. Busca "Passage" en la lista
3. Haz clic en el botón "Faucet"
4. Conecta tu cuenta de GitHub
5. Ingresa tu dirección de wallet de Passage (debe comenzar con 'pasg1')
6. Solicita tokens

### Para Desarrolladores

El faucet está disponible en la ruta `/faucets/passage` y utiliza:

- **PassageFaucetManager**: Clase personalizada que maneja las transacciones usando InterchainJS
- **InterchainJS**: Librería para interactuar con blockchains de Cosmos
- **Firebase**: Para almacenar el historial de transacciones y límites de tiempo

## Estructura de Archivos

```
src/
├── utils/
│   └── passageFaucetManager.js    # Clase para manejar transacciones de Passage
├── Pages/
│   └── PassageFaucet.jsx          # Página específica del faucet de Passage
└── App.js                         # Rutas actualizadas
```

## Dependencias

- `@interchainjs/cosmos`: Para transacciones de Cosmos
- `@interchainjs/types`: Tipos de TypeScript para InterchainJS
- `firebase`: Para autenticación y base de datos
- `react-hot-toast`: Para notificaciones

## Notas Importantes

- El faucet requiere un mnemonic válido con fondos en la testnet de Passage
- Los usuarios solo pueden solicitar tokens una vez cada 24 horas
- Las direcciones deben ser válidas para la red Passage (prefijo 'pasg1')
- El faucet muestra el balance actual y la información del validador

## Troubleshooting

- Si el faucet no se inicializa, verifica que el mnemonic esté configurado correctamente
- Si las transacciones fallan, verifica que el RPC esté funcionando
- Si hay errores de autenticación, verifica la configuración de Firebase
