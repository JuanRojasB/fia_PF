import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import { User, Lock, LogIn } from 'lucide-react';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
      background: 'radial-gradient(circle at top, #020617 0, #020617 35%, #020617 40%, #020617 100%)'
    }}>
      
      {/* Orb Container - Estilo IA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center mb-12"
      >
        {/* Orb y Título FIA en línea */}
        <div className="flex items-center gap-8 mb-6">
          {/* Orb Principal */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Pulse Effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-72 h-72 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 70%)'
              }}
            />

            {/* Rotating Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 rounded-full"
              style={{
                border: '1px solid rgba(191, 219, 254, 0.4)',
                boxShadow: '0 0 18px rgba(56, 189, 248, 0.6)'
              }}
            />
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 rounded-full"
              style={{
                border: '1px solid rgba(129, 140, 248, 0.6)',
                boxShadow: '0 0 18px rgba(56, 189, 248, 0.6)'
              }}
            />

            {/* Core Orb */}
            <motion.div
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #1f2937, #020617 70%)',
                boxShadow: '0 0 32px rgba(56, 189, 248, 0.45), 0 0 80px rgba(37, 99, 235, 0.35)'
              }}
            >
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(circle at 25% 25%, #ffffff, #e5e7eb 55%, #cbd5f5 80%)',
                  boxShadow: '0 0 24px rgba(148, 163, 184, 0.7), 0 0 40px rgba(148, 163, 184, 0.6)'
                }}
              >
                <img 
                  src={orbImage} 
                  alt="FIA Logo" 
                  className="w-[140%] h-[140%] object-contain"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    maskImage: 'radial-gradient(circle, black 50%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 100%)'
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Título FIA */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-8xl font-black tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(56, 189, 248, 0.6), 0 0 80px rgba(29, 78, 216, 0.4)',
              filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.5))'
            }}
          >
            FIA
          </motion.h1>
        </div>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-300 text-lg font-light tracking-wide"
          style={{
            textShadow: '0 0 18px rgba(56, 189, 248, 0.5), 0 0 32px rgba(37, 99, 235, 0.4)'
          }}
        >
          Fiesta Intelligence Asistant
        </motion.p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.4), 0 8px 10px -6px rgba(15, 23, 42, 0.4)'
        }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Acceso al Sistema</h1>
          <p className="text-sm text-gray-400">Ingresa tus credenciales</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition"
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.7)'
                }}
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition"
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.7)'
                }}
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                color: '#fecaca'
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #38bdf8)',
              boxShadow: '0 10px 15px -3px rgba(30, 64, 175, 0.8), 0 4px 6px -4px rgba(30, 64, 175, 0.7)'
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Acceder al Dashboard</span>
              </>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
}
