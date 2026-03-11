const DashboardRepository = require('../../infrastructure/repositories/DashboardRepository');
const GetDashboardDataUseCase = require('../../application/use-cases/dashboard/GetDashboardDataUseCase');

class DashboardController {
  constructor() {
    this.dashboardRepository = new DashboardRepository();
    this.getDashboardDataUseCase = new GetDashboardDataUseCase(this.dashboardRepository);
  }

  async getDashboardData(req, res) {
    try {
      const { type } = req.params;
      const result = await this.getDashboardDataUseCase.execute(type);
      res.json(result);
    } catch (error) {
      console.error('Error en getDashboardData:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos del dashboard',
        error: error.message
      });
    }
  }

  async getDashboardsSummary(req, res) {
    try {
      const dashboards = [
        { id: 'fuentes-usos', name: 'Fuentes y Usos', description: 'Balance general de activos, pasivos y patrimonio', icon: 'ArrowLeftRight' },
        { id: 'auditoria', name: 'Auditoría', description: 'Análisis de merma y control de calidad', icon: 'Shield' },
        { id: 'cartera', name: 'Gestión de Cartera', description: 'Cartera, morosidad y rotación', icon: 'Briefcase' },
        { id: 'comercial-ventas', name: 'Ventas por Canal', description: 'Ventas por sede y canal', icon: 'TrendingUp' },
        { id: 'equipo-ventas', name: 'Equipo de Ventas', description: 'Desempeño del equipo comercial', icon: 'Users' },
        { id: 'humana-personal', name: 'Personal', description: 'Planta de personal y variaciones', icon: 'UserCheck' },
        { id: 'humana-costos', name: 'Costos de Nómina', description: 'Costos de personal', icon: 'DollarSign' },
        { id: 'humana-retiros', name: 'Retiros', description: 'Motivos de retiro de personal', icon: 'UserX' },
        { id: 'logistica', name: 'Gestión Logística', description: 'Costos operacionales logísticos', icon: 'Truck' },
        { id: 'produccion-encasetado', name: 'Encasetado', description: 'Programación vs real de encasetado', icon: 'Package' },
        { id: 'produccion-granjas', name: 'Granjas', description: 'Capacidad y distribución de granjas', icon: 'Home' },
        { id: 'sagrilaft', name: 'Sistema SAGRILAFT', description: 'Cumplimiento normativo', icon: 'Shield' },
        { id: 'gerencia', name: 'Gerencia Estratégica', description: 'Indicadores de gestión estratégica', icon: 'Briefcase' }
      ];

      res.json({
        success: true,
        dashboards
      });
    } catch (error) {
      console.error('Error en getDashboardsSummary:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen de dashboards',
        error: error.message
      });
    }
  }
}

module.exports = new DashboardController();
