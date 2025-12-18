/**
 * Spotify Auth URL Generator
 * 生成 Spotify 授权 URL
 */

export default function handler(req, res) {
  // 允许 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const VERCEL_URL = process.env.VERCEL_URL;

    if (!SPOTIFY_CLIENT_ID || !VERCEL_URL) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        details: {
          clientId: !!SPOTIFY_CLIENT_ID,
          vercelUrl: !!VERCEL_URL
        }
      });
    }

    const REDIRECT_URI = `https://${VERCEL_URL}/api/spotify-callback`;

    const scope = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'streaming',
      'user-library-read',
      'user-top-read',
    ].join('%20');

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&show_dialog=true`;

    console.log('Auth URL generated:', {
      clientId: SPOTIFY_CLIENT_ID.substring(0, 8) + '...',
      redirectUri: REDIRECT_URI,
      scopes: scope.split('%20').length
    });

    res.status(200).json({ 
      authUrl,
      redirectUri: REDIRECT_URI
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate auth URL',
      message: error.message 
    });
  }
}
