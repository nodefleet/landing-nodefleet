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

/**
 * Genera la URL de autorización de Discord OAuth
 */
export const getDiscordAuthUrl = () => {
  console.log('🔄 [Discord Auth] Generando URL de autorización...');
  console.log('📝 [Discord Auth] Client ID:', DISCORD_CLIENT_ID);
  console.log('📝 [Discord Auth] Redirect URI:', DISCORD_REDIRECT_URI);
  
  const scopes = ['identify', 'guilds'];
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: scopes.join(' '),
  });

  const authUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  console.log('✅ [Discord Auth] URL de autorización generada:', authUrl);
  console.log('📋 [Discord Auth] Parámetros:', {
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: scopes.join(' '),
  });

  return authUrl;
};

/**
 * Intercambia el código de autorización por un token de acceso
 */
export const exchangeCodeForToken = async (code, redirectUri = null) => {
  try {
    const finalRedirectUri = redirectUri || DISCORD_REDIRECT_URI;
    console.log('🔄 [Discord Auth] Iniciando intercambio de código por token...');
    console.log('📝 [Discord Auth] Código recibido:', code);
    console.log('📝 [Discord Auth] Redirect URI a usar:', finalRedirectUri);
    console.log('📝 [Discord Auth] Redirect URI por defecto:', DISCORD_REDIRECT_URI);
    
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

    console.log('📡 [Discord Auth] Respuesta del API de token:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ [Discord Auth] Token exchange error:', error);
      throw new Error(error.error_description || 'Error exchanging code for token');
    }

    const data = await response.json();
    console.log('✅ [Discord Auth] Token exchange exitoso:', {
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
      access_token: data.access_token ? '***TOKEN_RECIBIDO***' : 'NO_TOKEN',
    });
    return data.access_token;
  } catch (error) {
    console.error('❌ [Discord Auth] Error intercambiando código por token:', error);
    throw error;
  }
};

/**
 * Obtiene información del usuario de Discord
 */
export const getDiscordUser = async (accessToken) => {
  try {
    console.log('🔄 [Discord Auth] Obteniendo información del usuario...');
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('📡 [Discord Auth] Respuesta del API de usuario:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [Discord Auth] Error obteniendo usuario:', errorData);
      throw new Error('Error obtaining user information');
    }

    const userData = await response.json();
    console.log('✅ [Discord Auth] Usuario obtenido:', {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar ? '***AVATAR_PRESENTE***' : 'NO_AVATAR',
      email: userData.email || 'NO_EMAIL',
      verified: userData.verified,
    });
    return userData;
  } catch (error) {
    console.error('❌ [Discord Auth] Error obteniendo usuario de Discord:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario es miembro del servidor (guild) especificado
 * Obtiene la lista de servidores del usuario y verifica si el servidor está en la lista
 */
export const verifyGuildMembership = async (accessToken, userId) => {
  try {
    console.log('🔄 [Discord Auth] Verificando membresía del servidor...');
    console.log('📝 [Discord Auth] User ID:', userId);
    console.log('📝 [Discord Auth] Guild ID esperado:', DISCORD_GUILD_ID);
    
    // Obtener lista de servidores del usuario
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('📡 [Discord Auth] Respuesta del API de guilds:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
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
    console.log('📋 [Discord Auth] Lista de guilds del usuario:', {
      totalGuilds: guilds.length,
      guilds: guilds.map(g => ({ id: g.id, name: g.name })),
    });

    // Buscar el servidor específico en la lista
    const guild = guilds.find(g => g.id === DISCORD_GUILD_ID);

    if (!guild) {
      console.warn('⚠️ [Discord Auth] Usuario NO es miembro del servidor requerido');
      return null; // Usuario no es miembro del servidor
    }

    console.log('✅ [Discord Auth] Usuario ES miembro del servidor:', {
      guildId: guild.id,
      guildName: guild.name,
    });

    // Si encontramos el servidor, obtener información del miembro
    // Nota: Para obtener roles, necesitaríamos usar un endpoint diferente con bot token
    // Por ahora, verificaremos roles usando el endpoint de guild members
    try {
      console.log('🔄 [Discord Auth] Obteniendo información del miembro...');
      const memberResponse = await fetch(
        `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('📡 [Discord Auth] Respuesta del API de member:', {
        status: memberResponse.status,
        statusText: memberResponse.statusText,
        ok: memberResponse.ok,
      });

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        console.log('✅ [Discord Auth] Información del miembro obtenida:', {
          user: memberData.user ? {
            id: memberData.user.id,
            username: memberData.user.username,
          } : 'NO_USER',
          roles: memberData.roles || [],
          totalRoles: (memberData.roles || []).length,
        });
        return memberData;
      }

      // Si el endpoint falla, retornamos la información básica del guild
      console.warn('⚠️ [Discord Auth] No se pudo obtener información del miembro, usando info básica');
      return { id: guild.id, roles: [] };
    } catch (e) {
      console.warn('⚠️ [Discord Auth] Error al obtener detalles del miembro:', e);
      // Si no podemos obtener detalles del miembro, retornamos que sí es miembro
      return { id: guild.id, roles: [] };
    }
  } catch (error) {
    console.error('❌ [Discord Auth] Error verificando membresía del servidor:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario tiene el rol especificado
 * Esta función requiere que el bot de la aplicación tenga permisos para ver roles
 */
export const verifyUserRole = async (accessToken, userId) => {
  try {
    console.log('🔄 [Discord Auth] Verificando rol del usuario...');
    console.log('📝 [Discord Auth] Role ID requerido:', DISCORD_ROLE_ID);
    
    // Primero obtenemos la información del miembro en el servidor
    const memberInfo = await verifyGuildMembership(accessToken, userId);

    if (!memberInfo) {
      console.warn('⚠️ [Discord Auth] No hay información del miembro, no puede tener el rol');
      return false;
    }

    // Verificamos si el rol está en la lista de roles del miembro
    const userRoles = memberInfo.roles || [];
    console.log('📋 [Discord Auth] Roles del usuario:', {
      totalRoles: userRoles.length,
      roles: userRoles,
    });
    
    const hasRole = userRoles.includes(DISCORD_ROLE_ID);
    console.log(hasRole 
      ? '✅ [Discord Auth] Usuario TIENE el rol requerido' 
      : '❌ [Discord Auth] Usuario NO tiene el rol requerido'
    );
    
    return hasRole;
  } catch (error) {
    console.error('❌ [Discord Auth] Error verificando rol del usuario:', error);
    throw error;
  }
};

/**
 * Autentica al usuario con Discord y valida membresía y rol
 * @param {string} code - Código de autorización
 * @param {string} redirectUri - URI de redirección usada (opcional)
 * @returns {Promise<{user: Object, isValid: boolean, error?: string}>}
 */
export const authenticateAndValidateDiscord = async (code, redirectUri = null) => {
  try {
    console.log('🚀 [Discord Auth] ========================================');
    console.log('🚀 [Discord Auth] INICIANDO AUTENTICACIÓN Y VALIDACIÓN');
    console.log('🚀 [Discord Auth] ========================================');
    console.log('📝 [Discord Auth] Código recibido:', code);
    console.log('📝 [Discord Auth] Redirect URI recibido:', redirectUri);
    
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

    console.log('📝 [Discord Auth] Redirect URI final:', finalRedirectUri);
    console.log('📝 [Discord Auth] Client ID:', DISCORD_CLIENT_ID);
    console.log('📝 [Discord Auth] Guild ID:', DISCORD_GUILD_ID);
    console.log('📝 [Discord Auth] Role ID:', DISCORD_ROLE_ID);

    // 1. Intercambiar código por token
    console.log('\n📌 [Discord Auth] PASO 1: Intercambiando código por token...');
    const accessToken = await exchangeCodeForToken(code, finalRedirectUri);

    // 2. Obtener información del usuario
    console.log('\n📌 [Discord Auth] PASO 2: Obteniendo información del usuario...');
    const user = await getDiscordUser(accessToken);

    // 3. Verificar membresía del servidor
    console.log('\n📌 [Discord Auth] PASO 3: Verificando membresía del servidor...');
    const isGuildMember = await verifyGuildMembership(accessToken, user.id);

    if (!isGuildMember) {
      console.error('❌ [Discord Auth] VALIDACIÓN FALLIDA: No es miembro del servidor');
      return {
        user: null,
        isValid: false,
        error: 'You are not a member of the required server',
      };
    }

    // 4. Verificar rol
    console.log('\n📌 [Discord Auth] PASO 4: Verificando rol del usuario...');
    const hasRole = await verifyUserRole(accessToken, user.id);

    if (!hasRole) {
      console.error('❌ [Discord Auth] VALIDACIÓN FALLIDA: No tiene el rol requerido');
      return {
        user: null,
        isValid: false,
        error: 'You do not have the required "faucet" role',
      };
    }

    // 5. Todo está correcto
    console.log('\n✅ [Discord Auth] ========================================');
    console.log('✅ [Discord Auth] AUTENTICACIÓN EXITOSA');
    console.log('✅ [Discord Auth] ========================================');
    console.log('✅ [Discord Auth] Usuario validado:', {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
    });
    
    const result = {
      user: {
        ...user,
        accessToken, // Guardamos el token por si se necesita más tarde
      },
      isValid: true,
    };
    
    console.log('📦 [Discord Auth] Resultado final completo:', {
      isValid: result.isValid,
      user: {
        id: result.user.id,
        username: result.user.username,
        hasAccessToken: !!result.user.accessToken,
      },
    });
    
    return result;
  } catch (error) {
    console.error('❌ [Discord Auth] ========================================');
    console.error('❌ [Discord Auth] ERROR EN AUTENTICACIÓN');
    console.error('❌ [Discord Auth] ========================================');
    console.error('❌ [Discord Auth] Error:', error);
    console.error('❌ [Discord Auth] Mensaje:', error.message);
    console.error('❌ [Discord Auth] Stack:', error.stack);
    
    return {
      user: null,
      isValid: false,
      error: error.message || 'Error authenticating with Discord',
    };
  }
};

