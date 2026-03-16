import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import { User, Lock, LogIn } from 'lucide-react';
import { OrdenDelDiaModal } from '../components/ui/OrdenDelDiaModal';
import orbImage from '../assets/pollo_fiesta_FIA.png';
import asambleaImg from '../assets/asamblea_gemeral.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const navigate = useNavigate();

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
    audio.volume = 1.0;
    audio.playbackRate = 0.7;
    audio.preservesPitch = true;
    audio.play().catch(err => console.log('Audio blocked:', err));
  };

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
      setShowWelcomeModal(true); // Mostrar primer modal en lugar de navegar
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
    }}>
      
      {/* Modal 1: Imagen convocatoria */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" style={{ padding: '16px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
              style={{ maxHeight: '95vh', width: '100%', maxWidth: '700px' }}
            >
              {/* Imagen con scroll si no cabe en pantalla */}
              <div className="overflow-y-auto rounded-2xl w-full" style={{ maxHeight: 'calc(95vh - 80px)' }}>
                <img
                  src={asambleaImg}
                  alt="Convocatoria Asamblea General de Accionistas"
                  className="w-full block"
                />
              </div>
              {/* Botón flotante debajo */}
              <div className="mt-4 flex justify-center flex-shrink-0">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    setShowAgendaModal(true);
                  }}
                  className="px-14 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg text-base"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Orden del Día */}
      <OrdenDelDiaModal 
        isOpen={showAgendaModal}
        onClose={() => {
          setShowAgendaModal(false);
          navigate(ROUTES.HOME);
        }}
      />

      {/* Orb Container - Estilo IA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center mb-8 sm:mb-12"
      >
        {/* Orb y Título FIA en línea */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4 sm:mb-6">
          {/* Orb Principal */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
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
              className="absolute w-52 sm:w-60 lg:w-72 h-52 sm:h-60 lg:h-72 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 70%)'
              }}
            />

            {/* Rotating Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 sm:w-44 lg:w-52 h-36 sm:h-44 lg:h-52 rounded-full"
              style={{
                border: '1px solid rgba(191, 219, 254, 0.4)',
                boxShadow: '0 0 18px rgba(56, 189, 248, 0.6)'
              }}
            />
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 sm:w-36 lg:w-44 h-32 sm:h-36 lg:h-44 rounded-full"
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
              className="relative w-28 sm:w-32 lg:w-40 h-28 sm:h-32 lg:h-40 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #1f2937, #020617 70%)',
                boxShadow: '0 0 32px rgba(56, 189, 248, 0.45), 0 0 80px rgba(37, 99, 235, 0.35)'
              }}
            >
              <div 
                className="w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 rounded-full flex items-center justify-center overflow-hidden"
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
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider"
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
          className="text-center text-gray-700 text-sm sm:text-base lg:text-lg font-light tracking-wide"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Fiesta Intelligence Assistant
        </motion.p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm backdrop-blur-xl rounded-3xl shadow-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          border: '1.5px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5)'
        }}
      >
        {/* Title */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Acceso al Sistema</h1>
          <p className="text-sm text-gray-500">Ingresa tus credenciales</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                style={{
                  background: 'rgba(248, 250, 252, 0.9)',
                  border: '1.5px solid rgba(203, 213, 225, 0.7)'
                }}
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                style={{
                  background: 'rgba(248, 250, 252, 0.9)',
                  border: '1.5px solid rgba(203, 213, 225, 0.7)'
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
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(254, 226, 226, 0.9)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                color: '#dc2626'
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #38bdf8)',
                boxShadow: '0 8px 20px -4px rgba(30, 64, 175, 0.6)'
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Acceder al Dashboard</span>
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
