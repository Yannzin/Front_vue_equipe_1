// Store de Produtos
// Gerencia estado e operacoes de produtos

import { defineStore } from 'pinia'
import ProdutoService from '@/services/ProdutoService'
import { MENSAGENS_SUCESSO, MENSAGENS_ERRO } from '@/utils/constants'
import { useUiStore } from './ui'

export const useProdutosStore = defineStore('produtos', {
  state: () => ({
    produtos: [],
    produtoAtual: null,
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
    produtosFiltrados: (state) => state.produtos,
    
    produtosPorCategoria: (state) => {
      const grupos = {}
      state.produtos.forEach(produto => {
        const cat = produto.categoria || 'Outros'
        if (!grupos[cat]) {
          grupos[cat] = []
        }
        grupos[cat].push(produto)
      })
      return grupos
    },
    
    totalProdutos: (state) => state.total,
    
    produtosAtivos: (state) => state.produtos.filter(p => p.ativo),
    
    produtosInativos: (state) => state.produtos.filter(p => !p.ativo)
  },
  
  actions: {
    async carregarProdutos() {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        uiStore.setCarregando(true)
        
        const resultado = await ProdutoService.listarProdutos(this.filtros)
        
        this.produtos = resultado.produtos || []
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
    
    async buscarProduto(id) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const produto = await ProdutoService.buscarProduto(id)
        this.produtoAtual = produto
        
        return produto
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async criarProduto(dados) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const resultado = await ProdutoService.criarProduto(dados)
        
        // Recarregar lista de produtos
        await this.carregarProdutos()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_CRIADO, 'success')
        
        return resultado.produto
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async atualizarProduto(id, dados) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        const resultado = await ProdutoService.atualizarProduto(id, dados)
        
        // Recarregar lista de produtos
        await this.carregarProdutos()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_ATUALIZADO, 'success')
        
        return resultado.produto
      } catch (error) {
        const mensagem = error.response?.data?.message || MENSAGENS_ERRO.ERRO_GENERICO
        uiStore.mostrarToast(mensagem, 'danger')
        
        throw error
      } finally {
        this.carregando = false
      }
    },
    
    async deletarProduto(id) {
      const uiStore = useUiStore()
      
      try {
        this.carregando = true
        
        await ProdutoService.deletarProduto(id)
        
        // Recarregar lista de produtos
        await this.carregarProdutos()
        
        uiStore.mostrarToast(MENSAGENS_SUCESSO.PRODUTO_DELETADO, 'success')
        
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
        await ProdutoService.alternarAtivo(id, ativo)
        
        // Recarregar lista de produtos
        await this.carregarProdutos()
        
        const mensagem = ativo ? 'Produto ativado' : 'Produto desativado'
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
    
    setProdutoAtual(produto) {
      this.produtoAtual = produto
    },
    
    limparProdutoAtual() {
      this.produtoAtual = null
    }
  }
})
