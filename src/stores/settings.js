import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    tema: 'claro',
    idioma: 'pt',
    notificacoes: true
  }),
  
  getters: {
    temaAtivo(state) {
      return state.tema
    },
    
    idiomaAtual(state) {
      return state.idioma
    },
    
    notificacoesHabilitadas(state) {
      return state.notificacoes
    }
  },
  
  actions: {
    alterarTema(novoTema) {
      if (novoTema === 'claro' || novoTema === 'escuro') {
        this.tema = novoTema
      }
    },
    
    alterarIdioma(novoIdioma) {
      if (novoIdioma === 'pt' || novoIdioma === 'en') {
        this.idioma = novoIdioma
      }
    },
    
    toggleNotificacoes() {
      this.notificacoes = !this.notificacoes
    }
  },
  
  persist: true
})