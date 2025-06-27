import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import JSX from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // ["admin", "editor"]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  const userRoles = user?.roles.map(role => role.type) || [];

  const isAllowed = allowedRoles.some(role => userRoles.includes(role));

  return isAllowed ? children : <Navigate to="/unauthorized" replace />;
}
