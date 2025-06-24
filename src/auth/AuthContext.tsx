import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = (newToken: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('authToken', newToken);
    } else {
      sessionStorage.setItem('authToken', newToken);
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
}
