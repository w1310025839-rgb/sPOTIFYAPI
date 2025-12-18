/**
 * Spotify OAuth Callback Handler
 * 处理 Spotify 重定向回调
 */

export default function handler(req, res) {
  const { code, error, state } = req.query;

  console.log('Callback received:', {
    hasCode: !!code,
    hasError: !!error,
    hasState: !!state
  });

  if (error) {
    console.error('Authorization error:', error);
    
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
              text-align: center;
              max-width: 400px;
            }
            h1 {
              color: #e74c3c;
              margin: 0 0 20px 0;
            }
            p {
              color: #666;
              margin: 10px 0;
            }
            .error-code {
              background: #f8f9fa;
              padding: 10px;
              border-radius: 5px;
              font-family: monospace;
              color: #e74c3c;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Authorization Failed</h1>
            <p>Spotify authorization was denied or cancelled.</p>
            <div class="error-code">${error}</div>
            <p>Please try again or contact support if the problem persists.</p>
          </div>
        </body>
      </html>
    `);
  }

  if (!code) {
    console.error('No authorization code received');
    
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
              text-align: center;
              max-width: 400px;
            }
            h1 {
              color: #e74c3c;
              margin: 0 0 20px 0;
            }
            p {
              color: #666;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Authorization Failed</h1>
            <p>No authorization code received from Spotify.</p>
            <p>Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }

  console.log('Authorization successful, code received:', code.substring(0, 10) + '...');

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authorization Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #27ae60;
            margin: 0 0 20px 0;
          }
          p {
            color: #666;
            margin: 10px 0;
          }
          .code-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .code-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .code {
            font-family: monospace;
            font-size: 14px;
            color: #333;
            word-break: break-all;
            background: white;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #ddd;
          }
          .copy-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
          }
          .copy-btn:hover {
            background: #764ba2;
          }
          .instructions {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: left;
            color: #333;
          }
          .instructions h3 {
            margin: 0 0 10px 0;
            color: #0066cc;
          }
          .instructions ol {
            margin: 0;
            padding-left: 20px;
          }
          .instructions li {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Authorization Successful!</h1>
          <p>Your Spotify account has been authorized.</p>
          
          <div class="code-section">
            <div class="code-label">Authorization Code</div>
            <div class="code" id="code">${code}</div>
            <button class="copy-btn" onclick="copyCode()">Copy Code</button>
          </div>

          <div class="instructions">
            <h3>Next Steps:</h3>
            <ol>
              <li>Copy the authorization code above</li>
              <li>Return to the Pure Player app</li>
              <li>Paste the code when prompted</li>
              <li>Your account will be connected</li>
            </ol>
          </div>

          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            You can close this window after copying the code.
          </p>
        </div>

        <script>
          function copyCode() {
            const code = document.getElementById('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
              alert('Code copied to clipboard!');
            }).catch(() => {
              alert('Failed to copy code');
            });
          }
        </script>
      </body>
    </html>
  `);
}
