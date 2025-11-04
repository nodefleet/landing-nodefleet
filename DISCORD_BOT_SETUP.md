# Configuración del Bot de Discord - Guía Paso a Paso

## ⚠️ IMPORTANTE: El bot debe estar en el servidor ANTES de poder verificar miembros

## Paso 1: Ir a la Página del Bot

1. Ve a: https://discord.com/developers/applications
2. **Selecciona tu aplicación** (haz clic en el nombre)
3. En el menú lateral izquierdo, haz clic en **"Bot"** (debería estar en la sección "SETTINGS")

## Paso 2: Habilitar SERVER MEMBERS INTENT

En la página del Bot, busca la sección **"Privileged Gateway Intents"**. Debería estar cerca de la parte superior.

**Si NO ves esa sección:**
- Asegúrate de que tu bot esté creado (botón "Add Bot" si no lo tienes)
- Desplázate hacia abajo en la página
- Busca el texto "Privileged Gateway Intents"

**Cuando encuentres la sección, verás tres intents:**
1. **Presence Intent** - No necesario
2. **Server Members Intent** ⭐ **ESTE ES EL QUE NECESITAS**
3. **Message Content Intent** - No necesario

**Activa el switch de "Server Members Intent"** (debe estar en verde/azul cuando esté activado)

## Paso 3: Agregar el Bot al Servidor

**IMPORTANTE:** El bot DEBE estar en el servidor antes de poder verificar miembros.

1. En el menú lateral, haz clic en **"OAuth2"**
2. Luego haz clic en **"URL Generator"**
3. En **"SCOPES"**, marca:
   - ✅ `bot`
4. En **"BOT PERMISSIONS"**, marca:
   - ✅ `View Channels`
5. Copia la URL generada (aparece en la parte inferior)
6. Abre esa URL en tu navegador
7. Selecciona el servidor **"Passage"** (ID: 932715756423086090)
8. Haz clic en **"Authorize"**

## Paso 4: Verificar que el Bot está en el Servidor

1. Abre Discord
2. Ve al servidor "Passage"
3. En la lista de miembros, deberías ver tu bot

## Paso 5: Copiar el Bot Token

1. Vuelve a la página del Bot en Developer Portal
2. En la sección **"TOKEN"**, haz clic en **"Reset Token"** o **"Copy"**
3. Copia el token (se ve como: `MTIzNDU2Nzg5MDEyMzQ1Njc4OTA.GaBcDe.FgHiJkLmNoPqRsTuVwXyZ`)
4. Agrega este token a tu archivo `.env`:

```env
DISCORD_BOT_TOKEN=tu_token_aqui
```

## Paso 6: Configurar Variable de Entorno

Agrega la URL de la API externa a tu archivo `.env`:

```env
VITE_BACKEND_API_URL=https://api.migration.shannon.nodefleet.net
```

## Verificación Final

Después de completar estos pasos, intenta conectarte con Discord desde el frontend. El frontend usará la API externa para verificar los roles del usuario.

## Problemas Comunes

### "No veo la sección Privileged Gateway Intents"
- Asegúrate de estar en la página "Bot" (no "OAuth2" ni "General Information")
- Si acabas de crear el bot, recarga la página
- Verifica que tu aplicación esté seleccionada

### "El bot no aparece en el servidor"
- Verifica que completaste el paso 3 (agregar bot al servidor)
- Verifica que seleccionaste el servidor correcto
- Intenta generar la URL de nuevo y agregar el bot otra vez

### "Sigo recibiendo 404"
- Verifica que el SERVER MEMBERS INTENT esté activado (switch en verde)
- Verifica que el bot esté en el servidor
- Reinicia el servidor backend después de hacer cambios

