```javascript
/**
 * Spotify Token Exchange
 * 交换授权码获取 access token
 */

import axios from 'axios';

export default async function handler(req, res) {
  // 允许 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const VERCEL_URL = process.env.VERCEL_URL;

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !VERCEL_URL) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        details: {
          clientId: !!SPOTIFY_CLIENT_ID,
          clientSecret: !!SPOTIFY_CLIENT_SECRET,
          vercelUrl: !!VERCEL_URL
        }
      });
    }

    const REDIRECT_URI = `https://${VERCEL_URL}/api/spotify-callback`;

    console.log('Exchanging code for token:', {
      code: code.substring(0, 10) + '...',
      redirectUri: REDIRECT_URI
    });

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Token exchange successful:', {
      accessToken: response.data.access_token.substring(0, 10) + '...',
      expiresIn: response.data.expires_in,
      hasRefreshToken: !!response.data.refresh_token
    });

    res.status(200).json({
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
      refresh_token: response.data.refresh_token || null,
    });
  } catch (error) {
    console.error('Token exchange error:', {
      status: error.response?.status,
      error: error.response?.data?.error,
      message: error.message
    });

    const errorData = error.response?.data || {};
    res.status(error.response?.status || 400).json({ 
      error: errorData.error || 'Token exchange failed',
      error_description: errorData.error_description || error.message,
      details: {
        status: error.response?.status,
        message: error.message
      }
    });
  }
}
```
