// Store de Dashboard (Carros)
// Gerencia estatísticas e dados do painel de carros

import { defineStore } from 'pinia'
import DashboardService from '@/services/DashboardService'
import { MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    estatisticas: {
      total_carros: 0,
      carros_disponiveis: 0,
      carros_vendidos: 0,
      valor_total_estoque: 0,
      carros_por_categoria: []
    },
    atividades: [],
    categorias: [],
    carregando: false
  }),

  getters: {
    totalCarros: (state) => state.estatisticas.total_carros,
    carrosDisponiveis: (state) => state.estatisticas.carros_disponiveis,
    carrosVendidos: (state) => state.estatisticas.carros_vendidos,
    valorTotalEstoque: (state) => state.estatisticas.valor_total_estoque,
    carrosPorCategoria: (state) => state.estatisticas.carros_por_categoria,

    atividadesRecentes: (state) => state.atividades.slice(0, 10),

    todasCategorias: (state) => state.categorias
  },

  actions: {
async carregarEstatisticasCarros() {
  const uiStore = useUiStore()

  try {
    this.carregando = true
    const dados = await DashboardService.buscarEstatisticasCarros()

    // 🔧 Normaliza os campos para o formato esperado pelos getters
    this.estatisticas = {
      total_carros: dados.total_carros ?? dados.totalCarros ?? 0,
      carros_disponiveis: dados.carros_disponiveis ?? dados.carrosDisponiveis ?? 0,
      carros_vendidos: dados.carros_vendidos ?? dados.carrosVendidos ?? 0,
      valor_total_estoque: dados.valor_total_estoque ?? dados.valorTotalEstoque ?? 0,
      carros_por_categoria: dados.carros_por_categoria ?? dados.carrosPorCategoria ?? []
    }
  } catch (error) {
    const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
    uiStore.mostrarToast(mensagem, 'danger')
    throw error
  } finally {
    this.carregando = false
  }
},

async carregarAtividadesCarros() {
  const uiStore = useUiStore()

  try {
    this.carregando = true
    const dados = await DashboardService.buscarAtividadesCarros()

    // ✅ Garante que cada atividade tenha um objeto carro válido
    this.atividades = (dados.atividades || []).map((a) => ({
      ...a,
      carro: a.carro || { modelo: 'Desconhecido', marca: '—' }
    }))
  } catch (error) {
    const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
    uiStore.mostrarToast(mensagem, 'danger')
    throw error
  } finally {
    this.carregando = false
  }
}
,

    async carregarCategoriasCarros() {
      const uiStore = useUiStore()

      try {
        const dados = await DashboardService.listarCategoriasCarros()
        this.categorias = dados.categorias || []
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        throw error
      }
    },

    async carregarTudo() {
      await Promise.all([
        this.carregarEstatisticasCarros(),
        this.carregarAtividadesCarros(),
        this.carregarCategoriasCarros()
      ])
    }
  }
})
