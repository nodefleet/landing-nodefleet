/**
 * Utilidad para autenticación y validación de Discord
 * Valida que el usuario esté en un servidor específico y tenga un rol determinado
 */

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const DISCORD_GUILD_ID = import.meta.env.VITE_DISCORD_GUILD_ID;
const DISCORD_ROLE_ID = import.meta.env.VITE_DISCORD_ROLE_ID;
// Usar una URI de redirección fija basada en el origin (sin pathname)
// Esto debe coincidir exactamente con la configurada en Discord Developer Portal
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI || window.location.origin;
const DISCORD_API_BASE = 'https://discord.com/api/v10';
// URL del backend para verificar roles (evita CORS)
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Genera la URL de autorización de Discord OAuth
 */
export const getDiscordAuthUrl = () => {
  const scopes = ['identify', 'guilds'];
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: scopes.join(' '),
  });

  const authUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  return authUrl;
};

/**
 * Intercambia el código de autorización por un token de acceso
 */
export const exchangeCodeForToken = async (code, redirectUri = null) => {
  try {
    const finalRedirectUri = redirectUri || DISCORD_REDIRECT_URI;
    
    // Usamos Client ID y Secret para intercambiar el código
    // ⚠️ En un entorno de producción, esto debería hacerse en el backend
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: finalRedirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ [Discord Auth] Token exchange error:', error);
      throw new Error(error.error_description || 'Error exchanging code for token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ [Discord Auth] Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Obtiene información del usuario de Discord
 */
export const getDiscordUser = async (accessToken) => {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [Discord Auth] Error obteniendo usuario:', errorData);
      throw new Error('Error obtaining user information');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('❌ [Discord Auth] Error getting Discord user:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario es miembro del servidor (guild) especificado
 * Obtiene la lista de servidores del usuario y verifica si el servidor está en la lista
 */
export const verifyGuildMembership = async (accessToken, userId) => {
  try {
    // Obtener lista de servidores del usuario
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid or expired access token');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      throw new Error('Error obtaining user servers');
    }

    const guilds = await response.json();

    // Buscar el servidor específico en la lista
    const guild = guilds.find(g => g.id === DISCORD_GUILD_ID);

    if (!guild) {
      return null; // User is not a member of the server
    }

    // Si encontramos el servidor, obtener información del miembro con roles
    // Usar backend para evitar CORS y usar bot token
    try {
      const backendResponse = await fetch(`${BACKEND_API_URL}/api/discord/verify-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          accessToken: accessToken, // Por si el backend necesita validar algo
        }),
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        
        // Retornar en formato compatible con el código existente
        return {
          id: guild.id,
          user: {
            id: backendData.member.id,
            username: backendData.member.username,
          },
          roles: backendData.member.roles || [],
        };
      }

      // Si el backend falla, retornamos la información básica del guild
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error('❌ [Discord Auth] Backend error:', errorData.message || 'Unknown error');
      return { id: guild.id, roles: [] };
    } catch (e) {
      console.error('❌ [Discord Auth] Error getting member details via backend:', e);
      // If we can't get member details, return that they are a member
      return { id: guild.id, roles: [] };
    }
  } catch (error) {
    console.error('❌ [Discord Auth] Error verifying server membership:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario tiene el rol especificado
 * @param {Object} memberInfo - Información del miembro obtenida de verifyGuildMembership
 */
export const verifyUserRole = (memberInfo) => {
  if (!memberInfo) {
    return false;
  }

  // Verificamos si el rol está en la lista de roles del miembro
  const userRoles = memberInfo.roles || [];
  return userRoles.includes(DISCORD_ROLE_ID);
};

/**
 * Autentica al usuario con Discord y valida membresía y rol
 * @param {string} code - Código de autorización
 * @param {string} redirectUri - URI de redirección usada (opcional)
 * @returns {Promise<{user: Object, isValid: boolean, error?: string}>}
 */
export const authenticateAndValidateDiscord = async (code, redirectUri = null) => {
  try {
    // Determinar el redirect_uri si no se proporciona
    let finalRedirectUri = redirectUri;
    if (!finalRedirectUri && typeof window !== 'undefined') {
      // Usar la ruta completa con hash si está disponible
      if (window.location.hash) {
        const hashPath = window.location.hash.split('?')[0];
        finalRedirectUri = window.location.origin + hashPath;
      } else {
        finalRedirectUri = DISCORD_REDIRECT_URI;
      }
    }
    if (!finalRedirectUri) {
      finalRedirectUri = DISCORD_REDIRECT_URI;
    }

    // 1. Intercambiar código por token
    const accessToken = await exchangeCodeForToken(code, finalRedirectUri);

    // 2. Obtener información del usuario
    const user = await getDiscordUser(accessToken);

    // 3. Verificar membresía del servidor (obtiene memberInfo con roles)
    const memberInfo = await verifyGuildMembership(accessToken, user.id);

    if (!memberInfo) {
      console.error('❌ [Discord Auth] VALIDATION FAILED: Not a member of the server');
      return {
        user: null,
        isValid: false,
        error: 'You are not a member of the Passage Discord server. Join the Passage server and request the developers role.',
      };
    }

    // 4. Verificar rol usando la información del miembro ya obtenida
    const hasRole = verifyUserRole(memberInfo);

    if (!hasRole) {
      console.error('❌ [Discord Auth] VALIDATION FAILED: Does not have the required role');
      return {
        user: null,
        isValid: false,
        error: 'You do not have the required "developers" role. Join the Passage server and request the developers role.',
      };
    }

    // 5. Todo está correcto
    const result = {
      user: {
        ...user,
        accessToken, // Guardamos el token por si se necesita más tarde
      },
      isValid: true,
    };
    
    return result;
  } catch (error) {
    console.error('❌ [Discord Auth] Authentication error:', error);
    
    return {
      user: null,
      isValid: false,
      error: error.message || 'Error authenticating with Discord',
    };
  }
};

