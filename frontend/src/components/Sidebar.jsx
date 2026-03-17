// Sidebar Component - Optimized Collapsible Version
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Home, ChevronDown, ChevronLeft, Briefcase, Factory, Shield, TrendingUp, UserCheck, Truck, Menu, X, Store, ShoppingCart, Wrench, Monitor, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ROUTES } from '../routes/paths';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default memo(function Sidebar({ activeSection, setActiveSection, onLogout, onCollapsedChange }) {
  const user = authService.getUser();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navRef = useRef(null);

  const playSound = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
      audio.volume = 1.0;
      audio.playbackRate = 0.7;
      audio.preservesPitch = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Audio play was prevented, silently ignore
        });
      }
    } catch (error) {
      // Silently handle any audio errors
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      if (newIsDesktop !== isDesktop) {
        setIsDesktop(newIsDesktop);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]);

  const toggleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsedState);
    }
  }, [isCollapsed, onCollapsedChange]);

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  // Colapsar sidebar al navegar con botones Siguiente/Anterior (desktop)
  useEffect(() => {
    if (isDesktop && !isCollapsed) {
      setIsCollapsed(true);
      if (onCollapsedChange) onCollapsedChange(true);
    }
  }, [activeSection]);

  // Auto-scroll nav to keep active item visible (only in collapsed mode)
  useEffect(() => {
    if (!navRef.current || !isCollapsed) return;
    const active = navRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSection, isCollapsed]);

  const menuItems = [
    { 
      id: 'bienvenida', 
      label: 'Bienvenida', 
      icon: Home,
      type: 'expandable',
      subitems: [
        { id: 'bienvenida-principal', label: 'Inicio' },
        { id: 'contexto-mundial', label: 'Contexto Mundial' },
        { id: 'entorno-socioeconomico', label: 'Entorno Socio Económico Nacional' },
        { id: 'encasetamiento-colombia', label: 'Encasetamiento en Colombia' },
        { id: 'negocio-marcha', label: 'El Negocio en Marcha' }
      ]
    },
    { 
      id: 'produccion', 
      label: 'Gestión de Producción', 
      icon: Factory,
      type: 'expandable',
      subitems: [
        { id: 'produccion-granjas', label: 'Capacidad Granjas' },
        { id: 'produccion-encasetado', label: 'Encasetamiento' },
        { id: 'produccion-pollo-entregado', label: 'Pollo Entregado' },
        { id: 'produccion-indicadores', label: 'Zootecnia Granjas Aves' },
        { id: 'produccion-huevos', label: 'Zootecnia Granjas Huevo' }
      ]
    },
    { 
      id: 'comercial', 
      label: 'Gestión Comercial', 
      icon: TrendingUp,
      type: 'expandable',
      subitems: [
        { id: 'comercial-resumen', label: 'Asignación Pollo Mayorista' },
        { id: 'comercial-ventas-compania', label: 'Ventas Total Compañía' },
        { id: 'comercial-pollo-entero', label: 'Pollo Entero' },
        { id: 'comercial-productos', label: 'Ventas en Pollo en Canal' },
        { id: 'comercial-asadero', label: 'Ventas Asadero (Sede 1)' },
        { id: 'comercial-institucional', label: 'Ventas Institucional/Moderno (Sede 3)' },
        { id: 'comercial-huevo', label: 'Ventas de Huevo' },
        { id: 'logistica-merma', label: 'Control de Mermas' }
      ]
    },
    { 
      id: 'auditoria', 
      label: 'Auditoría', 
      icon: Shield,
      type: 'single'
    },
    { 
      id: 'comercial-pdv', 
      label: 'Puntos de Venta', 
      icon: Store,
      type: 'single'
    },
    { 
      id: 'cartera', 
      label: 'Gestión de Cartera', 
      icon: Briefcase,
      type: 'single'
    },
    { 
      id: 'logistica', 
      label: 'Gestión Logística', 
      icon: Truck,
      type: 'expandable',
      subitems: [
        { id: 'logistica-sede1', label: 'Sede 1 - Pollo Asadero' },
        { id: 'logistica-sede2', label: 'Sede 2 - Productos Congelados' },
        { id: 'logistica-sede3', label: 'Sede 3 - Clientes Institucionales' },
        { id: 'logistica-consolidado', label: 'Análisis Consolidado' }
      ]
    },
    { 
      id: 'marketing', 
      label: 'Gestión de Publicidad y Mercadeo', 
      icon: TrendingUp,
      type: 'expandable',
      subitems: [
        { id: 'marketing-indicadores', label: 'Indicadores y Resumen' },
        { id: 'marketing-detalle', label: 'Análisis Detallado' }
      ]
    },
    { 
      id: 'calidad', 
      label: 'Aseguramiento de Calidad', 
      icon: Shield,
      type: 'single'
    },
    { 
      id: 'humana', 
      label: 'Gestión Humana', 
      icon: UserCheck,
      type: 'expandable',
      subitems: [
        { id: 'humana-general', label: 'Nómina y Rotación' },
        { id: 'humana-causas', label: 'Causas de Desvinculación' }
      ]
    },
    { 
      id: 'compras', 
      label: 'Gestión en Compras', 
      icon: ShoppingCart,
      type: 'single'
    },
    { 
      id: 'operaciones', 
      label: 'Operaciones y Mantenimiento', 
      icon: Wrench,
      type: 'single'
    },
    { 
      id: 'planta-beneficio', 
      label: 'Planta de Beneficio', 
      icon: Factory,
      type: 'single'
    },
    { 
      id: 'tecnologias-informacion', 
      label: 'Tecnologías de la Información', 
      icon: Monitor,
      type: 'single'
    },
    { 
      id: 'sagrilaft', 
      label: 'Análisis y Evaluación Sistema SAGRILAFT', 
      icon: Shield,
      type: 'single'
    },
    { 
      id: 'presupuesto-2025', 
      label: 'Presupuesto 2025', 
      icon: Briefcase,
      type: 'single'
    },
    { 
      id: 'situacion-juridica', 
      label: 'Situación Jurídica y Tecnológica', 
      icon: Scale,
      type: 'single'
    },
    { 
      id: 'situacion-economica', 
      label: 'Situación Económica', 
      icon: Briefcase,
      type: 'single'
    }
  ];

  const sidebarWidth = isCollapsed && isDesktop ? 64 : 256;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl backdrop-blur-xl shadow-lg"
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
            className="lg:hidden fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: !isDesktop && !isMobileMenuOpen ? -sidebarWidth : 0,
          width: sidebarWidth
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-y-0 left-0 backdrop-blur-xl z-50 lg:z-50 will-change-transform"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRight: '1px solid rgba(203, 213, 225, 0.5)',
          boxShadow: isCollapsed ? '2px 0 10px rgba(0, 0, 0, 0.05)' : 'none',
          overflow: 'hidden',
          transform: 'translateZ(0)', // Force GPU acceleration
          height: '100vh'
        }}
      >
        <div className="flex flex-col h-full" style={{ position: 'relative' }}>
        
        {/* Logo Section */}
        <div 
          className={`${isCollapsed ? 'p-3' : 'p-6'} transition-all duration-300`} 
          style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.5)' }}
        >
          <div className={`flex items-start ${isCollapsed ? 'justify-center' : 'gap-4'} mb-3`}>
            <motion.div 
              animate={{ 
                width: isCollapsed ? 40 : 56,
                height: isCollapsed ? 40 : 56
              }}
              transition={{ duration: 0.3 }}
              className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), rgba(255, 255, 255, 0.9))',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}
            >
              <img 
                src={orbImage} 
                alt="FIA Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-center pt-1"
                >
                  <h2 className="text-xl font-bold text-gray-900 leading-tight mb-0.5">
                    FIA
                  </h2>
                  <p className="text-xs text-gray-600 leading-tight">
                    Fiesta Intelligence Assistant
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="truncate">{user?.fullName || user?.username}</span>
                </div>
                <div 
                  className="px-2 py-1 rounded-full inline-block text-xs font-medium"
                  style={{
                    background: 'rgba(59, 130, 246, 0.12)',
                    color: '#1d4ed8',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {user?.role?.toUpperCase()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className={`flex-1 min-h-0 ${isCollapsed ? 'p-2' : 'p-4'} space-y-1`} style={{ overflowY: 'auto', overflowX: 'visible' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || (item.subitems && item.subitems.some(sub => sub.id === activeSection));
            const isExpanded = expandedSections[item.id];
            
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    if (item.type === 'single') {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                      // Cerrar sidebar después de seleccionar
                      if (isDesktop && !isCollapsed) {
                        setTimeout(() => toggleCollapse(), 200);
                      }
                    } else {
                      if (isCollapsed) {
                        toggleCollapse();
                        setTimeout(() => toggleSection(item.id), 300);
                      } else {
                        toggleSection(item.id);
                      }
                    }
                  }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-lg transition-all duration-200 group hover:shadow-md`}
                  data-active={isActive ? 'true' : undefined}
                  style={{
                    background: isActive ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                    color: isActive ? '#1d4ed8' : '#64748b',
                    position: 'relative',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 2px 8px rgba(59,130,246,0.15)' : 'none',
                    borderLeft: isActive && isCollapsed ? '3px solid #3b82f6' : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`flex items-center ${isCollapsed ? 'relative' : 'space-x-3'}`}>
                    <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                    {isCollapsed && isActive && (
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"
                        style={{ boxShadow: '0 0 6px rgba(59,130,246,0.8)' }}
                      />
                    )}
                    {!isCollapsed && (
                      <span className="font-medium text-sm text-left">{item.label}</span>
                    )}
                  </div>
                  
                  {!isCollapsed && item.type === 'expandable' && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    </motion.div>
                  )}
                </button>

                {/* Subitems */}
                <AnimatePresence>
                  {!isCollapsed && item.type === 'expandable' && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.subitems.map((subitem) => {
                          const isSubActive = activeSection === subitem.id;
                          return (
                            <button
                              key={subitem.id}
                              onClick={() => {
                                setActiveSection(subitem.id);
                                setIsMobileMenuOpen(false);
                                // Cerrar sidebar después de seleccionar subitem
                                if (isDesktop && !isCollapsed) {
                                  setTimeout(() => toggleCollapse(), 200);
                                }
                              }}
                              className="w-full text-left px-4 py-2 rounded-lg transition-all duration-150 text-sm hover:shadow-sm"
                              data-active={isSubActive ? 'true' : undefined}
                              style={{
                                background: isSubActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                                color: isSubActive ? '#1d4ed8' : '#64748b',
                                borderLeft: isSubActive ? '3px solid #3b82f6' : '3px solid transparent',
                                fontWeight: isSubActive ? 700 : 400
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.06)';
                                  e.currentTarget.style.borderLeftColor = 'rgba(59, 130, 246, 0.3)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.borderLeftColor = 'transparent';
                                }
                              }}
                            >
                              {subitem.label}
                            </button>
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

        {/* Footer Actions */}
        <div 
          className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-2`} 
          style={{ borderTop: '1px solid rgba(203, 213, 225, 0.5)' }}
        >
          {/* Collapse Button - Desktop Only */}
          {isDesktop && !isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.4)',
                color: '#475569'
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Menú</span>
            </button>
          )}
          
          {isDesktop && isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.4)',
                color: '#475569'
              }}
              title="Expandir Menú"
            >
              <ChevronLeft className="w-5 h-5" style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
          
          {!isCollapsed ? (
            <>
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#1d4ed8'
                }}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium text-sm">Volver al Inicio</span>
              </button>
              
              <button
                onClick={() => {
                  playSound();
                  onLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#dc2626'
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 hover:scale-110 group"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#1d4ed8',
                  position: 'relative'
                }}
                title="Volver al Inicio"
              >
                <Home className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  playSound();
                  onLogout();
                }}
                className="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 hover:scale-110 group"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#dc2626',
                  position: 'relative'
                }}
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

      </div>
    </motion.aside>
    </>
  );
});
