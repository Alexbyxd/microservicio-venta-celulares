'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, newUser: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  // Initialize state from localStorage if available
  const [localUser, setLocalUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem(USER_KEY);
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [localToken, setLocalToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  });

  // Derive current user and token, prioritizing session data
  const user = (session?.user as User) ?? localUser;
  const token = (session?.token as string) ?? localToken;

  useEffect(() => {
    if (session?.token && session?.user) {
      // Sync localStorage with session
      localStorage.setItem(TOKEN_KEY, session.token as string);
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    }
  }, [session]);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setLocalToken(newToken);
    setLocalUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setLocalToken(null);
    setLocalUser(null);
    await nextAuthSignOut({ callbackUrl: '/' });
  }, []);

  const value = {
    user,
    token,
    isLoading: status === 'loading',
    login,
    logout,
    isAuthenticated: !!(token && user) || !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
