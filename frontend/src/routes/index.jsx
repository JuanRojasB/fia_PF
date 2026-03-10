import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Componente de ruta pública (redirige si ya está autenticado)
const PublicRoute = ({ children }) => {
  return !authService.isAuthenticated() ? children : <Navigate to="/home" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Rutas protegidas */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Ruta 404 - Redirige según autenticación */}
      <Route 
        path="*" 
        element={
          authService.isAuthenticated() ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
    </Routes>
  );
}
