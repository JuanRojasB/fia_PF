// Sidebar Component - Updated with TI Dashboard
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Home, ChevronDown, ChevronRight, ArrowLeftRight, Briefcase, DollarSign, Factory, Users, Shield, TrendingUp, UserCheck, Truck, Package, Menu, X, Store, ShoppingCart, Wrench, Monitor } from 'lucide-react';
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
      type: 'expandable',
      subitems: [
        { id: 'bienvenida-principal', label: 'Inicio', dashboardType: 'bienvenida' },
        { id: 'contexto-mundial', label: 'Contexto Mundial', dashboardType: 'contexto-mundial' },
        { id: 'entorno-socioeconomico', label: 'Entorno Socio Económico Nacional', dashboardType: 'entorno-socioeconomico' },
        { id: 'encasetamiento-colombia', label: 'Encasetamiento en Colombia', dashboardType: 'encasetamiento-colombia' },
        { id: 'negocio-marcha', label: 'El Negocio en Marcha', dashboardType: 'negocio-marcha' }
      ]
    },

    { 
      id: 'produccion', 
      label: 'Gestión de Producción', 
      icon: Factory,
      type: 'expandable',
      subitems: [
        { id: 'produccion-granjas', label: 'Capacidad Granjas', dashboardType: 'produccion-granjas' },
        { id: 'produccion-encasetado', label: 'Encasetamiento', dashboardType: 'produccion-encasetado' },
        { id: 'produccion-pollo-entregado', label: 'Pollo Entregado', dashboardType: 'produccion-pollo-entregado' },
        { id: 'produccion-indicadores', label: 'Zootecnia Granjas Aves', dashboardType: 'produccion-indicadores' },
        { id: 'produccion-huevos', label: 'Zootecnia Granjas Huevo', dashboardType: 'produccion-huevos' }
      
      ]
    },
    { 
      id: 'comercial', 
      label: 'Gestión Comercial', 
      icon: TrendingUp,
      type: 'expandable',
      subitems: [
        { id: 'comercial-resumen', label: 'Estructura', dashboardType: 'comercial-resumen' },
        { id: 'comercial-ventas-compania', label: 'Ventas Total Compañía', dashboardType: 'comercial-ventas-compania' },
        { id: 'comercial-pollo-entero', label: 'Pollo Entero', dashboardType: 'comercial-pollo-entero' },
        { id: 'comercial-productos', label: 'Análisis de Productos', dashboardType: 'comercial-productos' },
        { id: 'comercial-asadero', label: 'Ventas Asadero (Sede 1)', dashboardType: 'comercial-asadero' },
        { id: 'comercial-institucional', label: 'Ventas Institucional/Moderno (Sede 3)', dashboardType: 'comercial-institucional' },
        { id: 'comercial-huevo', label: 'Ventas de Huevo', dashboardType: 'comercial-huevo' },
        { id: 'logistica-merma', label: 'Control de Mermas', dashboardType: 'logistica-merma' }
      ]
    },
    
    { 
      id: 'auditoria', 
      label: 'Auditoría', 
      icon: Shield,
      type: 'single',
      dashboardType: 'auditoria'
    },
    { 
      id: 'comercial-pdv', 
      label: 'Puntos de Venta', 
      icon: Store,
      type: 'single',
      dashboardType: 'comercial-pdv'
    },
       { 
      id: 'cartera', 
      label: 'Gestión de Cartera', 
      icon: Briefcase,
      type: 'single',
      dashboardType: 'cartera'
    },

    { 
      id: 'logistica', 
      label: 'Gestión Logística', 
      icon: Truck,
      type: 'expandable',
      subitems: [
        { id: 'logistica-consolidado', label: 'Análisis Consolidado', dashboardType: 'gestion-logistica' },
        { id: 'logistica-sede1', label: 'Sede 1 - Pollo Asadero', dashboardType: 'logistica-sede1' },
        { id: 'logistica-sede2', label: 'Sede 2 - Productos Congelados', dashboardType: 'logistica-sede2' },
        { id: 'logistica-sede3', label: 'Sede 3 - Clientes Institucionales', dashboardType: 'logistica-sede3' }
      ]
    },

    { 
      id: 'marketing', 
      label: 'Gestión de Publicidad y Mercadeo', 
      icon: TrendingUp,
      type: 'single',
      dashboardType: 'marketing-general'
    },
    { 
      id: 'calidad', 
      label: 'Aseguramiento de Calidad', 
      icon: Shield,
      type: 'single',
      dashboardType: 'calidad'
    },
        { 
      id: 'humana', 
      label: 'Gestión Humana', 
      icon: UserCheck,
      type: 'expandable',
      subitems: [
        { id: 'humana-general', label: 'Nómina y Rotación', dashboardType: 'humana-general' },
        { id: 'humana-causas', label: 'Causas de Desvinculación', dashboardType: 'humana-causas' }
      ]
    },
    { 
      id: 'compras', 
      label: 'Gestión en Compras', 
      icon: ShoppingCart,
      type: 'single',
      dashboardType: 'compras'
    },
    { 
      id: 'operaciones', 
      label: 'Operaciones y Mantenimiento', 
      icon: Wrench,
      type: 'single',
      dashboardType: 'operaciones'
    },
    { 
      id: 'planta-beneficio', 
      label: 'Planta de Beneficio', 
      icon: Factory,
      type: 'single',
      dashboardType: 'planta-beneficio'
    },
    { 
      id: 'tecnologias-informacion', 
      label: 'Tecnologías de la Información', 
      icon: Monitor,
      type: 'single',
      dashboardType: 'tecnologias-informacion'
    },
    { 
      id: 'sagrilaft', 
      label: 'Análisis y Evaluación Sistema SAGRILAFT', 
      icon: Shield,
      type: 'single',
      dashboardType: 'sagrilaft'
    },
    { 
      id: 'situacion-economica', 
      label: 'Situación Económica', 
      icon: Briefcase,
      type: 'single',
      dashboardType: 'situacion-economica'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(203, 213, 225, 0.5)'
        }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
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
            className="lg:hidden fixed inset-0 bg-gray-900/30 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className="fixed inset-y-0 left-0 w-64 backdrop-blur-xl overflow-y-auto z-40 lg:z-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRight: '1px solid rgba(203, 213, 225, 0.5)'
        }}
      >
        <div className="flex flex-col min-h-full">
        
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.5)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), rgba(255, 255, 255, 0.9))',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                    '0 0 30px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.3)',
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
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  FIA 
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.fullName || user?.username}</span>
            </div>
            <div className="mt-2 px-2 py-1 rounded-full inline-block text-xs font-medium"
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#1d4ed8',
                border: '1px solid rgba(59, 130, 246, 0.3)'
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
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 text-sm"
                  style={{
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                    color: isActive ? '#1d4ed8' : '#64748b'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
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
                              className="w-full flex items-start px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                              style={{
                                background: isSubActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                                color: isSubActive ? '#1d4ed8' : '#64748b',
                                borderLeft: isSubActive ? '2px solid #3b82f6' : '2px solid transparent'
                              }}
                            >
                              <span className="font-medium text-left">{subitem.label}</span>
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
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(203, 213, 225, 0.5)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#1d4ed8'
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
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#dc2626'
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
