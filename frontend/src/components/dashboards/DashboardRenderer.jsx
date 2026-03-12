import BienvenidaDashboard from './BienvenidaDashboard';
import GerenciaDashboard from './GerenciaDashboard';
import CarteraDashboard from './CarteraDashboard';
import FuentesUsosDashboard from './FuentesUsosDashboard';
import HumanaDashboard from './HumanaDashboard';
import HumanaDetalleDashboard from './HumanaDetalleDashboard';
import LogisticaDashboard from './LogisticaDashboard';
import LogisticaDetalleDashboard from './LogisticaDetalleDashboard';
import LogisticaSede1Dashboard from './LogisticaSede1Dashboard';
import LogisticaSede2Dashboard from './LogisticaSede2Dashboard';
import LogisticaSede3Dashboard from './LogisticaSede3Dashboard';
import GestionLogisticaDashboard from './GestionLogisticaDashboard';
import SagrilaftDashboard from './SagrilaftDashboard';
import GranjasDashboard from './GranjasDashboard';
import ComercialResumenDashboard from './ComercialResumenDashboard';
import ComercialPDVDashboard from './ComercialPDVDashboard';
import ComercialProductosDashboard from './ComercialProductosDashboard';
import ComercialHuevoDashboard from './ComercialHuevoDashboard';
import ProduccionEncasetadoDashboard from './ProduccionEncasetadoDashboard';
import ProduccionHuevosDashboard from './ProduccionHuevosDashboard';
import ProduccionIndicadoresDashboard from './ProduccionIndicadoresDashboard';
import AuditoriaDashboard from './AuditoriaDashboard';
import EnDesarrollo from './EnDesarrollo';

export default function DashboardRenderer({ type, data }) {
  // Dashboards que no requieren datos del servidor
  const noDataRequired = [];
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    // Si el dashboard no requiere datos, continuar normalmente
    if (!noDataRequired.includes(type)) {
      return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-12 border border-slate-700 text-center">
          <div className="text-gray-400 text-lg">No hay datos disponibles para este dashboard</div>
        </div>
      );
    }
  }

  switch (type) {
    case 'bienvenida':
      return <BienvenidaDashboard />;
    case 'fuentes-usos':
      return <FuentesUsosDashboard data={data} />;
    case 'auditoria':
      return <AuditoriaDashboard data={data} />;
    case 'cartera':
      return <CarteraDashboard data={data} />;
    case 'comercial-resumen':
      return <ComercialResumenDashboard data={data} />;
    case 'comercial-pdv':
      return <ComercialPDVDashboard data={data} />;
    case 'comercial-productos':
      return <ComercialProductosDashboard data={data} />;
    case 'comercial-huevo':
      return <ComercialHuevoDashboard data={data} />;
    case 'humana':
      return <HumanaDashboard data={data} />;
    case 'humana-detalle':
      return <HumanaDetalleDashboard data={data} />;
    case 'logistica':
      return <LogisticaDashboard data={data} />;
    case 'logistica-detalle':
      return <LogisticaDetalleDashboard data={data} />;
    case 'logistica-sede1':
      return <LogisticaSede1Dashboard data={data} />;
    case 'logistica-sede2':
      return <LogisticaSede2Dashboard data={data} />;
    case 'logistica-sede3':
      return <LogisticaSede3Dashboard data={data} />;
    case 'logistica-consolidado':
      return <GestionLogisticaDashboard data={data} />;
    case 'gestion-logistica':
      return <GestionLogisticaDashboard data={data} />;
    case 'produccion-granjas':
      return <GranjasDashboard data={data} />;
    case 'produccion-encasetado':
      return <ProduccionEncasetadoDashboard data={data} />;
    case 'produccion-huevos':
      return <ProduccionHuevosDashboard data={data} />;
    case 'produccion-indicadores':
      return <ProduccionIndicadoresDashboard data={data} />;
    case 'produccion-huevo':
      return (
        <EnDesarrollo
          titulo="Producción de Huevo en Desarrollo"
          descripcion="Este módulo está siendo actualizado para mostrar datos reales de producción de huevo desde la base de datos. Pronto estará disponible con información detallada sobre postura, zootecnia y flujo de producción."
          modulo="Producción de Huevo"
        />
      );
    case 'sagrilaft':
      return <SagrilaftDashboard data={data} />;
    case 'gerencia':
      return <GerenciaDashboard data={data} />;
    default:
      return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <div className="text-gray-400 text-lg mb-4">Dashboard tipo: {type}</div>
          <pre className="text-white text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
}
