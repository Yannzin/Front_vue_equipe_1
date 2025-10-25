<template>
  <div class="produtos-page">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i class="bi bi-box me-2"></i>
          Produtos
        </h1>
        <router-link to="/produtos/novo" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          Novo Produto
        </router-link>
      </div>
      
      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                v-model="filtros.busca"
                type="text" 
                class="form-control" 
                placeholder="Buscar produtos..."
                @input="aplicarFiltros"
              >
            </div>
            
            <div class="col-md-3">
              <select 
                v-model="filtros.categoria" 
                class="form-select"
                @change="aplicarFiltros"
              >
                <option value="">Todas as categorias</option>
                <option v-for="cat in CATEGORIAS" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
            
            <div class="col-md-2">
              <select 
                v-model="filtros.ordenar" 
                class="form-select"
                @change="aplicarFiltros"
              >
                <option value="data_criacao">Data</option>
                <option value="nome">Nome</option>
                <option value="preco">Preco</option>
              </select>
            </div>
            
            <div class="col-md-2">
              <select 
                v-model="filtros.ordem" 
                class="form-select"
                @change="aplicarFiltros"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
            
            <div class="col-md-1">
              <button class="btn btn-outline-secondary w-100" @click="limparFiltros">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Lista de Produtos -->
      <div v-if="produtosStore.carregando" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">Carregando produtos...</p>
      </div>
      
      <div v-else-if="produtosStore.produtos.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="text-muted mt-3">Nenhum produto encontrado</p>
      </div>
      
      <div v-else class="row g-4">
        <div 
          v-for="produto in produtosStore.produtos" 
          :key="produto.id"
          class="col-md-4 col-lg-3"
        >
          <div class="card h-100 produto-card">
            <img 
              :src="produto.imagem_url || 'https://via.placeholder.com/300x200'" 
              class="card-img-top" 
              :alt="produto.nome"
              style="height: 200px; object-fit: cover;"
            >
            <div class="card-body">
              <h5 class="card-title">{{ produto.nome }}</h5>
              <p class="card-text text-muted small">{{ truncateText(produto.descricao, 80) }}</p>
              
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong class="text-primary">{{ formatCurrency(produto.preco) }}</strong>
                <span :class="['badge', `bg-${getEstoqueStatus(produto.estoque).cor}`]">
                  Estoque: {{ produto.estoque }}
                </span>
              </div>
              
              <div class="d-flex gap-2">
                <router-link 
                  :to="`/produtos/${produto.id}/editar`" 
                  class="btn btn-sm btn-outline-primary flex-grow-1"
                >
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmarDelecao(produto)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProdutosStore } from '@/store/produtos'
import { useUiStore } from '@/store/ui'
import { CATEGORIAS } from '@/utils/constants'
import { formatCurrency, truncateText } from '@/utils/formatters'
import { debounce } from '@/utils/helpers'

const produtosStore = useProdutosStore()
const uiStore = useUiStore()

const filtros = ref({
  busca: '',
  categoria: '',
  ordenar: 'data_criacao',
  ordem: 'desc'
})

const getEstoqueStatus = (estoque) => {
  if (estoque === 0) return { cor: 'danger' }
  if (estoque < 5) return { cor: 'danger' }
  if (estoque < 10) return { cor: 'warning' }
  return { cor: 'success' }
}

const aplicarFiltros = debounce(() => {
  produtosStore.setFiltros(filtros.value)
  produtosStore.carregarProdutos()
}, 300)

const limparFiltros = () => {
  filtros.value = {
    busca: '',
    categoria: '',
    ordenar: 'data_criacao',
    ordem: 'desc'
  }
  produtosStore.limparFiltros()
  produtosStore.carregarProdutos()
}

const confirmarDelecao = (produto) => {
  uiStore.mostrarModal({
    titulo: 'Confirmar Exclusao',
    mensagem: `Deseja realmente excluir o produto "${produto.nome}"?`,
    tipo: 'danger',
    onConfirm: () => deletarProduto(produto.id)
  })
}

const deletarProduto = async (id) => {
  await produtosStore.deletarProduto(id)
}

onMounted(() => {
  produtosStore.carregarProdutos()
})
</script>

<style scoped>
.produto-card {
  transition: transform var(--transition-normal);
  cursor: pointer;
}

.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
</style>
