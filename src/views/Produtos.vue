<template>
  <div class="page-container">
    <div class="container-fluid">
      <div class="page-header mb-5">
        <h1 class="page-title">
          <i class="bi bi-car-front-fill me-3"></i>
          Carros
        </h1>
        
        <router-link to="/produtos/novo" class="btn custom-new-button">
          <i class="bi bi-plus-lg me-2"></i>
          Novo Carro
        </router-link>
      </div>
      
      <div class="card mb-4 filter-card"> 
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                v-model="filtros.busca"
                type="text" 
                class="form-control custom-input" 
                placeholder="Buscar carros..."
                @input="aplicarFiltros"
              >
            </div>
            
            <div class="col-md-3">
              <select 
                v-model="filtros.categoria" 
                class="form-select custom-input"
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
                class="form-select custom-input"
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
                class="form-select custom-input"
                @change="aplicarFiltros"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
            
            <div class="col-md-1">
              <button class="btn btn-outline-secondary custom-reset-btn w-100" @click="limparFiltros">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="produtosStore.carregando" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-white-50 mt-3">Carregando carros...</p>
      </div>
      
      <div v-else-if="produtosStore.produtos.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="text-white-50 mt-3">Nenhum carro encontrado</p>
      </div>
      
      <div v-else class="row g-4">
        <div 
          v-for="produto in produtosStore.produtos" 
          :key="produto.id"
          class="col-md-4 col-lg-3"
        >
          <div class="card h-100 produto-card item-card">
            <img 
              :src="produto.imagem_url || 'https://via.placeholder.com/300x200'" 
              class="card-img-top" 
              :alt="produto.nome"
              style="height: 200px; object-fit: cover;"
            >
            <div class="card-body">
              <h5 class="card-title item-title">{{ produto.nome }}</h5>
              <p class="card-text item-text small">{{ truncateText(produto.descricao, 80) }}</p>
              
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong class="text-primary">{{ formatCurrency(produto.preco) }}</strong>
                <span :class="['badge', `bg-${getEstoqueStatus(produto.estoque).cor}`]">
                  Estoque: {{ produto.estoque }}
                </span>
              </div>
              
              <div class="d-flex gap-2">
                <router-link 
                  :to="`/produtos/${produto.id}/editar`" 
                  class="btn btn-sm btn-outline-warning flex-grow-1"
                >
                  <i class="bi bi-pencil"></i> Editar
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
    mensagem: `Deseja realmente excluir o carro "${produto.nome}"?`,
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
.page-container {
    padding-top: 50px; 
    padding-bottom: 50px;
    min-height: 100vh;
}

/* -------------------------------------- */
/* ESTILOS DE TEMA (GARANTINDO CONTRASTE) */
/* -------------------------------------- */

/* Fundo da seção de Filtros */
.filter-card, .produto-card {
    background-color: var(--bg-secondary); /* Cinza escuro no Dark Mode */
    border: 1px solid var(--border-color); 
    box-shadow: var(--shadow-md); 
    border-radius: var(--border-radius-xl); 
}

/* INPUTS (BUSCA/SELECTS) */
.custom-input {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary); /* Texto do input muda com o tema */
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-lg);
}

/* Corrige o texto dentro do Select/Input para ser legível */
.custom-input, .custom-input option {
    color: var(--text-primary); 
    background-color: var(--bg-secondary); 
}


/* TÍTULOS E TEXTOS DENTRO DOS CARDS */
.item-title {
    color: var(--text-primary); /* Branco no Dark, Preto no Light */
}
.item-text {
    color: var(--text-muted) !important; /* Muted para detalhes */
}

/* -------------------------------------- */
/* HEADER: TÍTULO E BOTÃO */
/* -------------------------------------- */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem; 
}

.page-title {
    color: var(--text-primary); /* Título principal muda com o tema */
    font-size: 2.5rem; 
    font-weight: 700;
    letter-spacing: -0.05em;
}

/* Estilo do botão "Novo Carro" */
.custom-new-button {
    background-color: var(--color-primary); 
    border-color: var(--color-primary);
    color: white; 
    font-weight: 700; 
    padding: 0.8rem 2rem; 
    border-radius: 50px; 
    transition: all 0.3s ease-in-out;
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4); 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
}

.custom-new-button:hover {
    background-color: var(--color-info); 
    border-color: var(--color-info);
    transform: translateY(-4px); 
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.6);
}

/* -------------------------------------- */
/* EFEITOS (MANTIDOS) */
/* -------------------------------------- */
.produto-card {
    transition: transform var(--transition-normal);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-xl); 
}

.produto-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.custom-reset-btn {
    border-radius: var(--border-radius-lg);
}
</style>