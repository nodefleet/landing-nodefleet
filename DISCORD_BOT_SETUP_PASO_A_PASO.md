# 🔧 Configuración del Bot de Discord - GUÍA COMPLETA

## ❗ IMPORTANTE: Si no ves los switches, sigue estos pasos en orden

---

## PASO 1: Verificar que tienes una Aplicación de Discord

1. Ve a: **https://discord.com/developers/applications**
2. **¿Ves una lista de aplicaciones?** 
   - ✅ **SÍ**: Selecciona la aplicación que quieres usar (haz clic en el nombre)
   - ❌ **NO**: Haz clic en el botón **"New Application"** (arriba a la derecha) y crea una nueva

---

## PASO 2: Crear el Bot (si no lo tienes)

1. En el menú lateral izquierdo, busca **"Bot"** (debería estar bajo "SETTINGS")
2. Haz clic en **"Bot"**
3. **¿Ves un botón que dice "Add Bot" o "Reset Token"?**
   - Si ves **"Add Bot"**: Haz clic para crear el bot
   - Si ves **"Reset Token"**: Ya tienes un bot, continúa al Paso 3

---

## PASO 3: Buscar "Privileged Gateway Intents"

**En la misma página "Bot"**, desplázate hacia abajo. Busca una sección que dice:

**"Privileged Gateway Intents"**

**Si NO encuentras esta sección:**
- Asegúrate de estar en la página **"Bot"** (no "OAuth2" ni otra)
- El bot debe estar creado (ver Paso 2)
- Recarga la página (F5)

**¿Qué deberías ver?**
- Un título que dice "Privileged Gateway Intents"
- Texto explicativo abajo
- Tres opciones con switches:
  1. **Presence Intent**
  2. **Server Members Intent** ⭐ **ESTE ES EL IMPORTANTE**
  3. **Message Content Intent**

---

## PASO 4: Activar SERVER MEMBERS INTENT

1. Busca la opción **"Server Members Intent"**
2. Al lado derecho debería haber un **switch/toggle** (como un interruptor)
3. Haz clic en el switch para activarlo (debe ponerse en verde/azul)

**Si NO ves el switch:**
- Asegúrate de que el bot esté creado
- Verifica que estás en la página correcta ("Bot")
- Intenta recargar la página

---

## PASO 5: Agregar el Bot al Servidor

**⚠️ ESTO ES CRÍTICO: El bot DEBE estar en el servidor**

1. En el menú lateral, haz clic en **"OAuth2"**
2. Luego haz clic en **"URL Generator"** (submenú)
3. En la sección **"SCOPES"**, marca:
   - ✅ `bot`
4. En la sección **"BOT PERMISSIONS"**, marca:
   - ✅ `View Channels`
5. **Copia la URL** que aparece abajo (será algo como: `https://discord.com/api/oauth2/authorize?...`)
6. **Abre esa URL en tu navegador**
7. Selecciona el servidor **"Passage"** (debería aparecer en un dropdown)
8. Haz clic en **"Authorize"**

---

## PASO 6: Verificar que el Bot está en el Servidor

1. Abre Discord
2. Ve al servidor **"Passage"**
3. En la lista de miembros (panel derecho), busca tu bot
4. **¿Lo ves?** ✅ Continúa | ❌ Vuelve al Paso 5

---

## PASO 7: Obtener el Bot Token

1. Vuelve a la página **"Bot"** en Developer Portal
2. Busca la sección **"TOKEN"**
3. Haz clic en **"Reset Token"** o **"Copy"**
4. **Copia el token** (guárdalo en un lugar seguro)
5. Agrégalo a tu archivo `.env`:

```env
DISCORD_BOT_TOKEN=el_token_que_copiaste
```

---

## PASO 8: Configurar Variable de Entorno

Agrega la URL de la API externa a tu archivo `.env`:

```env
VITE_BACKEND_API_URL=https://api.migration.shannon.nodefleet.net
```

---

## ✅ VERIFICACIÓN FINAL

Intenta conectarte con Discord desde el frontend. El frontend usará la API externa (`https://api.migration.shannon.nodefleet.net/api/discord/verify-member`) para verificar los roles del usuario.

---

## 🆘 ¿TODAVÍA NO VES LOS SWITCHES?

**Dime exactamente qué ves en la página "Bot":**
1. ¿Qué secciones/títulos ves en la página?
2. ¿Ves el botón "Reset Token" o "Add Bot"?
3. ¿Hay alguna sección que diga "Intents" o "Gateway"?
4. ¿Tu bot está en algún servidor?

**Con esa información te puedo ayudar mejor.**

