// Store de Dashboard
// Gerencia estatisticas e dados do dashboard

import { defineStore } from 'pinia'
import DashboardService from '@/services/DashboardService'
import { MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    estatisticas: {
      total_produtos: 0,
      produtos_ativos: 0,
      produtos_inativos: 0,
      valor_total_estoque: 0,
      produtos_estoque_baixo: 0,
      produtos_por_categoria: []
    },
    atividades: [],
    categorias: [],
    carregando: false
  }),
  
  getters: {
    totalProdutos: (state) => state.estatisticas.total_produtos,
    produtosAtivos: (state) => state.estatisticas.produtos_ativos,
    produtosInativos: (state) => state.estatisticas.produtos_inativos,
    valorTotal: (state) => state.estatisticas.valor_total_estoque,
    estoqueBaixo: (state) => state.estatisticas.produtos_estoque_baixo,
    produtosPorCategoria: (state) => state.estatisticas.produtos_por_categoria,
    
    atividadesRecentes: (state) => state.atividades.slice(0, 10),
    
    todasCategorias: (state) => state.categorias
  },
  
  actions: {
    async carregarEstatisticas() {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const dados = await DashboardService.buscarEstatisticas()
        this.estatisticas = dados
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async carregarAtividades() {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const dados = await DashboardService.buscarAtividades()
        this.atividades = dados.atividades || []
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async carregarCategorias() {
      const uiStore = useUiStore()
      
      try {
        const dados = await DashboardService.listarCategorias()
        this.categorias = dados.categorias || []
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      }
    },
    
    async carregarTudo() {
      await Promise.all([
        this.carregarEstatisticas(),
        this.carregarAtividades(),
        this.carregarCategorias()
      ])
    }
  }
})
