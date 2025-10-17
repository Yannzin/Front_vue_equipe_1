import api from './api'

export default {
  // CREATE
  async criar(produto) {
    try {
      const response = await api.post('/posts', produto)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // READ - listar todos
  async listar() {
    try {
      const response = await api.get('/posts')
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // READ - buscar por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/posts/${id}`)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // UPDATE
  async atualizar(id, produto) {
    try {
      const response = await api.put(`/posts/${id}`, produto)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // DELETE
  async deletar(id) {
    try {
      await api.delete(`/posts/${id}`)
      return { sucesso: true }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  }
}
