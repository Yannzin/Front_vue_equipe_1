<template>
  <div class="produto-form-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                Novo Produto
              </h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label">Nome do Produto *</label>
                    <input 
                      v-model="form.nome" 
                      type="text" 
                      class="form-control"
                      required
                    >
                  </div>
                  
                  <div class="col-md-12">
                    <label class="form-label">Descricao</label>
                    <textarea 
                      v-model="form.descricao" 
                      class="form-control" 
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label">Preco *</label>
                    <div class="input-group">
                      <span class="input-group-text">R$</span>
                      <input 
                        v-model="form.preco" 
                        type="number" 
                        step="0.01"
                        class="form-control"
                        required
                      >
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label">Estoque *</label>
                    <input 
                      v-model="form.estoque" 
                      type="number" 
                      class="form-control"
                      required
                      min="0"
                    >
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label">Categoria *</label>
                    <select v-model="form.categoria" class="form-select" required>
                      <option value="">Selecione...</option>
                      <option v-for="cat in CATEGORIAS" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="col-md-12">
                    <label class="form-label">URL da Imagem</label>
                    <input 
                      v-model="form.imagem_url" 
                      type="url" 
                      class="form-control"
                      placeholder="https://..."
                    >
                  </div>
                  
                  <div class="col-md-12">
                    <div class="form-check">
                      <input 
                        v-model="form.ativo" 
                        class="form-check-input" 
                        type="checkbox" 
                        id="ativo"
                      >
                      <label class="form-check-label" for="ativo">
                        Produto Ativo
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-primary" :disabled="produtosStore.carregando">
                    <span v-if="produtosStore.carregando">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Salvando...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-circle me-2"></i>
                      Salvar Produto
                    </span>
                  </button>
                  <router-link to="/produtos" class="btn btn-outline-secondary">
                    Cancelar
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProdutosStore } from '@/store/produtos'
import { CATEGORIAS } from '@/utils/constants'

const router = useRouter()
const produtosStore = useProdutosStore()

const form = ref({
  nome: '',
  descricao: '',
  preco: 0,
  estoque: 0,
  categoria: '',
  imagem_url: '',
  ativo: true
})

const handleSubmit = async () => {
  try {
    await produtosStore.criarProduto(form.value)
    router.push('/produtos')
  } catch (error) {
    console.error('Erro ao criar produto:', error)
  }
}
</script>

<style scoped>
.produto-form-page {
  padding: var(--spacing-xl) 0;
}
</style>
