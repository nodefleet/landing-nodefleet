# Configuración de Validación Discord para Faucet de Passage

## Descripción

Esta funcionalidad permite validar que los usuarios estén en un servidor de Discord específico y tengan el rol "faucet" antes de poder solicitar tokens del faucet de Passage. La validación se realiza completamente desde el frontend usando Discord OAuth2.

## Funcionalidades Desarrolladas

### 1. Autenticación OAuth2 con Discord
- El usuario hace clic en el botón "Connect" de Discord
- Se redirige a Discord para autorizar la aplicación
- Discord devuelve un código de autorización
- El código se intercambia por un token de acceso

### 2. Validación de Membresía del Servidor
- Verifica que el usuario sea miembro del servidor (Guild) especificado
- Utiliza la API de Discord para verificar la membresía

### 3. Validación de Rol
- Verifica que el usuario tenga el rol "faucet" en el servidor
- Compara los roles del usuario con el ID del rol requerido

### 4. Integración con Faucet
- El botón de Discord solo está disponible para el faucet de Passage (ID: `7kHOvCFdBvrTy5UXmJRH`)
- Los usuarios pueden elegir entre autenticarse con GitHub o Discord
- Una vez validado Discord, pueden proceder a solicitar tokens

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env`:

```env
VITE_DISCORD_CLIENT_ID=tu_client_id_aqui
VITE_DISCORD_CLIENT_SECRET=tu_client_secret_aqui
VITE_DISCORD_GUILD_ID=tu_guild_id_aqui
VITE_DISCORD_ROLE_ID=tu_role_id_aqui
```

## Cómo Obtener Cada Variable

### 1. VITE_DISCORD_CLIENT_ID (Client ID de Discord)

**¿Qué es?**
- El identificador único de tu aplicación de Discord.

**¿Dónde obtenerlo?**
1. Ve a https://discord.com/developers/applications
2. Inicia sesión con tu cuenta de Discord
3. Haz clic en "New Application" o selecciona una aplicación existente
4. En el menú lateral, selecciona "OAuth2"
5. En la sección "Client Information", copia el valor de "Client ID"
6. Pégalo en tu archivo `.env` como `VITE_DISCORD_CLIENT_ID`

### 2. VITE_DISCORD_CLIENT_SECRET (Client Secret de Discord)

**¿Qué es?**
- Una clave secreta que autentica tu aplicación. Normalmente no se expone en frontend por seguridad, pero es necesaria para este caso de uso.

**¿Dónde obtenerlo?**
1. En la misma página de OAuth2 de tu aplicación
2. En la sección "Client Information", haz clic en "Reset Secret" si no lo has visto antes (o copia el existente)
3. ⚠️ **ADVERTENCIA**: Mantén este valor seguro. No lo compartas públicamente
4. Copia el valor de "Client Secret"
5. Pégalo en tu archivo `.env` como `VITE_DISCORD_CLIENT_SECRET`

### 3. VITE_DISCORD_GUILD_ID (ID del Servidor)

**¿Qué es?**
- El identificador único del servidor de Discord donde los usuarios deben estar.

**¿Dónde obtenerlo?**
1. Abre Discord (aplicación de escritorio o web)
2. Ve a Configuración de Usuario > Avanzado
3. Activa "Modo desarrollador"
4. En el servidor de Discord donde quieres que validemos:
   - Haz clic derecho sobre el nombre del servidor (icono del servidor)
   - Selecciona "Copiar ID" (solo aparece con el modo desarrollador activado)
5. Copia el ID obtenido
6. Pégalo en tu archivo `.env` como `VITE_DISCORD_GUILD_ID`

**Ejemplo visual:**
```
Servidor: "Mi Servidor" → Click derecho → "Copiar ID" → "123456789012345678"
```

### 4. VITE_DISCORD_ROLE_ID (ID del Rol "faucet")

**¿Qué es?**
- El identificador único del rol que los usuarios deben tener para poder usar el faucet.

**¿Dónde obtenerlo?**
1. Con el modo desarrollador activado (paso anterior)
2. En el servidor de Discord:
   - Ve a Configuración del servidor (click derecho en el servidor → "Configuración del servidor")
   - Selecciona "Roles" en el menú lateral
   - Encuentra el rol llamado "faucet" (o el nombre que hayas elegido)
   - Haz clic derecho sobre el rol
   - Selecciona "Copiar ID"
3. Copia el ID obtenido
4. Pégalo en tu archivo `.env` como `VITE_DISCORD_ROLE_ID`

**Nota importante:**
- Asegúrate de que el rol "faucet" exista en tu servidor
- El rol puede tener cualquier nombre, pero debes usar su ID

## Configuración de OAuth2 en Discord Developer Portal

Además de obtener los IDs, necesitas configurar los Redirect URIs:

1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación
3. Ve a "OAuth2" → "General"
4. En "Redirects", agrega la URL de tu aplicación:
   - Para desarrollo: `http://localhost:3000/#/faucets/7kHOvCFdBvrTy5UXmJRH`
   - Para producción: `https://tu-dominio.com/#/faucets/7kHOvCFdBvrTy5UXmJRH`
5. Haz clic en "Add Redirect"
6. Guarda los cambios

## Permisos de OAuth2 Requeridos

En la sección "OAuth2" → "URL Generator", asegúrate de tener seleccionados:
- `identify` - Para obtener información básica del usuario
- `guilds` - Para verificar membresía del servidor

## Flujo de Uso

1. **Usuario visita el faucet de Passage**
   - URL: `http://localhost:3000/#/faucets/7kHOvCFdBvrTy5UXmJRH`
   - Solo este ID de faucet muestra el botón de Discord

2. **Usuario hace clic en "Connect" (Discord)**
   - Se abre la ventana de autorización de Discord
   - Usuario autoriza la aplicación

3. **Discord redirige de vuelta con código**
   - La aplicación intercambia el código por un token
   - Valida que el usuario esté en el servidor
   - Valida que tenga el rol "faucet"

4. **Si todo es válido:**
   - Se muestra mensaje de éxito
   - El usuario puede proceder a ingresar su wallet y solicitar tokens

5. **Si no es válido:**
   - Se muestra un mensaje de error específico:
     - "No eres miembro del servidor requerido"
     - "No tienes el rol 'faucet' requerido"

## Archivos Modificados/Creados

### Archivos Nuevos:
- `src/utils/discordAuth.js` - Utilidad para autenticación y validación de Discord

### Archivos Modificados:
- `src/Pages/FaucetDetail.jsx` - Agregado botón de Discord y lógica de validación

## Estructura del Código

### `discordAuth.js`

Funciones principales:
- `getDiscordAuthUrl()` - Genera la URL de autorización OAuth2
- `exchangeCodeForToken(code)` - Intercambia código por token de acceso
- `getDiscordUser(accessToken)` - Obtiene información del usuario
- `verifyGuildMembership(accessToken, userId)` - Verifica membresía del servidor
- `verifyUserRole(accessToken, userId)` - Verifica que tenga el rol requerido
- `authenticateAndValidateDiscord(code)` - Función principal que coordina todo el proceso

### `FaucetDetail.jsx`

Cambios principales:
- Estados agregados: `discordConnected`, `discordUser`
- Función `handleDiscordLogin()` - Inicia el flujo OAuth
- Función `handleDiscordCallback()` - Procesa el callback de Discord
- Botón de Discord condicionado al ID `7kHOvCFdBvrTy5UXmJRH`
- Lógica actualizada para aceptar GitHub o Discord como autenticación

## Notas de Seguridad y Limitaciones

⚠️ **Advertencias importantes:**

1. **Client Secret en Frontend:**
   - El `Client Secret` normalmente NO debe exponerse en frontend
   - En producción, considera usar un backend que mantenga el secret seguro
   - La implementación actual funciona pero tiene limitaciones de seguridad

2. **Verificación de Roles:**
   - Para verificar roles completamente, Discord requiere un Bot Token
   - La implementación actual intenta verificar roles usando OAuth2 user token, pero esto tiene limitaciones
   - Si el endpoint de verificación de roles falla, la validación solo verifica membresía del servidor
   - **Recomendación**: Para verificar roles de manera confiable, considera agregar un backend con un bot de Discord que tenga permisos para ver roles

3. **Solución Completa:**
   - Para una solución de producción más segura:
     - Mueve la validación de Discord a un backend
     - Crea un bot de Discord con permisos adecuados
     - El backend puede verificar roles usando el bot token de manera segura

## Solución de Problemas

### Error: "Invalid redirect_uri"
- Verifica que la URL en "Redirects" del Developer Portal coincida exactamente con la URL de tu aplicación
- Incluye el protocolo (`http://` o `https://`)
- Incluye la ruta completa (`/#/faucets/7kHOvCFdBvrTy5UXmJRH`)

### Error: "No eres miembro del servidor requerido"
- Verifica que el `VITE_DISCORD_GUILD_ID` sea correcto
- Asegúrate de que el usuario esté en ese servidor
- Verifica que la aplicación tenga permisos para ver el servidor

### Error: "No tienes el rol 'faucet' requerido"
- Verifica que el `VITE_DISCORD_ROLE_ID` sea correcto
- Asegúrate de que el usuario tenga ese rol asignado
- Verifica que el rol exista en el servidor

### El botón de Discord no aparece
- Verifica que estés en el faucet correcto (ID: `7kHOvCFdBvrTy5UXmJRH`)
- Verifica que las variables de entorno estén configuradas
- Recarga la página después de configurar las variables de entorno

## Referencias

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
- [Discord API Documentation](https://discord.com/developers/docs/reference)

