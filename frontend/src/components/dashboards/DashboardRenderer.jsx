import GerenciaDashboard from './GerenciaDashboard';
import CarteraDashboard from './CarteraDashboard';
import FuentesUsosDashboard from './FuentesUsosDashboard';
import HumanaDashboard from './HumanaDashboard';
import HumanaDetalleDashboard from './HumanaDetalleDashboard';
import LogisticaDashboard from './LogisticaDashboard';
import LogisticaDetalleDashboard from './LogisticaDetalleDashboard';
import SagrilaftDashboard from './SagrilaftDashboard';
import GranjasDashboard from './GranjasDashboard';
import ComercialDashboard from './ComercialDashboard';
import ProduccionDashboard from './ProduccionDashboard';
import ProduccionDetalleDashboard from './ProduccionDetalleDashboard';
import AuditoriaDashboard from './AuditoriaDashboard';
import ProduccionHuevoDashboard from './ProduccionHuevoDashboard';
import VentasDashboard from './VentasDashboard';

export default function DashboardRenderer({ type, data }) {
  // Dashboards que no requieren datos del servidor
  const noDataRequired = ['produccion-huevo'];
  
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
    case 'fuentes-usos':
      return <FuentesUsosDashboard data={data} />;
    case 'auditoria':
      return <AuditoriaDashboard data={data} />;
    case 'cartera':
      return <CarteraDashboard data={data} />;
    case 'comercial':
      return <ComercialDashboard data={data} />;
    case 'ventas':
      return <VentasDashboard data={data} type="equipo-ventas" />;
    case 'humana':
      return <HumanaDashboard data={data} />;
    case 'humana-detalle':
      return <HumanaDetalleDashboard data={data} />;
    case 'logistica':
      return <LogisticaDashboard data={data} />;
    case 'logistica-detalle':
      return <LogisticaDetalleDashboard data={data} />;
    case 'produccion-granjas':
      return <GranjasDashboard data={data} />;
    case 'produccion-historico':
      return <ProduccionDashboard data={data} />;
    case 'produccion-historico-detalle':
      return <ProduccionDetalleDashboard data={data} />;
    case 'produccion-huevo':
      return <ProduccionHuevoDashboard />;
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
