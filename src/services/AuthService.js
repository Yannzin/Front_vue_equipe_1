// Servico de Autenticacao
// Gerencia login, cadastro e perfil de usuario

import { post, get } from './api'
import { STORAGE_KEYS } from '@/utils/constants'

class AuthService {
  // Fazer login
  async login(email, senha) {
    try {
      console.log('AuthService - Enviando requisição de login...')
      const response = await post('/login', { email, senha })
      
      console.log('AuthService - Resposta recebida:', response.data)
      
      // Backend retorna 'access_token', nao 'token'
      const token = response.data.access_token || response.data.token
      const usuario = response.data.user || response.data.usuario
      
      if (token) {
        // Salvar token e dados do usuario
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
        console.log('AuthService - Token salvo:', token)
        
        if (usuario) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(usuario))
          console.log('AuthService - Usuario salvo:', usuario)
        }
        
        // Retornar no formato esperado pela store
        return {
          token: token,
          usuario: usuario
        }
      } else {
        console.warn('AuthService - Token não encontrado na resposta!')
        throw new Error('Token não recebido do servidor')
      }
    } catch (error) {
      console.error('AuthService - Erro no login:', error)
      throw error
    }
  }
  
  // Fazer cadastro
  async cadastrar(nome, email, senha) {
    try {
      const response = await post('/form', { nome, email, senha })
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Fazer logout
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
  
  // Buscar perfil do usuario autenticado
  async buscarPerfil() {
    try {
      const response = await get('/api/perfil')
      
      if (response.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data))
      }
      
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  // Verificar se usuario esta autenticado
  isAutenticado() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN)
  }
  
  // Obter token atual
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  }
  
  // Obter usuario atual
  getUsuario() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER)
    return userData ? JSON.parse(userData) : null
  }
}

export default new AuthService()
