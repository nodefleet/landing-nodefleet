# Configuración de Discord Auth

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Frontend - Discord OAuth2
VITE_DISCORD_CLIENT_ID=tu_client_id
VITE_DISCORD_CLIENT_SECRET=tu_client_secret
VITE_DISCORD_GUILD_ID=932715756423086090
VITE_DISCORD_ROLE_ID=1424826022406127738
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/faucets/7kHOvCFdBvrTy5UXmJRH

# API Externa para verificación de Discord
VITE_BACKEND_API_URL=https://api.migration.shannon.nodefleet.net
```

## Nota sobre la API Externa

El frontend ahora usa una API externa para verificar los roles de Discord:
- **Endpoint**: `https://api.migration.shannon.nodefleet.net/api/discord/verify-member`
- Esta API está configurada externamente y no requiere un servidor local
- El bot token y la configuración del bot están gestionados en el servidor externo

## Verificación

El frontend llamará automáticamente a la API externa cuando un usuario se autentique con Discord.

