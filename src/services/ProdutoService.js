// Serviço de Carros
// Gerencia CRUD de carros

import { get, post, put, del } from './api'

class CarroService {
  // Listar todos os carros com filtros
  async listarCarros(filtros = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filtros.categoria) {
        params.append('categoria', filtros.categoria)
      }
      
      if (filtros.busca) {
        params.append('busca', filtros.busca)
      }
      
      if (filtros.ativo !== undefined) {
        params.append('ativo', filtros.ativo)
      }
      
      if (filtros.ordenar) {
        params.append('ordenar', filtros.ordenar)
      }
      
      if (filtros.ordem) {
        params.append('ordem', filtros.ordem)
      }
      
      const queryString = params.toString()
      const url = queryString ? `/api/carros?${queryString}` : '/api/carros'
      
      const response = await get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Buscar carro por ID
  async buscarCarro(id) {
    try {
      const response = await get(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Criar novo carro
  async criarCarro(dados) {
    try {
      const response = await post('/api/carros', dados)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Atualizar carro existente
  async atualizarCarro(id, dados) {
    try {
      const response = await put(`/api/carros/${id}`, dados)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Deletar carro
  async deletarCarro(id) {
    try {
      const response = await del(`/api/carros/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Alternar status ativo/inativo
  async alternarAtivo(id, ativo) {
    try {
      const response = await put(`/api/carros/${id}`, { ativo })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new CarroService()
