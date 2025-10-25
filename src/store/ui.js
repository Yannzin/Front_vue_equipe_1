// Store de UI
// Gerencia estado da interface (loading, toasts, modals, tema)

import { defineStore } from 'pinia'
import { TEMAS, STORAGE_KEYS, TOAST_DURATION } from '@/utils/constants'
import { generateId } from '@/utils/helpers'

export const useUiStore = defineStore('ui', {
  state: () => ({
    carregando: false,
    tema: localStorage.getItem(STORAGE_KEYS.THEME) || TEMAS.LIGHT,
    toasts: [],
    modal: {
      visivel: false,
      titulo: '',
      mensagem: '',
      tipo: 'info',
      onConfirm: null,
      onCancel: null
    },
    sidebarAberta: false
  }),
  
  getters: {
    isDarkMode: (state) => state.tema === TEMAS.DARK,
    hasToasts: (state) => state.toasts.length > 0,
    modalVisivel: (state) => state.modal.visivel
  },
  
  actions: {
    setCarregando(estado) {
      this.carregando = estado
    },
    
    alternarTema() {
      this.tema = this.tema === TEMAS.LIGHT ? TEMAS.DARK : TEMAS.LIGHT
      localStorage.setItem(STORAGE_KEYS.THEME, this.tema)
      
      // Aplicar tema ao documento
      document.documentElement.setAttribute('data-theme', this.tema)
    },
    
    setTema(tema) {
      if (tema === TEMAS.LIGHT || tema === TEMAS.DARK) {
        this.tema = tema
        localStorage.setItem(STORAGE_KEYS.THEME, tema)
        document.documentElement.setAttribute('data-theme', tema)
      }
    },
    
    mostrarToast(mensagem, tipo = 'info', duracao = TOAST_DURATION.MEDIUM) {
      const id = generateId()
      
      const toast = {
        id,
        mensagem,
        tipo,
        visivel: true
      }
      
      this.toasts.push(toast)
      
      // Remover toast automaticamente
      setTimeout(() => {
        this.removerToast(id)
      }, duracao)
    },
    
    removerToast(id) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },
    
    limparToasts() {
      this.toasts = []
    },
    
    mostrarModal(opcoes) {
      this.modal = {
        visivel: true,
        titulo: opcoes.titulo || 'Confirmacao',
        mensagem: opcoes.mensagem || '',
        tipo: opcoes.tipo || 'info',
        onConfirm: opcoes.onConfirm || null,
        onCancel: opcoes.onCancel || null
      }
    },
    
    confirmarModal() {
      if (this.modal.onConfirm) {
        this.modal.onConfirm()
      }
      this.fecharModal()
    },
    
    cancelarModal() {
      if (this.modal.onCancel) {
        this.modal.onCancel()
      }
      this.fecharModal()
    },
    
    fecharModal() {
      this.modal = {
        visivel: false,
        titulo: '',
        mensagem: '',
        tipo: 'info',
        onConfirm: null,
        onCancel: null
      }
    },
    
    alternarSidebar() {
      this.sidebarAberta = !this.sidebarAberta
    },
    
    fecharSidebar() {
      this.sidebarAberta = false
    },
    
    abrirSidebar() {
      this.sidebarAberta = true
    }
  }
})
