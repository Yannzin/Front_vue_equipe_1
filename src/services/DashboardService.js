// Servico de Dashboard
// Gerencia dados estatisticos e graficos

import { get } from './api'

class DashboardService {
  // Buscar estatisticas gerais
  async buscarEstatisticasCarros() {
    try {
      const response = await get('/api/dashboard/stats')
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Buscar atividades recentes
  async buscarAtividadesCarros() {
    try {
      const response = await get('/api/dashboard/atividades')
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Listar categorias disponiveis
  async listarCategoriasCarros() {
    try {
      const response = await get('/api/categorias')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new DashboardService();
