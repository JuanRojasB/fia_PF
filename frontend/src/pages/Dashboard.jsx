import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardRenderer from '../components/dashboards/DashboardRenderer';
import DashboardWrapper from '../components/DashboardWrapper';
import ErrorBoundary from '../components/ErrorBoundary';
import SectionSplash from '../components/SectionSplash';
import { OrdenDelDiaModal } from '../components/ui/OrdenDelDiaModal';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { ROUTES } from '../routes/paths';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get('section') || 'bienvenida';
  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [splashTrigger, setSplashTrigger] = useState(0);
  const [splashSection, setSplashSection] = useState('');
  const [showOrdenDelDia, setShowOrdenDelDia] = useState(false);

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mapeo de secciones principales (padres)
  const mainSections = useMemo(() => ({
    'bienvenida': ['bienvenida-principal', 'contexto-mundial', 'entorno-socioeconomico', 'encasetamiento-colombia', 'negocio-marcha'],
    'produccion': ['produccion-granjas', 'produccion-encasetado', 'produccion-pollo-entregado', 'produccion-indicadores', 'produccion-huevos'],
    'comercial': ['comercial-estructura-equipo', 'comercial-resumen', 'comercial-ventas-compania', 'comercial-pollo-entero', 'comercial-productos', 'comercial-asadero', 'comercial-institucional', 'comercial-huevo', 'logistica-merma'],
    'logistica': ['logistica-consolidado', 'logistica-sede1', 'logistica-sede2', 'logistica-sede3'],
    'operaciones': ['operaciones-tpm', 'operaciones-ot', 'operaciones-vehiculos', 'operaciones-arquitectura'],
    'marketing': ['marketing-indicadores', 'marketing-detalle'],
    'humana': ['humana-nomina', 'humana-rotacion', 'humana-causas', 'humana-smlv'],
    'gerencia-estrategica': ['gerencia-estrategica-calidad', 'gerencia-estrategica-compras', 'gerencia-estrategica-bienestar', 'gerencia-estrategica-hseq', 'gerencia-estrategica-ambiental', 'gerencia-estrategica-sgc', 'gerencia-estrategica-satisfaccion', 'gerencia-estrategica-vigia'],
  }), []);

  // Nombres amigables de secciones principales
  const mainSectionNames = useMemo(() => ({
    'bienvenida': 'Bienvenida',
    'produccion': 'Gestión de Producción',
    'comercial': 'Gestión Comercial',
    'auditoria': 'Auditoría',
    'comercial-pdv': 'Puntos de Venta',
    'cartera': 'Gestión de Cartera',
    'logistica': 'Gestión Logística',
    'marketing': 'Gestión de Publicidad y Mercadeo',
    'gerencia-estrategica': 'Gerencia Estratégica y Mejoramiento Continuo',
    'humana': 'Gestión Humana',
    'compras': 'Gestión en Compras',
    'operaciones': 'Operaciones y Mantenimiento',
    'planta-beneficio': 'Planta de Beneficio',
    'tecnologias-informacion': 'Tecnologías de la Información',
    'sagrilaft': 'Sistema SAGRILAFT',
    'presupuesto-2025': 'Presupuesto 2025',
    'situacion-juridica': 'Situación Jurídica y Tecnológica',
    'situacion-economica': 'Situación Económica'
  }), []);

  // Detectar cambio de sección principal
  const getMainSection = useCallback((section) => {
    for (const [main, subs] of Object.entries(mainSections)) {
      if (subs.includes(section)) return main;
    }
    return section;
  }, [mainSections]);

  const [previousMainSection, setPreviousMainSection] = useState(getMainSection(activeSection));
  const sectionToDashboardType = {
    'bienvenida': 'bienvenida',
    'fuentes-usos': 'fuentes-usos',
    'auditoria': 'auditoria',
    'gerencia-estrategica': 'gerencia-estrategica',
    'gerencia-estrategica-calidad':      'gerencia-estrategica',
    'gerencia-estrategica-compras':      'gerencia-estrategica',
    'gerencia-estrategica-bienestar':    'gerencia-estrategica',
    'gerencia-estrategica-hseq':         'gerencia-estrategica',
    'gerencia-estrategica-ambiental':    'gerencia-estrategica',
    'gerencia-estrategica-sgc':          'gerencia-estrategica',
    'gerencia-estrategica-satisfaccion': 'gerencia-estrategica',
    'gerencia-estrategica-vigia':        'gerencia-estrategica',
    'compras': 'compras',
    'operaciones': 'operaciones',
    'operaciones-tpm': 'operaciones',
    'operaciones-ot': 'operaciones',
    'operaciones-vehiculos': 'operaciones',
    'operaciones-arquitectura': 'operaciones',
    'planta-beneficio': 'planta-beneficio',
    'tecnologias-informacion': 'tecnologias-informacion',
    'cartera': 'cartera',
    'comercial': 'comercial',
    'comercial-resumen': 'comercial',
    'comercial-estructura-equipo': 'comercial-estructura-equipo',
    'comercial-ventas-compania': 'comercial',
    'comercial-pollo-entero': 'comercial',
    'comercial-pdv': 'comercial-pdv',
    'comercial-productos': 'comercial',
    'comercial-asadero': 'comercial',
    'comercial-institucional': 'comercial',
    'comercial-huevo': 'comercial',
    'humana': 'humana',
    'humana-nomina': 'humana',
    'humana-rotacion': 'humana',
    'humana-causas': 'humana',
    'humana-smlv': 'humana',
    'marketing': 'marketing-general',
    'marketing-general': 'marketing-general',
    'logistica': 'logistica',
    'logistica-detalle': 'logistica',
    'logistica-consolidado': 'gestion-logistica',
    'logistica-merma': 'gestion-logistica',
    'logistica-sede1': 'logistica-sede1',
    'logistica-sede2': 'logistica-sede2',
    'logistica-sede3': 'logistica-sede3',
    'produccion-granjas': 'produccion-granjas',
    'produccion-encasetado': 'produccion-historico',
    'produccion-pollo-entregado': 'produccion-historico',
    'produccion-huevos': 'produccion-historico',
    'produccion-indicadores': 'produccion-historico',
    'sagrilaft': 'sagrilaft',
    'presupuesto-2025': 'presupuesto-2025',
    'gerencia': 'gerencia',
    'marketing-indicadores': 'marketing-general',
    'marketing-detalle': 'marketing-general'
  };

  // Dashboards que no requieren datos del servidor
  const noDataRequired = ['bienvenida', 'situacion-juridica', 'situacion-economica', 'contexto-mundial', 'entorno-socioeconomico', 'encasetamiento-colombia', 'negocio-marcha', 'bienvenida-principal', 'agradecimientos', 'comercial-estructura-equipo', 'operaciones-tpm', 'operaciones-ot', 'operaciones-vehiculos', 'operaciones-arquitectura', 'gerencia-estrategica', 'gerencia-estrategica-calidad', 'gerencia-estrategica-compras', 'gerencia-estrategica-bienestar', 'gerencia-estrategica-hseq', 'gerencia-estrategica-ambiental', 'gerencia-estrategica-sgc', 'gerencia-estrategica-satisfaccion', 'gerencia-estrategica-vigia'];

  // Función para cambiar de sección que actualiza tanto el estado como la URL
  const handleSectionChange = useCallback((newSection) => {
    const newMainSection = getMainSection(newSection);
    const oldMainSection = previousMainSection;
    
    // Mostrar splash al cambiar de sección
    setSplashSection(newSection);
    setSplashTrigger(t => t + 1);
    
    if (newMainSection !== oldMainSection) {
      setPreviousMainSection(newMainSection);
    }
    
    setActiveSection(newSection);
    setSearchParams({ section: newSection });
  }, [setSearchParams, getMainSection, previousMainSection, mainSectionNames]);

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const handleCollapsedChange = useCallback((collapsed) => {
    setIsTransitioning(true);
    setIsSidebarCollapsed(collapsed);
    // Esperar a que termine la transición antes de permitir re-renders
    setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
  }, []);

  // Lista ordenada de todas las secciones para navegación
  const allSections = useMemo(() => [
    'bienvenida-principal',
    'contexto-mundial',
    'entorno-socioeconomico',
    'encasetamiento-colombia',
    'negocio-marcha',
    'produccion-granjas',
    'produccion-encasetado',
    'produccion-pollo-entregado',
    'produccion-indicadores',
    'produccion-huevos',
    'comercial-estructura-equipo',
    'comercial-resumen',
    'comercial-ventas-compania',
    'comercial-pollo-entero',
    'comercial-productos',
    'comercial-asadero',
    'comercial-institucional',
    'comercial-huevo',
    'logistica-merma',
    'auditoria',
    'comercial-pdv',
    'cartera',
    'logistica-consolidado',
    'logistica-sede1',
    'logistica-sede2',
    'logistica-sede3',
    'marketing-indicadores',
    'marketing-detalle',
    'gerencia-estrategica-calidad',
    'gerencia-estrategica-compras',
    'gerencia-estrategica-bienestar',
    'gerencia-estrategica-hseq',
    'gerencia-estrategica-ambiental',
    'gerencia-estrategica-sgc',
    'gerencia-estrategica-satisfaccion',
    'gerencia-estrategica-vigia',
    'humana-nomina',
    'humana-rotacion',
    'humana-causas',
    'humana-smlv',
    'compras',
    'operaciones-tpm',
    'operaciones-ot',
    'operaciones-vehiculos',
    'operaciones-arquitectura',
    'planta-beneficio',
    'tecnologias-informacion',
    'sagrilaft',
    'presupuesto-2025',
    'situacion-juridica',
    'situacion-economica'
  ], []);

  // Funciones de navegación
  const goToPreviousSection = useCallback(() => {
    // Desde cualquier sede logística, Anterior vuelve al consolidado
    if (['logistica-sede1', 'logistica-sede2', 'logistica-sede3'].includes(activeSection)) {
      handleSectionChange('logistica-consolidado');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Desde marketing, Anterior vuelve al consolidado (saltando sedes)
    if (activeSection === 'marketing-indicadores') {
      handleSectionChange('logistica-consolidado');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const currentIndex = allSections.indexOf(activeSection);
    if (currentIndex > 0) {
      handleSectionChange(allSections[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection, allSections, handleSectionChange]);

  const goToNextSection = useCallback(() => {
    // Desde consolidado, Siguiente salta directo a marketing (omite sedes)
    if (activeSection === 'logistica-consolidado') {
      handleSectionChange('marketing-indicadores');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const currentIndex = allSections.indexOf(activeSection);
    if (currentIndex < allSections.length - 1) {
      handleSectionChange(allSections[currentIndex + 1]);
      // Scroll suave al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection, allSections, handleSectionChange]);

  const canGoPrevious = useMemo(() => {
    const currentIndex = allSections.indexOf(activeSection);
    return currentIndex > 0;
  }, [activeSection, allSections]);

  const canGoNext = useMemo(() => {
    const currentIndex = allSections.indexOf(activeSection);
    return currentIndex < allSections.length - 1;
  }, [activeSection, allSections]);

  // Actualizar sección cuando cambia el parámetro URL
  useEffect(() => {
    let section = searchParams.get('section') || 'bienvenida'
    
    // Redirigir 'comercial' al primer sub-dashboard
    if (section === 'comercial') {
      section = 'comercial-estructura-equipo';
      setSearchParams({ section });
    }
    
    if (section !== activeSection) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  useEffect(() => {
    const dashboardType = sectionToDashboardType[activeSection];
    // Si la sección no requiere datos (por sección o por tipo), establecer objeto vacío
    if (noDataRequired.includes(activeSection) || (dashboardType && noDataRequired.includes(dashboardType))) {
      setDashboardData({});
      setLoading(false);
    } else if (dashboardType) {
      loadDashboardData(dashboardType);
    } else {
      // Sección sin tipo mapeado, no requiere datos
      setDashboardData({});
      setLoading(false);
    }
  }, [activeSection]);

  const loadDashboardData = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardData(type);
      setDashboardData(response);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Memoizar el título del dashboard
  const dashboardTitle = useMemo(() => {
    const sectionNames = {
      'bienvenida': 'Bienvenida',
      'fuentes-usos': 'Balance General',
      'auditoria': 'Auditoría',
      'calidad': 'Gerencia Estratégica y Mejoramiento Continuo',
      'calidad-calidad':      'Aseguramiento de Calidad',
      'calidad-compras':      'Compras',
      'calidad-bienestar':    'Bienestar Animal',
      'calidad-hseq':         'HSEQ',
      'calidad-sgc':          'Sistema de Gestión de Calidad',
      'calidad-satisfaccion': 'Satisfacción del Cliente',
      'calidad-vigia':        'Vigía de Riesgos',
      'compras': 'Gestión en Compras',
      'operaciones': 'Operaciones y Mantenimiento',
      'operaciones-tpm': 'Mantenimiento',
      'operaciones-ot': 'Órdenes de Trabajo SIESA',
      'operaciones-vehiculos': 'Mantenimiento de Vehículos',
      'operaciones-arquitectura': 'Arquitectura',
      'planta-beneficio': 'Planta de Beneficio',
      'tecnologias-informacion': 'Tecnologías de la Información',
      'cartera': 'Gestión de Cartera',
      'comercial': 'Gestión Comercial',
      'comercial-resumen': 'Comercial Asignación de Pollo',
      'comercial-estructura-equipo': 'Estructura Comercial',
      'comercial-pdv': 'Puntos de Venta',
      'comercial-productos': 'Comercial Ventas en Pollo en Canal',
      'ventas': 'Equipo de Ventas',
      'humana': 'Gestión Humana',
      'humana-nomina': 'Costo de la Nómina',
      'humana-rotacion': 'Rotación de Personal',
      'humana-causas': 'Causas de Desvinculación',
      'humana-smlv': 'Impacto Salario Mínimo',
      'marketing': 'Gestión de Publicidad y Mercadeo',
      'marketing-general': 'Gestión de Publicidad y Mercadeo',
      'logistica': 'Gestión Logística',
      'produccion': 'Gestión de Producción',
      'produccion-granjas': 'Capacidad de Granjas',
      'produccion-historico': 'Histórico de Producción',
      'sagrilaft': 'Sistema SAGRILAFT',
      'presupuesto-2025': 'Presupuesto 2025',
      'gerencia': 'Gerencia Estratégica'
    };
    
    let title = sectionNames[activeSection] || activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    if (dashboardData && Array.isArray(dashboardData) && dashboardData.length > 0) {
      const firstItem = dashboardData[0];
      
      if (activeSection === 'comercial' && firstItem.sede) {
        const sede = firstItem.sede;
        const canal = firstItem.canal || firstItem.linea;
        if (canal) {
          title += ` - ${sede} - ${canal}`;
        } else {
          title += ` - ${sede}`;
        }
      }
    }
    
    return title;
  }, [activeSection, dashboardData]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)' }}>
      <SectionSplash section={splashSection} trigger={splashTrigger} />
      
      <OrdenDelDiaModal 
        isOpen={showOrdenDelDia}
        onClose={() => setShowOrdenDelDia(false)}
      />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        onLogout={handleLogout}
        onCollapsedChange={handleCollapsedChange}
      />
      
      {/* Botón flotante para abrir Orden del Día */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowOrdenDelDia(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl"
        title="Orden del Día"
      >
        <ClipboardList className="w-6 h-6" />
      </motion.button>
      
      <div 
        className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 transition-[margin-left] duration-200 ease-out"
        style={{ 
          marginLeft: isDesktop ? (isSidebarCollapsed ? '64px' : '256px') : '0'
        }}
      >
        <div 
          className={`mx-auto transition-all duration-200 ${isSidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}
          style={{ 
            visibility: isTransitioning ? 'visible' : 'visible',
            pointerEvents: isTransitioning ? 'none' : 'auto'
          }}
        >
          {/* Header con botones de navegación */}
          <div className="mb-6 lg:mb-8 sticky top-0 z-30 pb-4 pt-2" style={{ background: 'linear-gradient(to bottom, rgba(248,250,252,1) 0%, rgba(248,250,252,0.97) 45%, rgba(241,245,249,0.75) 75%, rgba(241,245,249,0) 100%)' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {dashboardTitle}
                </h1>
              </div>
              
              {/* Botones de navegación */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* Accesos rápidos a sedes (en Análisis Consolidado y en cada sede) */}
                {['logistica-consolidado', 'logistica-sede1', 'logistica-sede2', 'logistica-sede3'].includes(activeSection) && (
                  <div className="flex items-center gap-1 mr-1">
                    {[
                      { id: 'logistica-sede1', label: 'Sede 1' },
                      { id: 'logistica-sede2', label: 'Sede 2' },
                      { id: 'logistica-sede3', label: 'Sede 3' },
                    ].map(({ id, label }) => (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { handleSectionChange(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500/90 hover:bg-indigo-600 text-white shadow transition-all"
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: canGoPrevious ? 1.05 : 1 }}
                  whileTap={{ scale: canGoPrevious ? 0.95 : 1 }}
                  onClick={goToPreviousSection}
                  disabled={!canGoPrevious}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                    canGoPrevious
                      ? 'bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Sección anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Anterior</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: canGoNext ? 1.05 : 1 }}
                  whileTap={{ scale: canGoNext ? 0.95 : 1 }}
                  onClick={goToNextSection}
                  disabled={!canGoNext}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                    canGoNext
                      ? 'bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Siguiente sección"
                >
                  <span className="hidden sm:inline font-medium">Siguiente</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-900">Cargando datos...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && dashboardData && (
            <DashboardWrapper>
              <ErrorBoundary
                key={activeSection}
                title={`Error al cargar: ${dashboardTitle}`}
                onReset={() => loadDashboardData(sectionToDashboardType[activeSection])}
              >
                <DashboardRenderer type={activeSection} data={dashboardData} onNavigate={handleSectionChange} />
              </ErrorBoundary>
            </DashboardWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
