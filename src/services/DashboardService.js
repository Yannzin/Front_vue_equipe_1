// Servico de Dashboard
// Gerencia dados estatisticos e graficos

import { get } from './api'

class DashboardService {
  // Buscar estatisticas gerais
  async buscarEstatisticas() {
    try {
      const response = await get('/api/dashboard/stats')
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Buscar atividades recentes
  async buscarAtividades() {
    try {
      const response = await get('/api/dashboard/atividades')
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Listar categorias disponiveis
  async listarCategorias() {
    try {
      const response = await get('/api/categorias')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new DashboardService()
