import api from '../config/api';

/**
 * Servicio para gestionar dashboards
 */
export const dashboardService = {
  /**
   * Obtiene el resumen de todos los dashboards disponibles
   */
  async getDashboardsSummary() {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error en getDashboardsSummary:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos de un dashboard específico
   * @param {string} type - Tipo de dashboard (auditoria, cartera, humana, etc.)
   */
  async getDashboardData(type) {
    try {
      const response = await api.get(`/dashboard/${type}`);
      console.log(`Dashboard ${type} response:`, response.data);
      // El backend retorna { success: true, data: [...], type: '...' }
      // Extraemos solo el array de datos
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error en getDashboardData(${type}):`, error);
      throw error;
    }
  },


};
