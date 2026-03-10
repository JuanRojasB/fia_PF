import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import DashboardRenderer from '../components/dashboards/DashboardRenderer';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { ROUTES } from '../routes/paths';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get('section') || 'fuentes-usos';
  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapeo de secciones a tipos de dashboard
  const sectionToDashboardType = {
    'fuentes-usos': 'fuentes-usos',
    'auditoria': 'auditoria',
    'cartera': 'cartera',
    'comercial': 'comercial',
    'ventas': 'ventas',
    'humana': 'humana',
    'humana-detalle': 'humana',
    'logistica': 'logistica',
    'logistica-detalle': 'logistica',
    'produccion-granjas': 'produccion-granjas',
    'produccion-historico': 'produccion-historico',
    'produccion-historico-detalle': 'produccion-historico',
    'produccion-huevo': 'produccion-huevo',
    'sagrilaft': 'sagrilaft',
    'gerencia': 'gerencia'
  };

  // Dashboards que no requieren datos del servidor
  const noDataRequired = ['produccion-huevo'];

  // Función para cambiar de sección que actualiza tanto el estado como la URL
  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    setSearchParams({ section: newSection });
  };

  // Actualizar sección cuando cambia el parámetro URL
  useEffect(() => {
    const section = searchParams.get('section') || 'fuentes-usos';
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
    if (dashboardType) {
      // Si el dashboard no requiere datos, establecer un objeto vacío
      if (noDataRequired.includes(dashboardType)) {
        setDashboardData({});
        setLoading(false);
      } else {
        loadDashboardData(dashboardType);
      }
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

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {(() => {
                const sectionNames = {
                  'fuentes-usos': 'Balance General',
                  'auditoria': 'Auditoría',
                  'cartera': 'Gestión de Cartera',
                  'comercial': 'Gestión Comercial',
                  'ventas': 'Equipo de Ventas',
                  'humana': 'Gestión Humana',
                  'logistica': 'Gestión Logística',
                  'produccion': 'Gestión de Producción',
                  'produccion-granjas': 'Capacidad de Granjas',
                  'produccion-historico': 'Histórico de Producción',
                  'produccion-huevo': 'Producción de Huevo',
                  'sagrilaft': 'Sistema SAGRILAFT',
                  'gerencia': 'Gerencia Estratégica'
                };
                
                let title = sectionNames[activeSection] || activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                // Agregar información adicional si hay datos disponibles
                if (dashboardData && Array.isArray(dashboardData) && dashboardData.length > 0) {
                  const firstItem = dashboardData[0];
                  
                  // Para Gestión Comercial, agregar sede y canal
                  if (activeSection === 'comercial' && firstItem.sede) {
                    const sede = firstItem.sede;
                    const canal = firstItem.canal || firstItem.linea;
                    if (canal) {
                      title += ` - ${sede} - ${canal}`;
                    } else {
                      title += ` - ${sede}`;
                    }
                  }
                  
                  // Para otros dashboards, puedes agregar lógica similar aquí
                }
                
                return title;
              })()}
            </h1>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Cargando datos...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && dashboardData && (
            <DashboardRenderer type={sectionToDashboardType[activeSection]} data={dashboardData} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
