/**
 * Utilidad para autenticación y validación de Discord
 * Valida que el usuario esté en un servidor específico y tenga un rol determinado
 */

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const DISCORD_GUILD_ID = import.meta.env.VITE_DISCORD_GUILD_ID;
const DISCORD_ROLE_ID = import.meta.env.VITE_DISCORD_ROLE_ID;
const DISCORD_REDIRECT_URI = window.location.origin + window.location.pathname;
const DISCORD_API_BASE = 'https://discord.com/api/v10';

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
  
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

/**
 * Intercambia el código de autorización por un token de acceso
 */
export const exchangeCodeForToken = async (code) => {
  try {
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
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Error al intercambiar código por token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error intercambiando código por token:', error);
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
      throw new Error('Error al obtener información del usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo usuario de Discord:', error);
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
      throw new Error('Error al obtener servidores del usuario');
    }

    const guilds = await response.json();
    
    // Buscar el servidor específico en la lista
    const guild = guilds.find(g => g.id === DISCORD_GUILD_ID);
    
    if (!guild) {
      return null; // Usuario no es miembro del servidor
    }

    // Si encontramos el servidor, obtener información del miembro
    // Nota: Para obtener roles, necesitaríamos usar un endpoint diferente con bot token
    // Por ahora, verificaremos roles usando el endpoint de guild members
    try {
      const memberResponse = await fetch(
        `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (memberResponse.ok) {
        return await memberResponse.json();
      }
      
      // Si el endpoint falla, retornamos la información básica del guild
      return { id: guild.id, roles: [] };
    } catch (e) {
      // Si no podemos obtener detalles del miembro, retornamos que sí es miembro
      return { id: guild.id, roles: [] };
    }
  } catch (error) {
    console.error('Error verificando membresía del servidor:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario tiene el rol especificado
 * Esta función requiere que el bot de la aplicación tenga permisos para ver roles
 */
export const verifyUserRole = async (accessToken, userId) => {
  try {
    // Primero obtenemos la información del miembro en el servidor
    const memberInfo = await verifyGuildMembership(accessToken, userId);
    
    if (!memberInfo) {
      return false;
    }

    // Verificamos si el rol está en la lista de roles del miembro
    const userRoles = memberInfo.roles || [];
    return userRoles.includes(DISCORD_ROLE_ID);
  } catch (error) {
    console.error('Error verificando rol del usuario:', error);
    throw error;
  }
};

/**
 * Autentica al usuario con Discord y valida membresía y rol
 * @returns {Promise<{user: Object, isValid: boolean, error?: string}>}
 */
export const authenticateAndValidateDiscord = async (code) => {
  try {
    // 1. Intercambiar código por token
    const accessToken = await exchangeCodeForToken(code);
    
    // 2. Obtener información del usuario
    const user = await getDiscordUser(accessToken);
    
    // 3. Verificar membresía del servidor
    const isGuildMember = await verifyGuildMembership(accessToken, user.id);
    
    if (!isGuildMember) {
      return {
        user: null,
        isValid: false,
        error: 'No eres miembro del servidor requerido',
      };
    }

    // 4. Verificar rol
    const hasRole = await verifyUserRole(accessToken, user.id);
    
    if (!hasRole) {
      return {
        user: null,
        isValid: false,
        error: 'No tienes el rol "faucet" requerido',
      };
    }

    // 5. Todo está correcto
    return {
      user: {
        ...user,
        accessToken, // Guardamos el token por si se necesita más tarde
      },
      isValid: true,
    };
  } catch (error) {
    return {
      user: null,
      isValid: false,
      error: error.message || 'Error al autenticar con Discord',
    };
  }
};

