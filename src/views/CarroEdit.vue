<template>
  <div class="carro-form-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="bi bi-pencil me-2"></i>
                Editar Carro
              </h3>
            </div>

            <div class="card-body">
              <div v-if="carregando" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
              </div>

              <form v-else @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Marca *</label>
                    <select v-model="form.marca" class="form-select" required>
                      <option value="">Selecione...</option>
                      <option v-for="cat in MARCAS" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Modelo *</label>
                    <input 
                      v-model="form.modelo" 
                      type="text" 
                      class="form-control"
                      required
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">Ano *</label>
                    <input 
                      v-model="form.ano" 
                      type="number" 
                      class="form-control"
                      required
                      min="1900"
                      max="2099"
                    >
                  </div>

                  <div class="col-md-4">
                    <label class="form-label">Preço *</label>
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
                    <label class="form-label">Quilometragem *</label>
                    <input 
                      v-model="form.quilometragem" 
                      type="number" 
                      class="form-control"
                      required
                      min="0"
                    >
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Cor *</label>
                    <select v-model="form.cor" class="form-select" required>
                      <option value="">Selecione...</option>
                      <option v-for="cat in CORES" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>

                  

                  <div class="col-md-6">
                    <label class="form-label">Categoria *</label>
                    <select v-model="form.categoria" class="form-select" required>
                      <option value="">Selecione...</option>
                      <option v-for="cat in CATEGORIAS" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-12">
                    <label class="form-label">Descrição</label>
                    <textarea 
                      v-model="form.descricao" 
                      class="form-control" 
                      rows="3"
                    ></textarea>
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
                        Carro Ativo
                      </label>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-primary" :disabled="carrosStore.carregando">
                    <span v-if="carrosStore.carregando">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Salvando...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-circle me-2"></i>
                      Salvar Alterações
                    </span>
                  </button>

                  <router-link to="/carros" class="btn btn-outline-secondary">
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarrosStore } from '@/store/carros'
import { CATEGORIAS, MARCAS, CORES } from '@/utils/constants'

// Hooks
const route = useRoute()
const router = useRouter()
const carrosStore = useCarrosStore()

const carregando = ref(true)
const form = ref({
  marca: '',
  modelo: '',
  ano: '',
  preco: 0,
  quilometragem: 0,
  cor: '',
  categoria: '',
  descricao: '',
  imagem_url: '',
  ativo: true
})

const handleSubmit = async () => {
  try {
    await carrosStore.atualizarCarro(route.params.id, form.value)
    router.push('/carros')
  } catch (error) {
    console.error('Erro ao atualizar carro:', error)
  }
}

onMounted(async () => {
  try {
    const carro = await carrosStore.buscarCarro(route.params.id)
    form.value = { ...carro }
  } catch (error) {
    console.error('Erro ao carregar carro:', error)
    router.push('/carros')
  } finally {
    carregando.value = false
  }
})
</script>

<style scoped>
.carro-form-page {
  padding: var(--spacing-xl) 0;
}
</style>
