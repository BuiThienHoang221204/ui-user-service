import { useEffect, useState } from 'react';

export type SessionUser = {
  id?: string | number;
  _id?: string;
  userId?: string | number;
  name?: string;
  avatarUrl?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthSession = {
  accessToken: string | null;
  user: SessionUser | null;
};

const ACCESS_TOKEN_KEYS = ['auth_access_token', 'authToken'];
const USER_KEYS = ['auth_user', 'authUser'];

const readStoredUser = (): SessionUser | null => {
  if (typeof window === 'undefined') return null;

  for (const key of USER_KEYS) {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) continue;

    try {
      return JSON.parse(rawValue) as SessionUser;
    } catch {
      continue;
    }
  }

  return null;
};

export const readStoredSession = (): AuthSession => {
  if (typeof window === 'undefined') {
    return { accessToken: null, user: null };
  }

  const accessToken =
    ACCESS_TOKEN_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean) || null;

  return {
    accessToken,
    user: readStoredUser(),
  };
};

export const saveStoredSession = (accessToken: string, user: SessionUser | null) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem('auth_access_token', accessToken);
  window.localStorage.setItem('authToken', accessToken);

  if (user) {
    window.localStorage.setItem('auth_user', JSON.stringify(user));
    window.localStorage.setItem('authUser', JSON.stringify(user));
  }
};

export const useAuthSession = () => {
  const [session, setSession] = useState<AuthSession>(() => readStoredSession());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;

      if (!data || typeof data !== 'object') return;

      if (data.type === 'auth-login' && typeof data.accessToken === 'string') {
        const nextUser = data.user && typeof data.user === 'object' ? (data.user as SessionUser) : null;
        saveStoredSession(data.accessToken, nextUser);
        setSession(readStoredSession());
      }
    };

    window.addEventListener('message', handleMessage);
    setIsReady(true);

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'auth-ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return {
    ...session,
    isReady,
  };
};