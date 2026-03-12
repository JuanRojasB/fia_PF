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
        case 'cartera':
          data = await this.dashboardRepository.getGestionCartera();
          break;
        case 'comercial':
          data = await this.dashboardRepository.getGestionComercial();
          break;
        case 'ventas':
          data = await this.dashboardRepository.getGestionComercial();
          break;
        case 'humana':
          data = await this.dashboardRepository.getGestionHumana();
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
        case 'produccion-historico':
          data = await this.dashboardRepository.getProduccionHistorico();
          break;
        case 'sagrilaft':
          data = await this.dashboardRepository.getSistemaSagrilaft();
          break;
        case 'gerencia':
          data = await this.dashboardRepository.getGestionGerencia();
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
