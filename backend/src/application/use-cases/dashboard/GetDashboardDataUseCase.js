/**
 * Caso de Uso: Obtener Datos de Dashboard
 * @class GetDashboardDataUseCase
 */
class GetDashboardDataUseCase {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute(dashboardType) {
    try {
      let data;

      switch (dashboardType) {
        case 'fuentes-usos':
          data = await this.dashboardRepository.getFuentesUsos();
          break;
        case 'auditoria':
          data = await this.dashboardRepository.getGestionAuditoria();
          break;
        case 'calidad':
          data = await this.dashboardRepository.getGestionCalidad();
          break;
        case 'cartera':
          data = await this.dashboardRepository.getGestionCartera();
          break;
        case 'comercial-estructura-equipo':
          data = {};
          break;
        case 'comercial':
        case 'ventas':
          data = await this.dashboardRepository.getGestionComercial();
          break;
        case 'humana':
        case 'humana-general':
        case 'humana-causas':
          data = await this.dashboardRepository.getGestionHumana();
          break;
        case 'marketing':
        case 'marketing-general':
          data = await this.dashboardRepository.getGestionMarketing();
          break;
        case 'logistica':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'logistica-sede1':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'logistica-sede2':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'logistica-sede3':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'logistica-consolidado':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'gestion-logistica':
          data = await this.dashboardRepository.getGestionLogistica();
          break;
        case 'produccion-granjas':
          data = await this.dashboardRepository.getProduccionGranjas();
          break;
        case 'produccion-encasetado':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'produccion-pollo-entregado':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'produccion-indicadores':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'produccion-huevos':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'produccion-historico':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'sagrilaft':
          data = await this.dashboardRepository.getSistemaSagrilaft();
          break;
        case 'presupuesto-2025':
          data = await this.dashboardRepository.getGestionGerencia();
          break;
        case 'gerencia':
          data = await this.dashboardRepository.getGestionGerencia();
          break;
        case 'compras':
          data = await this.dashboardRepository.getGestionCompras();
          break;
        case 'comercial-pdv':
          data = await this.dashboardRepository.getComercialPDV();
          break;
        case 'operaciones':
          data = await this.dashboardRepository.getGestionOperaciones();
          break;
        case 'planta-beneficio':
          data = await this.dashboardRepository.getPlantaBeneficio();
          break;
        case 'tecnologias-informacion':
          data = await this.dashboardRepository.getTecnologiasInformacion();
          break;
        default:
          throw new Error(`Dashboard type '${dashboardType}' no encontrado`);
      }

      return {
        success: true,
        data,
        type: dashboardType
      };
    } catch (error) {
      console.error('Error en GetDashboardDataUseCase:', error);
      throw error;
    }
  }
}

module.exports = GetDashboardDataUseCase;
