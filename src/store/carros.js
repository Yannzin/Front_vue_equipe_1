// src/store/carros.js
import { defineStore } from 'pinia'
import CarroService from '@/services/CarroService'
import { MENSAGENS_SUCESSO, MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useCarrosStore = defineStore('carros', {
  state: () => ({
    carros: [],
    carroAtual: null,
    filtros: {
      categoria: '',
      busca: '',
      ativo: true,
      ordenar: 'data_criacao',
      ordem: 'desc'
    },
    carregando: false,
    total: 0
  }),

  getters: {
    carrosFiltrados: (state) => state.carros,
    totalCarros: (state) => state.total,
    carrosAtivos: (state) => state.carros.filter(c => c.ativo),
    carrosInativos: (state) => state.carros.filter(c => !c.ativo)
  },

  actions: {
    async carregarCarros() {
      const uiStore = useUiStore()
      this.carregando = true
      uiStore.setCarregando(true)

      try {
        // ✅ Faz chamada real à API via CarroService
        const resultado = await CarroService.listarCarros(this.filtros)

        // Espera que a API retorne array direto ou objeto com { carros, total }
        this.carros = Array.isArray(resultado)
          ? resultado
          : resultado.carros || []

        this.total = resultado.total || this.carros.length
      } catch (error) {
        console.error('Erro ao carregar carros:', error)
        const mensagem =
          error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
      } finally {
        this.carregando = false
        uiStore.setCarregando(false)
      }
    },

    async buscarCarro(id) {
      const uiStore = useUiStore()
      this.carregando = true
      try {
        const carro = await CarroService.buscarCarro(id)
        this.carroAtual = carro
        return carro
      } catch (error) {
        const mensagem =
          error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        throw error
      } finally {
        this.carregando = false
      }
    },

    async criarCarro(dados) {
      const uiStore = useUiStore()
      this.carregando = true
      try {
        const resultado = await CarroService.criarCarro(dados)
        await this.carregarCarros()
        uiStore.mostrarToast(MENSAGENS_SUCESSO.CARRO_CRIADO, 'success')
        return resultado
      } catch (error) {
        const mensagem =
          error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        throw error
      } finally {
        this.carregando = false
      }
    },

    async atualizarCarro(id, dados) {
      const uiStore = useUiStore()
      this.carregando = true
      try {
        await CarroService.atualizarCarro(id, dados)
        await this.carregarCarros()
        uiStore.mostrarToast(MENSAGENS_SUCESSO.CARRO_ATUALIZADO, 'success')
      } catch (error) {
        const mensagem =
          error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        throw error
      } finally {
        this.carregando = false
      }
    },

    async deletarCarro(id) {
      const uiStore = useUiStore()
      this.carregando = true
      try {
        await CarroService.deletarCarro(id)
        await this.carregarCarros()
        uiStore.mostrarToast(MENSAGENS_SUCESSO.CARRO_DELETADO, 'success')
      } catch (error) {
        const mensagem =
          error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        throw error
      } finally {
        this.carregando = false
      }
    },

    setFiltros(novosFiltros) {
      this.filtros = { ...this.filtros, ...novosFiltros }
    },

    limparFiltros() {
      this.filtros = {
        categoria: '',
        busca: '',
        ativo: true,
        ordenar: 'data_criacao',
        ordem: 'desc'
      }
    },

    setCarroAtual(carro) {
      this.carroAtual = carro
    },

    limparCarroAtual() {
      this.carroAtual = null
    }
  }
})
