import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import { User, Lock, LogIn } from 'lucide-react';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
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
      
      {/* Modal 1: Consideraciones */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-6 sm:p-8 lg:p-12 text-center my-8"
            >
              <p className="text-sm sm:text-base lg:text-xl text-gray-800 mb-2 sm:mb-3">Bogotá, D.C. República de Colombia.</p>
              <p className="text-sm sm:text-base lg:text-xl text-gray-800 mb-4 sm:mb-8">Miércoles 19 de Marzo de 2.025</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">POLLO FIESTA S.A.</h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">INFORME DE GESTIÓN AÑO 2024</h2>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4 sm:mb-6">A LA HONORABLE ASAMBLEA GENERAL DE ACCIONISTAS</p>
              <div className="w-24 sm:w-32 h-1 bg-gray-300 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Consideraciones</p>
              <div className="text-left space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-gray-700 max-w-3xl mx-auto px-2">
                <p className="text-sm sm:text-base lg:text-lg text-justify">
                  En cumplimiento con las disposiciones estatutarias de la sociedad Pollo Fiesta S.A. y de conformidad con lo 
                  previsto en los artículos 38, 45, 46 y 47 de la ley 222 de 1995; art. 1 de la ley 603 de 2000, y demás normas 
                  concordantes contempladas en la legislación vigente sobre la materia.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-justify">
                  A continuación, se presenta el informe anual por la gestión desarrollada durante el ejercicio económico del 
                  año 2.024, el cual contiene una exposición fiel sobre la evolución del negocio, la situación jurídica, la situación 
                  económica y la situación administrativa de la sociedad en cumplimiento con el ordenamiento legal.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  setShowAgendaModal(true);
                }}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg transition-colors"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Orden del Día */}
      <AnimatePresence>
        {showAgendaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8"
            >
              <div className="bg-blue-600 px-4 sm:px-8 py-4 sm:py-5">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">Orden del Día</h2>
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1">BOGOTÁ, D.C. REPÚBLICA DE COLOMBIA.</p>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1">MIÉRCOLES 19 DE MARZO DE 2025</p>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-2 sm:mb-3">POLLO FIESTA S.A.</p>
                  <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-auto mb-2 sm:mb-3"></div>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1">INFORME DE GESTIÓN AÑO 2024</p>
                  <p className="text-sm sm:text-base font-semibold text-blue-600">Orden del día</p>
                </div>
                <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 max-w-3xl mx-auto">
                  {[
                    'Verificación del Quorum',
                    'Nombramiento del presidente y secretario de la Asamblea',
                    'Nombramiento de la Comisión verificadora del Acta',
                    'Lectura del Acta anterior',
                    'Informe de Gestión de los Administradores',
                    'Informe del Revisor Fiscal',
                    'Estudio y aprobación de los Estados Financieros a 31 de diciembre de 2024',
                    'Proyecto de Distribución de Utilidades',
                    'Elección de Junta Directiva',
                    'Elección del Revisor Fiscal y asignación de Honorarios',
                    'Proposiciones y varios',
                    'Aprobación y firma del Acta de sesión'
                  ].map((item, index) => (
                    <div key={index} className="flex gap-2 sm:gap-3 py-1">
                      <span className="font-bold text-gray-900 text-sm sm:text-base flex-shrink-0">{index + 1}.</span>
                      <p className="text-gray-800 text-sm sm:text-base">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowAgendaModal(false);
                      navigate(ROUTES.HOME);
                    }}
                    className="px-6 sm:px-10 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors"
                  >
                    Ingresar al Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
        className="w-full max-w-md backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Acceso al Sistema</h1>
          <p className="text-sm text-gray-600">Ingresa tus credenciales</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(203, 213, 225, 0.8)'
                }}
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(203, 213, 225, 0.8)'
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
                border: '2px solid rgba(239, 68, 68, 0.5)',
                color: '#dc2626'
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
