// Cliente HTTP configurado com Axios
// Centraliza configuracao de requisicoes para o backend

import axios from 'axios'
import { STORAGE_KEYS, MENSAGENS_ERRO } from '@/utils/constants'

// URL base da API (ajustar conforme ambiente)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Criar instancia do axios com configuracoes customizadas
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de requisicao - adiciona token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Servidor respondeu com status de erro
      const status = error.response.status
      
      if (status === 401) {
        // Token invalido ou expirado - limpar autenticacao
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        
        // Redirecionar para login (se router estiver disponivel)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        // Sem permissao
        error.message = MENSAGENS_ERRO.ERRO_PERMISSAO
      } else if (status === 404) {
        // Recurso nao encontrado
        error.message = error.response.data?.message || 'Recurso nao encontrado'
      } else if (status >= 500) {
        // Erro no servidor
        error.message = MENSAGENS_ERRO.ERRO_SERVIDOR
      }
    } else if (error.request) {
      // Requisicao feita mas sem resposta
      error.message = MENSAGENS_ERRO.ERRO_CONEXAO
    }
    
    return Promise.reject(error)
  }
)

// Funcoes auxiliares para requisicoes

export const get = (url, config = {}) => api.get(url, config)

export const post = (url, data = {}, config = {}) => api.post(url, data, config)

export const put = (url, data = {}, config = {}) => api.put(url, data, config)

export const del = (url, config = {}) => api.delete(url, config)

export const patch = (url, data = {}, config = {}) => api.patch(url, data, config)

// Exportar instancia configurada
export default api
