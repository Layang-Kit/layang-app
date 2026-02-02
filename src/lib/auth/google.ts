import { Google } from 'arctic';
import { dev } from '$app/environment';

const GOOGLE_CLIENT_ID = dev 
  ? process.env.GOOGLE_CLIENT_ID || '' 
  : (import.meta.env?.GOOGLE_CLIENT_ID as string) || '';

const GOOGLE_CLIENT_SECRET = dev 
  ? process.env.GOOGLE_CLIENT_SECRET || '' 
  : (import.meta.env?.GOOGLE_CLIENT_SECRET as string) || '';

const BASE_URL = dev ? 'http://localhost:5173' : 'https://your-production-url.pages.dev';

// Create Google OAuth client
export function createGoogleOAuthClient(): Google | null {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not configured');
    return null;
  }
  
  return new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${BASE_URL}/auth/google/callback`
  );
}

// Generate state for OAuth
export function generateState(): string {
  const state = crypto.randomUUID();
  return state;
}

// Generate code verifier for PKCE
export function generateCodeVerifier(): string {
  const verifier = crypto.randomUUID() + crypto.randomUUID();
  return verifier;
}

// Google User Info response type
export interface GoogleUserInfo {
  sub: string;        // Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

// Fetch Google user info
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }
  
  return response.json();
}
