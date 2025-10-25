// Servico de Produtos
// Gerencia CRUD de produtos

import { get, post, put, del } from './api'

class ProdutoService {
  // Listar todos os produtos com filtros
  async listarProdutos(filtros = {}) {
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
      const url = queryString ? `/api/produtos?${queryString}` : '/api/produtos'
      
      const response = await get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Buscar produto por ID
  async buscarProduto(id) {
    try {
      const response = await get(`/api/produtos/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Criar novo produto
  async criarProduto(dados) {
    try {
      const response = await post('/api/produtos', dados)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Atualizar produto existente
  async atualizarProduto(id, dados) {
    try {
      const response = await put(`/api/produtos/${id}`, dados)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Deletar produto
  async deletarProduto(id) {
    try {
      const response = await del(`/api/produtos/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Alternar status ativo/inativo
  async alternarAtivo(id, ativo) {
    try {
      const response = await put(`/api/produtos/${id}`, { ativo })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new ProdutoService()
