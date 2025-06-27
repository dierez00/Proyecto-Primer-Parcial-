import React, { createContext, useContext, useState, useEffect } from 'react';

interface Role {
  _id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedUser =
      localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.warn('Error al parsear usuario guardado');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User, remember: boolean) => {
    if (remember) {
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('authToken', newToken);
      sessionStorage.setItem('authUser', JSON.stringify(userData));
    }

    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
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
