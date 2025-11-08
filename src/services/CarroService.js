// Serviço de Carros
// Responsável pelo CRUD e filtros de carros

import { get, post, put, del } from './api'

class CarroService {
  /**
   * Lista todos os carros, com filtros opcionais
   * @param {Object} filtros - filtros opcionais
   * @param {string} filtros.categoria - categoria do carro (SUV, Sedan, etc.)
   * @param {string} filtros.busca - termo de busca (marca/modelo)
   * @param {boolean} filtros.ativo - filtrar por status
   * @param {string} filtros.ordenar - campo de ordenação
   * @param {string} filtros.ordem - 'asc' ou 'desc'
   */
  async listarCarros(filtros = {}) {
    try {
      const params = new URLSearchParams()

      if (filtros.categoria) params.append('categoria', filtros.categoria)
      if (filtros.busca) params.append('busca', filtros.busca)
      if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo)
      if (filtros.ordenar) params.append('ordenar', filtros.ordenar)
      if (filtros.ordem) params.append('ordem', filtros.ordem)

      const queryString = params.toString()
      const url = queryString ? `/api/carros?${queryString}` : '/api/carros'

      const response = await get(url)
      return response.data
    } catch (error) {
      console.error('Erro ao listar carros:', error)
      throw error
    }
  }

  /**
   * Busca um carro pelo ID
   * @param {number|string} id - ID do carro
   */
  async buscarCarro(id) {
    try {
      const response = await get(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar carro:', error)
      throw error
    }
  }

  /**
   * Cria um novo carro
   * @param {Object} dados - dados do carro
   */
  async criarCarro(dados) {
    try {
      const response = await post('/api/carros', dados)
      return response.data
    } catch (error) {
      console.error('Erro ao criar carro:', error)
      throw error
    }
  }

  /**
   * Atualiza um carro existente
   * @param {number|string} id - ID do carro
   * @param {Object} dados - dados atualizados
   */
  async atualizarCarro(id, dados) {
    try {
      const response = await put(`/api/carros/${id}`, dados)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar carro:', error)
      throw error
    }
  }

  /**
   * Deleta um carro pelo ID
   * @param {number|string} id - ID do carro
   */
  async deletarCarro(id) {
    try {
      const response = await del(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao deletar carro:', error)
      throw error
    }
  }

  /**
   * Altera o status ativo/inativo de um carro
   * @param {number|string} id - ID do carro
   * @param {boolean} ativo - novo status
   */
  async alternarAtivo(id, ativo) {
    try {
      const response = await put(`/api/carros/${id}`, { ativo })
      return response.data
    } catch (error) {
      console.error('Erro ao alternar status do carro:', error)
      throw error
    }
  }
}

export default new CarroService()
