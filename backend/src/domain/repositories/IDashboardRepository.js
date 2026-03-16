/**
 * Interfaz del Repositorio de Dashboards
 * @interface IDashboardRepository
 */
class IDashboardRepository {
  async getFuentesUsos() {
    throw new Error('Método getFuentesUsos() debe ser implementado');
  }

  async getGestionCartera() {
    throw new Error('Método getGestionCartera() debe ser implementado');
  }

  async getGestionComercial() {
    throw new Error('Método getGestionComercial() debe ser implementado');
  }

  async getGestionHumana() {
    throw new Error('Método getGestionHumana() debe ser implementado');
  }

  async getGestionLogistica() {
    throw new Error('Método getGestionLogistica() debe ser implementado');
  }

  async getProduccionGranjas() {
    throw new Error('Método getProduccionGranjas() debe ser implementado');
  }

  async getProduccionHistorico() {
    throw new Error('Método getProduccionHistorico() debe ser implementado');
  }

  async getSistemaSagrilaft() {
    throw new Error('Método getSistemaSagrilaft() debe ser implementado');
  }

  async getGestionGerencia() {
    throw new Error('Método getGestionGerencia() debe ser implementado');
  }

  async getGestionAuditoria() {
    throw new Error('Método getGestionAuditoria() debe ser implementado');
  }

  async getComercialPDV() {
    throw new Error('Método getComercialPDV() debe ser implementado');
  }

  async getGestionCalidad() {
    throw new Error('Método getGestionCalidad() debe ser implementado');
  }

  async getGestionMarketing() {
    throw new Error('Método getGestionMarketing() debe ser implementado');
  }

  async getGestionCompras() {
    throw new Error('Método getGestionCompras() debe ser implementado');
  }

  async getGestionOperaciones() {
    throw new Error('Método getGestionOperaciones() debe ser implementado');
  }

  async getPlantaBeneficio() {
    throw new Error('Método getPlantaBeneficio() debe ser implementado');
  }

  async getTecnologiasInformacion() {
    throw new Error('Método getTecnologiasInformacion() debe ser implementado');
  }
}

module.exports = IDashboardRepository;
