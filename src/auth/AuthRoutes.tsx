import React, { type JSX } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function AuthRoutes({ children }: { children: JSX.Element }) {
    const { token } = useAuth();
    
    return token ? children : <Navigate to="/login" replace />;
}