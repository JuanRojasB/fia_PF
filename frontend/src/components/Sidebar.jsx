import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Home, ChevronDown, ChevronRight, ArrowLeftRight, Briefcase, DollarSign, Factory, Users, Shield, TrendingUp, UserCheck, Truck, Package, Menu, X, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import { useState } from 'react';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const user = authService.getUser();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const menuItems = [
    { 
      id: 'bienvenida', 
      label: 'Bienvenida', 
      icon: Home,
      type: 'single',
      dashboardType: 'bienvenida'
    },
    { 
      id: 'produccion', 
      label: 'Gestión de Producción', 
      icon: Factory,
      type: 'expandable',
      subitems: [
        { id: 'produccion-granjas', label: 'Capacidad Granjas', dashboardType: 'produccion-granjas' },
        { id: 'produccion-encasetado', label: 'Encasetamiento', dashboardType: 'produccion-encasetado' },
        { id: 'produccion-huevos', label: 'Zootecnia Granjas Huevo', dashboardType: 'produccion-huevos' },
        { id: 'produccion-indicadores', label: 'Zootecnia Granjas Aves', dashboardType: 'produccion-indicadores' }
      ]
    },
    { 
      id: 'comercial', 
      label: 'Gestión Comercial', 
      icon: TrendingUp,
      type: 'expandable',
      subitems: [
        { id: 'comercial-resumen', label: 'Resumen General', dashboardType: 'comercial-resumen' },
        { id: 'comercial-productos', label: 'Análisis de Productos', dashboardType: 'comercial-productos' },
        { id: 'comercial-huevo', label: 'Ventas de Huevo', dashboardType: 'comercial-huevo' }
      ]
    },
    { 
      id: 'comercial-pdv', 
      label: 'Puntos de Venta', 
      icon: Store,
      type: 'single',
      dashboardType: 'comercial-pdv'
    },
    { 
      id: 'auditoria', 
      label: 'Auditoría', 
      icon: Shield,
      type: 'single',
      dashboardType: 'auditoria'
    },
    { 
      id: 'logistica', 
      label: 'Gestión Logística', 
      icon: Truck,
      type: 'expandable',
      subitems: [
        { id: 'logistica-resumen', label: 'Resumen Operativo', dashboardType: 'logistica' },
        { id: 'logistica-sede1', label: 'Sede 1 - Pollo Asadero', dashboardType: 'logistica-sede1' },
        { id: 'logistica-sede2', label: 'Sede 2 - Productos Congelados', dashboardType: 'logistica-sede2' },
        { id: 'logistica-sede3', label: 'Sede 3 - Clientes Institucionales', dashboardType: 'logistica-sede3' },
        { id: 'gestion-logistica', label: 'Análisis Consolidado', dashboardType: 'gestion-logistica' }
      ]
    },
    { 
      id: 'cartera', 
      label: 'Gestión de Cartera', 
      icon: Briefcase,
      type: 'single',
      dashboardType: 'cartera'
    },
    { 
      id: 'gerencia', 
      label: 'Gestión Gerencia', 
      icon: Briefcase,
      type: 'single',
      dashboardType: 'gerencia'
    },
    { 
      id: 'humana', 
      label: 'Gestión Humana', 
      icon: UserCheck,
      type: 'single',
      dashboardType: 'humana'
    },
    { 
      id: 'sagrilaft', 
      label: 'Análisis y Evaluación Sistema SAGRILAFT', 
      icon: Shield,
      type: 'single',
      dashboardType: 'sagrilaft'
    },
    { 
      id: 'fuentes-usos', 
      label: 'Balance General', 
      icon: ArrowLeftRight,
      type: 'single',
      dashboardType: 'fuentes-usos'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl backdrop-blur-xl"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className="fixed inset-y-0 left-0 w-64 backdrop-blur-xl overflow-y-auto z-40 lg:z-auto"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          borderRight: '1px solid rgba(148, 163, 184, 0.3)'
        }}
      >
        <div className="flex flex-col min-h-full">
        
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(0, 0, 0, 0.9))',
                  border: '2px solid rgba(56, 189, 248, 0.6)',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(56, 189, 248, 0.5)',
                    '0 0 30px rgba(56, 189, 248, 0.7)',
                    '0 0 20px rgba(56, 189, 248, 0.5)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={orbImage} 
                  alt="FIA Logo" 
                  className="w-full h-full object-contain"
                  style={{
                    imageRendering: 'crisp-edges',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0) scale(1.1)',
                    WebkitFontSmoothing: 'antialiased'
                  }}
                />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  FIA Intelligence
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>{user?.fullName || user?.username}</span>
            </div>
            <div className="mt-2 px-2 py-1 rounded-full inline-block text-xs font-medium"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#7dd3fc',
                border: '1px solid rgba(56, 189, 248, 0.5)'
              }}
            >
              {user?.role?.toUpperCase()}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || (item.subitems && item.subitems.some(sub => sub.id === activeSection));
            const isExpanded = expandedSections[item.id];
            
            return (
              <div key={item.id}>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (item.type === 'single') {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    } else {
                      toggleSection(item.id);
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300"
                  style={{
                    background: isActive ? 'rgba(30, 64, 175, 0.3)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid transparent',
                    color: isActive ? '#93c5fd' : '#9ca3af'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.type === 'expandable' && (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Subitems */}
                <AnimatePresence>
                  {item.type === 'expandable' && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-2 space-y-1">
                        {item.subitems.map((subitem) => {
                          const isSubActive = activeSection === subitem.id;
                          return (
                            <motion.button
                              key={subitem.id}
                              onClick={() => {
                                setActiveSection(subitem.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                              style={{
                                background: isSubActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                color: isSubActive ? '#7dd3fc' : '#9ca3af',
                                borderLeft: isSubActive ? '2px solid #38bdf8' : '2px solid transparent'
                              }}
                            >
                              {subitem.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.3)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.6)',
              color: '#7dd3fc'
            }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Volver al Inicio</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              color: '#fecaca'
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </motion.button>
        </div>

      </div>
    </motion.div>
    </>
  );
}
