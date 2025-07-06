import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '2431fa0ab44c44c9bd519c9178055f5d';
const CLIENT_SECRET = '3448c198ba8f4d8ba84c3fe6564aee6c';
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState('');
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const fullUrl = window.location.href;
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    
    const debugData = `
Debug Information:
- Full URL: ${fullUrl}
- Pathname: ${pathname}
- Hash: ${hash}
- Search: ${search}
- Expected pathname: /callback
- Current time: ${new Date().toLocaleTimeString()}
    `;
    
    console.log('SpotifyCallback component mounted');
    console.log(debugData);
    setDebugInfo(debugData);
    
    // Handle Authorization Code flow
    const urlParams = new URLSearchParams(search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    console.log('Authorization code:', code ? 'Found' : 'Not found');
    console.log('Error:', error);
    
    if (error) {
      console.error('Spotify authorization error:', error);
      setStatus(`Error: ${error}`);
      alert(`Spotify authorization error: ${error}`);
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    if (code) {
      setStatus('Exchanging code for access token...');
      exchangeCodeForToken(code);
    } else {
      console.error('No authorization code found in URL');
      setStatus('No authorization code found');
      setTimeout(() => {
        if (confirm('No authorization code found. Would you like to try again?')) {
          navigate('/');
        }
      }, 5000);
    }
  }, [navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      const codeVerifier = localStorage.getItem('spotify_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found. Please try logging in again.');
      }

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
      });

      console.log('Exchanging code for token...');
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      const data = await response.json();
      console.log('Token exchange response:', data);

      if (data.access_token) {
        localStorage.setItem('spotify_access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        localStorage.removeItem('spotify_code_verifier'); // Clean up
        
        console.log('Access token stored successfully');
        setStatus('Successfully authenticated! Redirecting...');
        alert('Successfully connected to Spotify!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error(data.error_description || 'Failed to get access token');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      setStatus(`Token exchange failed: ${error.message}`);
      alert(`Failed to complete authentication: ${error.message}`);
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-amber-900 mb-2">Processing Spotify Authentication...</h2>
        <p className="text-amber-700 mb-4">{status}</p>
        
        {debugInfo && (
          <div className="bg-white/80 rounded-lg p-4 text-left text-sm font-mono text-gray-700 mt-4">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <pre className="whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 