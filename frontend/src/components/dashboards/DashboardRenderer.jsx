import BienvenidaDashboard from './BienvenidaDashboard';
import ContextoMundialDashboard from './ContextoMundialDashboard';
import EntornoSocioeconomicoDashboard from './EntornoSocioeconomicoDashboard';
import EncasetamientoColombiaDashboard from './EncasetamientoColombiaDashboard';
import NegocioMarchaDashboard from './NegocioMarchaDashboard';
import GerenciaDashboard from './GerenciaDashboard';
import Presupuesto2025Dashboard from './Presupuesto2025Dashboard';
import SituacionEconomicaDashboard from './SituacionEconomicaDashboard';
import CarteraDashboard from './CarteraDashboard';
import FuentesUsosDashboard from './FuentesUsosDashboard';
import HumanaDashboard from './HumanaDashboard';
import MarketingDashboard from './MarketingDashboard';
import MarketingIndicadoresDashboard from './MarketingIndicadoresDashboard';
import MarketingDetalleDashboard from './MarketingDetalleDashboard';
import LogisticaDashboard from './LogisticaDashboard';
import LogisticaDetalleDashboard from './LogisticaDetalleDashboard';
import LogisticaSede1Dashboard from './LogisticaSede1Dashboard';
import LogisticaSede2Dashboard from './LogisticaSede2Dashboard';
import LogisticaSede3Dashboard from './LogisticaSede3Dashboard';
import GestionLogisticaDashboard from './GestionLogisticaDashboard';
import LogisticaMermaDashboard from './LogisticaMermaDashboard';
import SagrilaftDashboard from './SagrilaftDashboard';
import GranjasDashboard from './GranjasDashboard';
import ComercialEstructuraDashboard from './ComercialEstructuraDashboard';
import ComercialEstructuraEquipoDashboard from './ComercialEstructuraEquipoDashboard';
import ComercialVentasCompaniaDashboard from './ComercialVentasCompaniaDashboard';
import ComercialPolloEnteroDashboard from './ComercialPolloEnteroDashboard';
import ComercialPDVDashboard from './ComercialPDVDashboard';
import ComercialProductosDashboard from './ComercialProductosDashboard';
import ComercialAsaderoDashboard from './ComercialAsaderoDashboard';
import ComercialInstitucionalDashboard from './ComercialInstitucionalDashboard';
import ComercialHuevoDashboard from './ComercialHuevoDashboard';
import ProduccionEncasetadoDashboard from './ProduccionEncasetadoDashboard';
import ProduccionPolloEntregadoDashboard from './ProduccionPolloEntregadoDashboard';
import ProduccionHuevosDashboard from './ProduccionHuevosDashboard';
import ProduccionIndicadoresDashboard from './ProduccionIndicadoresDashboard';
import AuditoriaDashboard from './AuditoriaDashboard';
import CalidadDashboard from './CalidadDashboard';
import ComprasDashboard from './ComprasDashboard';
import OperacionesDashboard from './OperacionesDashboard';
import PlantaBeneficioDashboard from './PlantaBeneficioDashboard';
import TecnologiasInformacionDashboard from './TecnologiasInformacionDashboard';
import SituacionJuridicaDashboard from './SituacionJuridicaDashboard';
import AgradecimientosDashboard from './AgradecimientosDashboard';
import EnDesarrollo from './EnDesarrollo';

export default function DashboardRenderer({ type, data, onNavigate }) {
  // Dashboards que no requieren datos del servidor
  const noDataRequired = ['bienvenida', 'bienvenida-inicio', 'contexto-mundial', 'entorno-socioeconomico', 'encasetamiento-colombia', 'negocio-marcha', 'situacion-economica', 'situacion-juridica', 'agradecimientos', 'comercial-estructura-equipo', 'gerencia-estrategica', 'gerencia-estrategica-calidad', 'gerencia-estrategica-compras', 'gerencia-estrategica-bienestar', 'gerencia-estrategica-hseq', 'gerencia-estrategica-ambiental', 'gerencia-estrategica-sgc', 'gerencia-estrategica-satisfaccion', 'gerencia-estrategica-vigia'];
  
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
    case 'bienvenida-inicio':
    case 'bienvenida-principal':
      return <BienvenidaDashboard />;
    case 'contexto-mundial':
      return <ContextoMundialDashboard />;
    case 'entorno-socioeconomico':
      return <EntornoSocioeconomicoDashboard />;
    case 'encasetamiento-colombia':
      return <EncasetamientoColombiaDashboard />;
    case 'negocio-marcha':
      return <NegocioMarchaDashboard />;
    case 'fuentes-usos':
      return <FuentesUsosDashboard data={data} />;
    case 'auditoria':
      return <AuditoriaDashboard data={data} />;
    case 'gerencia-estrategica':
      return <CalidadDashboard data={data} />;
    case 'gerencia-estrategica-calidad':
      return <CalidadDashboard data={data} section="calidad" />;
    case 'gerencia-estrategica-compras':
      return <CalidadDashboard data={data} section="compras" />;
    case 'gerencia-estrategica-bienestar':
      return <CalidadDashboard data={data} section="bienestar" />;
    case 'gerencia-estrategica-hseq':
      return <CalidadDashboard data={data} section="hseq" />;
    case 'gerencia-estrategica-ambiental':
      return <CalidadDashboard data={data} section="ambiental" />;
    case 'gerencia-estrategica-sgc':
      return <CalidadDashboard data={data} section="sgc" />;
    case 'gerencia-estrategica-satisfaccion':
      return <CalidadDashboard data={data} section="satisfaccion" />;
    case 'gerencia-estrategica-vigia':
      return <CalidadDashboard data={data} section="vigia" />;
    case 'compras':
      return <ComprasDashboard data={data} />;
    case 'operaciones':
      return <OperacionesDashboard data={data} />;
    case 'planta-beneficio':
      return <PlantaBeneficioDashboard data={data} />;
    case 'tecnologias-informacion':
      return <TecnologiasInformacionDashboard data={data} />;
    case 'cartera':
      return <CarteraDashboard data={data} />;
    case 'comercial-resumen':
      return <ComercialEstructuraDashboard data={data} />;
    case 'comercial-estructura-equipo':
      return <ComercialEstructuraEquipoDashboard />;
    case 'comercial-ventas-compania':
      return <ComercialVentasCompaniaDashboard data={data} />;
    case 'comercial-pollo-entero':
      return <ComercialPolloEnteroDashboard data={data} />;
    case 'comercial-pdv':
      return <ComercialPDVDashboard data={data} />;
    case 'comercial-productos':
      return <ComercialProductosDashboard data={data} />;
    case 'comercial-asadero':
      return <ComercialAsaderoDashboard data={data} />;
    case 'comercial-institucional':
      return <ComercialInstitucionalDashboard data={data} />;
    case 'comercial-huevo':
      return <ComercialHuevoDashboard data={data} />;
    case 'humana-nomina':
      return <HumanaDashboard data={data} section="nomina" />;
    case 'humana-rotacion':
      return <HumanaDashboard data={data} section="rotacion" />;
    case 'humana-causas':
      return <HumanaDashboard data={data} section="causas" />;
    case 'humana-smlv':
      return <HumanaDashboard data={data} section="smlv" />;
    case 'marketing':
    case 'marketing-general':
      return <MarketingDashboard data={data} />;
    case 'marketing-indicadores':
      return <MarketingIndicadoresDashboard data={data} />;
    case 'marketing-detalle':
      return <MarketingDetalleDashboard data={data} />;
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
    case 'logistica-merma':
      return <LogisticaMermaDashboard data={data} />;
    case 'produccion-granjas':
      return <GranjasDashboard data={data} />;
    case 'produccion-encasetado':
      return <ProduccionEncasetadoDashboard data={data} />;
    case 'produccion-pollo-entregado':
      return <ProduccionPolloEntregadoDashboard data={data} />;
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
    case 'presupuesto-2025':
      return <Presupuesto2025Dashboard data={data} />;
    case 'gerencia':
      return <GerenciaDashboard data={data} />;
    case 'situacion-juridica':
      return <SituacionJuridicaDashboard />;
    case 'situacion-economica':
      return <SituacionEconomicaDashboard onNavigate={onNavigate} />;
    case 'agradecimientos':
      return <AgradecimientosDashboard onBack={() => onNavigate && onNavigate('situacion-economica')} />;
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
