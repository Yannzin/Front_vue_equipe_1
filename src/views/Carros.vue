<template>
  <div class="page-container">
    <div class="container-fluid">
      <div class="page-header mb-5">
        <h1 class="page-title">
          <i class="bi bi-car-front-fill me-3"></i>
          Carros
        </h1>
        
        <router-link to="/carros/novo" class="btn custom-new-button">
          <i class="bi bi-plus-lg me-2"></i>
          Novo Carro
        </router-link>
      </div>
      
      <div class="card mb-4 filter-card"> 
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
<input 
  v-model="carrosStore.filtros.busca"
  type="text" 
  class="form-control custom-input" 
  placeholder="Buscar carros..."
  @input="aplicarFiltros"
/>

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
                <option value="ano">Ano</option>
                <option value="marca">Marca</option>
                <option value="preco">Preço</option>
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
      
      <div v-if="carrosStore.carregando" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-white-50 mt-3">Carregando carros...</p>
      </div>
      
      <div v-else-if="!carrosStore.carros || carrosStore.carros.length === 0" class="text-center py-5">

        <i class="bi bi-inbox display-1 text-muted"></i>
        <p class="text-white-50 mt-3">Nenhum carro encontrado</p>
      </div>
      
      <div v-else class="row g-4">
        <div 
          v-for="carro in carrosStore.carros"
 
          :key="carro.id"
          class="col-md-4 col-lg-3"
        >
          <div class="card h-100 produto-card item-card">
            <img 
              :src="carro.imagem_url || 'https://via.placeholder.com/300x200'" 
              class="card-img-top" 
              :alt="`${carro.marca} ${carro.modelo}`"
              style="height: 200px; object-fit: cover;"
            >
            <div class="card-body">
              <h5 class="card-title item-title">
                {{ `${carro.marca || ''} ${carro.modelo || ''}`.trim() }}
              </h5>

              <p class="card-text item-text small">{{ truncateText(carro.descricao, 80) }}</p>
              
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong class="text-primary">{{ formatCurrency(carro.preco) }}</strong>
                <span :class="['badge', `bg-${getEstoqueStatus(carro.estoque).cor}`]">
                  Estoque: {{ carro.estoque }}
                </span>
              </div>
              
              <div class="d-flex gap-2">
                <router-link 
                  :to="`/carros/${carro.id}/editar`" 
                  class="btn btn-sm btn-outline-warning flex-grow-1"
                >
                  <i class="bi bi-pencil"></i> Editar
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmarDelecao(carro)"
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
import { ref, onMounted, watch } from 'vue'
import { useCarrosStore } from '@/store/carros'
import { useUiStore } from '@/store/ui'
import { CATEGORIAS } from '@/utils/constants'
import { formatCurrency, truncateText } from '@/utils/formatters'
import { debounce } from '@/utils/helpers'
import { useRoute } from 'vue-router'

const route = useRoute()


const carrosStore = useCarrosStore()
const uiStore = useUiStore()

const filtros = ref({
  busca: '',
  categoria: '',
  ordenar: 'ano',
  ordem: 'desc'
})

const getEstoqueStatus = (estoque) => {
  if (estoque === 0) return { cor: 'danger' }
  if (estoque < 5) return { cor: 'danger' }
  if (estoque < 10) return { cor: 'warning' }
  return { cor: 'success' }
}

const aplicarFiltros = debounce(() => {
  carrosStore.carregarCarros()
}, 300)

const limparFiltros = () => {
  filtros.value = {
    busca: '',
    categoria: '',
    ordenar: 'ano',
    ordem: 'desc'
  }
  carrosStore.limparFiltros()
  carrosStore.carregarCarros()
}

const deletarCarro = async (id) => {
  try {
    await carrosStore.deletarCarro(id) // 🔹 Corrigido: deletarCarro
  } catch (error) {
    console.error('Erro ao deletar carro:', error)
  }
}

const confirmarDelecao = (carro) => {
  uiStore.mostrarModal({
    titulo: 'Confirmar Exclusão',
    mensagem: `Deseja realmente excluir o carro "${carro.marca} ${carro.modelo}"?`,
    tipo: 'danger',
    onConfirm: () => deletarCarro(carro.id) // chama a função corrigida
  })
}

onMounted(() => {
  console.log('Carros.vue → montado, carregando carros...')
  carrosStore.carregarCarros()
})


watch(() => route.fullPath, () => {
  carrosStore.carregarCarros()
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
