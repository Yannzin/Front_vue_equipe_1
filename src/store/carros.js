// Store de Carros
// Gerencia estado e operações de carros

import { defineStore } from 'pinia'
import CarroService from '@/services/CarroService'  // Supondo que o serviço tenha sido adaptado para carros
import { MENSAGENS_SUCESSO, MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useCarrosStore = defineStore('carros', {
  state: () => ({
    carros: [],
    carroAtual: null,
    filtros: {
      categoria: '',   // por exemplo, tipo do carro: SUV, Sedan, etc.
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
    
    carrosPorCategoria: (state) => {
      const grupos = {}
      state.carros.forEach(carro => {
        const cat = carro.categoria || 'Outros'
        if (!grupos[cat]) {
          grupos[cat] = []
        }
        grupos[cat].push(carro)
      })
      return grupos
    },
    
    totalCarros: (state) => state.total,
    
    carrosAtivos: (state) => state.carros.filter(c => c.ativo),
    
    carrosInativos: (state) => state.carros.filter(c => !c.ativo)
  },
  
  actions: {
    async carregarCarros() {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        uiStore.setCarregando(true)
        
        const resultado = await CarroService.listarCarros(this.filtros)

        this.carros = resultado.carros || []
        this.total = resultado.total || 0
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
        uiStore.setCarregando(false)
      }
    },
    
    async buscarCarro(id) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const carro = await CarroService.buscarCarro(id)
        this.carroAtual = carro
        
        return carro
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async criarCarro(dados) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const resultado = await CarroService.criarCarro(dados)
        
        // Recarregar lista de carros
        await this.carregarCarros()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_CRIADO, 'success') // Pode criar MENSAGENS_SUCESSO.CARRO_CRIADO se quiser
        
        return resultado.carro
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async atualizarCarro(id, dados) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const resultado = await CarroService.atualizarCarro(id, dados)
        
        // Recarregar lista de carros
        await this.carregarCarros()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_ATUALIZADO, 'success') // Pode criar MENSAGENS_SUCESSO.CARRO_ATUALIZADO
        
        return resultado.carro
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async deletarCarro(id) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        await CarroService.deletarCarro(id)
        
        // Recarregar lista de carros
        await this.carregarCarros()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_DELETADO, 'success') // Pode criar MENSAGENS_SUCESSO.CARRO_DELETADO
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async alternarAtivo(id, ativo) {
      const uiStore = useUiStore()
      
      try {
        await CarroService.alternarAtivo(id, ativo)
        
        // Recarregar lista de carros
        await this.carregarCarros()
        
        const mensagem = ativo ? 'Carro ativado' : 'Carro desativado'
        uiStore.mostrarToast(mensagem, 'success')
        
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
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
