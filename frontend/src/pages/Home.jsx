import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ArrowRight, BarChart3, TrendingUp, DollarSign, Users, Package, Shield, Briefcase, Factory } from 'lucide-react';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function Home() {
  const navigate = useNavigate();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const dashboardSections = [
    {
      icon: Factory,
      label: 'Producción',
      description: 'Granjas y sacrificio',
      color: 'from-cyan-500 to-cyan-600',
      section: 'produccion-granjas'
    },
    {
      icon: TrendingUp,
      label: 'Comercial',
      description: 'Ventas por línea',
      color: 'from-purple-500 to-purple-600',
      section: 'comercial'
    },
    {
      icon: Users,
      label: 'Equipo de Ventas',
      description: 'Desempeño comercial',
      color: 'from-blue-500 to-blue-600',
      section: 'ventas'
    },
    {
      icon: BarChart3,
      label: 'Auditoría',
      description: 'Merma y devoluciones',
      color: 'from-yellow-500 to-yellow-600',
      section: 'auditoria'
    },
    {
      icon: Package,
      label: 'Logística',
      description: 'Costos operacionales',
      color: 'from-pink-500 to-pink-600',
      section: 'logistica'
    },
    {
      icon: Briefcase,
      label: 'Cartera',
      description: 'Morosidad y rotación',
      color: 'from-green-500 to-green-600',
      section: 'cartera'
    },
    {
      icon: Briefcase,
      label: 'Gerencia',
      description: 'Indicadores estratégicos',
      color: 'from-indigo-500 to-indigo-600',
      section: 'gerencia'
    },
    {
      icon: Users,
      label: 'Humana',
      description: 'Costos de nómina',
      color: 'from-orange-500 to-orange-600',
      section: 'humana'
    },
    {
      icon: Shield,
      label: 'SAGRILAFT',
      description: 'Análisis y evaluación',
      color: 'from-red-500 to-red-600',
      section: 'sagrilaft'
    },
    {
      icon: DollarSign,
      label: 'Balance General',
      description: 'Activos, Pasivos y Patrimonio',
      color: 'from-blue-500 to-blue-600',
      section: 'fuentes-usos'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{
      background: 'radial-gradient(circle at top, #020617 0, #0f172a 50%, #1e293b 100%)'
    }}>
      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleLogout}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full transition-all hover:scale-105"
        style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.6)',
          color: '#fecaca',
          backdropFilter: 'blur(10px)'
        }}
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Cerrar Sesión</span>
      </motion.button>

      <div className="w-full max-w-6xl">
        
        {/* AI Orb Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="relative inline-block mb-4 sm:mb-6">
            {/* Outer rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                width: '120px',
                height: '120px',
                border: '2px solid transparent',
                borderTopColor: '#38bdf8',
                borderRightColor: '#1d4ed8',
                filter: 'blur(1px)'
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                width: '120px',
                height: '120px',
                border: '2px solid transparent',
                borderBottomColor: '#38bdf8',
                borderLeftColor: '#1d4ed8',
                filter: 'blur(1px)'
              }}
            />
            
            {/* Core orb */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 40px rgba(56, 189, 248, 0.4)',
                  '0 0 60px rgba(56, 189, 248, 0.6)',
                  '0 0 40px rgba(56, 189, 248, 0.4)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(29, 78, 216, 0.1) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
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
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3"
          >
            FIA - Pollo Fiesta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-base sm:text-lg"
          >
            Fiesta Intelligence Assistant
          </motion.p>
        </motion.div>

        {/* Main Dashboard Access Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            boxShadow: '0 0 60px rgba(56, 189, 248, 0.1)'
          }}
        >
          {/* Main Dashboard Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="group w-full p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl text-left transition-all hover:scale-[1.02] mb-6 sm:mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(29, 78, 216, 0.2) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 10px 40px rgba(56, 189, 248, 0.2)'
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl" style={{
                  background: 'rgba(56, 189, 248, 0.3)'
                }}>
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-sky-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:text-sky-300 transition-colors">
                    Acceder al Dashboard
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg hidden sm:block">
                    Visualiza todos los indicadores y métricas empresariales
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:block"
              >
                <ArrowRight className="w-8 h-8 lg:w-10 lg:h-10 text-sky-300" />
              </motion.div>
            </div>
          </motion.button>

          {/* Dashboard Sections Grid */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 uppercase tracking-wider">
              Secciones Disponibles
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {dashboardSections.map((section, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.05 }}
                  onClick={() => navigate(`${ROUTES.DASHBOARD}?section=${section.section}`)}
                  className="group p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all hover:scale-105"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                    <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-xs sm:text-sm group-hover:text-sky-400 transition-colors">
                    {section.label}
                  </h3>
                  <p className="text-xs text-gray-400 hidden sm:block">{section.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-gray-500 text-xs sm:text-sm px-4"
        >
          Haz clic en "Acceder al Dashboard" para ver todos los análisis comparativos 2024 vs 2025
        </motion.p>
      </div>
    </div>
  );
}
