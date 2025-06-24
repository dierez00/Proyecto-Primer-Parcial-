import { createContext, use, useContext } from 'react';
import { useState, useEffect } from 'react';

//Crear el contexto e inicializarlo
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (stored) {
            setToken(stored);
        }
    }, []);
    
    const login = (newToken:string) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}