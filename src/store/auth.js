// Store de Autenticacao
// Gerencia estado de autenticacao do usuario

import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService'
import { MENSAGENS_SUCESSO, MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: AuthService.getUsuario(),
    token: AuthService.getToken(),
    carregando: false
  }),
  
  getters: {
    isAutenticado: (state) => !!state.token,
    nomeUsuario: (state) => state.usuario?.nome || 'Usuario',
    emailUsuario: (state) => state.usuario?.email || ''
  },
  
  actions: {
    async login(email, senha) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        console.log('Auth Store - Iniciando login...')
        const resultado = await AuthService.login(email, senha)
        
        console.log('Auth Store - Resultado do login:', resultado)
        
        this.token = resultado.token
        this.usuario = resultado.usuario
        
        console.log('Auth Store - Estado atualizado:', {
          token: this.token,
          usuario: this.usuario,
          isAutenticado: this.isAutenticado
        })
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.LOGIN_SUCESSO, 'success')
        
        return true
      } catch (error) {
        console.error('Auth Store - Erro no login:', error)
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_AUTENTICACAO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async cadastrar(nome, email, senha) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        await AuthService.cadastrar(nome, email, senha)
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.CADASTRO_SUCESSO, 'success')
        
        // Fazer login automatico apos cadastro
        await this.login(email, senha)
        
        return true
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    logout() {
      const uiStore = useUiStore()
      
      AuthService.logout()
      
      this.token = null
      this.usuario = null
      
      uiStore.mostrarToast(MENSAGENS_SUCESSO.LOGOUT_SUCESSO, 'info')
    },
    
    async atualizarPerfil() {
      try {
        this.carregando = true
        
        const usuario = await AuthService.buscarPerfil()
        this.usuario = usuario
        
        return usuario
      } catch (error) {
        throw error
      } finally {
        this.carregando = false
      }
    }
  }
})
