import { lazy, Suspense } from 'react';

// Lazy loading de dashboards para mejorar performance
const BienvenidaDashboard = lazy(() => import('./BienvenidaDashboard'));
const ContextoMundialDashboard = lazy(() => import('./ContextoMundialDashboard'));
const EntornoSocioeconomicoDashboard = lazy(() => import('./EntornoSocioeconomicoDashboard'));
const EncasetamientoColombiaDashboard = lazy(() => import('./EncasetamientoColombiaDashboard'));
const NegocioMarchaDashboard = lazy(() => import('./NegocioMarchaDashboard'));
const GerenciaDashboard = lazy(() => import('./GerenciaDashboard'));
const SituacionEconomicaDashboard = lazy(() => import('./SituacionEconomicaDashboard'));
const CarteraDashboard = lazy(() => import('./CarteraDashboard'));
const FuentesUsosDashboard = lazy(() => import('./FuentesUsosDashboard'));
const HumanaDashboard = lazy(() => import('./HumanaDashboard'));
const HumanaCausasDashboard = lazy(() => import('./HumanaCausasDashboard'));
const MarketingDashboard = lazy(() => import('./MarketingDashboard'));
const LogisticaDashboard = lazy(() => import('./LogisticaDashboard'));
const LogisticaDetalleDashboard = lazy(() => import('./LogisticaDetalleDashboard'));
const LogisticaSede1Dashboard = lazy(() => import('./LogisticaSede1Dashboard'));
const LogisticaSede2Dashboard = lazy(() => import('./LogisticaSede2Dashboard'));
const LogisticaSede3Dashboard = lazy(() => import('./LogisticaSede3Dashboard'));
const GestionLogisticaDashboard = lazy(() => import('./GestionLogisticaDashboard'));
const LogisticaMermaDashboard = lazy(() => import('./LogisticaMermaDashboard'));
const SagrilaftDashboard = lazy(() => import('./SagrilaftDashboard'));
const GranjasDashboard = lazy(() => import('./GranjasDashboard'));
const ComercialEstructuraDashboard = lazy(() => import('./ComercialEstructuraDashboard'));
const ComercialVentasCompaniaDashboard = lazy(() => import('./ComercialVentasCompaniaDashboard'));
const ComercialPolloEnteroDashboard = lazy(() => import('./ComercialPolloEnteroDashboard'));
const ComercialPDVDashboard = lazy(() => import('./ComercialPDVDashboard'));
const ComercialProductosDashboard = lazy(() => import('./ComercialProductosDashboard'));
const ComercialAsaderoDashboard = lazy(() => import('./ComercialAsaderoDashboard'));
const ComercialInstitucionalDashboard = lazy(() => import('./ComercialInstitucionalDashboard'));
const ComercialHuevoDashboard = lazy(() => import('./ComercialHuevoDashboard'));
const ProduccionEncasetadoDashboard = lazy(() => import('./ProduccionEncasetadoDashboard'));
const ProduccionPolloEntregadoDashboard = lazy(() => import('./ProduccionPolloEntregadoDashboard'));
const ProduccionHuevosDashboard = lazy(() => import('./ProduccionHuevosDashboard'));
const ProduccionIndicadoresDashboard = lazy(() => import('./ProduccionIndicadoresDashboard'));
const AuditoriaDashboard = lazy(() => import('./AuditoriaDashboard'));
const CalidadDashboard = lazy(() => import('./CalidadDashboard'));
const ComprasDashboard = lazy(() => import('./ComprasDashboard'));
const OperacionesDashboard = lazy(() => import('./OperacionesDashboard'));
const PlantaBeneficioDashboard = lazy(() => import('./PlantaBeneficioDashboard'));
const TecnologiasInformacionDashboard = lazy(() => import('./TecnologiasInformacionDashboard'));
const EnDesarrollo = lazy(() => import('./EnDesarrollo'));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      <p className="mt-4 text-gray-600">Cargando dashboard...</p>
    </div>
  </div>
);

export default function DashboardRenderer({ type, data }) {
  // Dashboards que no requieren datos del servidor
  const noDataRequired = ['bienvenida', 'bienvenida-inicio', 'contexto-mundial', 'entorno-socioeconomico', 'encasetamiento-colombia', 'negocio-marcha', 'situacion-economica'];
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    // Si el dashboard no requiere datos, continuar normalmente
    if (!noDataRequired.includes(type)) {
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border-4 border-gray-300 text-center">
          <div className="text-gray-600 text-lg">No hay datos disponibles para este dashboard</div>
        </div>
      );
    }
  }

  const renderDashboard = () => {
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
      case 'calidad':
        return <CalidadDashboard data={data} />;
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
      case 'humana-general':
        return <HumanaDashboard data={data} />;
      case 'humana-causas':
        return <HumanaCausasDashboard data={data} />;
      case 'marketing':
      case 'marketing-general':
        return <MarketingDashboard data={data} />;
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
      case 'gerencia':
        return <GerenciaDashboard data={data} />;
      case 'situacion-economica':
        return <SituacionEconomicaDashboard />;
      default:
        return (
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-300">
            <div className="text-gray-600 text-lg mb-4">Dashboard tipo: {type}</div>
            <pre className="text-gray-900 text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderDashboard()}
    </Suspense>
  );
}
