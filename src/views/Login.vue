<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="bi bi-box-seam display-3 text-primary"></i>
                <h2 class="mt-3">{{ modoRegistro ? 'Criar Conta' : 'Login' }}</h2>
                <p class="text-muted">
                  {{ modoRegistro ? 'Preencha os dados abaixo' : 'Entre com suas credenciais' }}
                </p>
              </div>
              
              <form @submit.prevent="handleSubmit">
                <div v-if="modoRegistro" class="mb-3">
                  <label class="form-label">Nome</label>
                  <input 
                    v-model="form.nome" 
                    type="text" 
                    class="form-control" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    class="form-control" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Senha</label>
                  <input 
                    v-model="form.senha" 
                    type="password" 
                    class="form-control" 
                    required
                    minlength="6"
                  >
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  :disabled="authStore.carregando"
                >
                  <span v-if="authStore.carregando">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Processando...
                  </span>
                  <span v-else>
                    {{ modoRegistro ? 'Cadastrar' : 'Entrar' }}
                  </span>
                </button>
                
                <div class="text-center">
                  <a href="#" @click.prevent="modoRegistro = !modoRegistro">
                    {{ modoRegistro ? 'Ja tem uma conta? Entrar' : 'Nao tem conta? Cadastre-se' }}
                  </a>
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
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const modoRegistro = ref(false)
const form = ref({
  nome: '',
  email: '',
  senha: ''
})

const handleSubmit = async () => {
  try {
    if (modoRegistro.value) {
      await authStore.cadastrar(form.value.nome, form.value.email, form.value.senha)
    } else {
      await authStore.login(form.value.email, form.value.senha)
    }
    
    // Aguardar um momento para garantir que o estado foi atualizado
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Redirecionar para dashboard
    await router.push('/dashboard')
    
    // Forcar reload se necessario (fallback)
    if (router.currentRoute.value.path === '/login') {
      window.location.href = '/dashboard'
    }
  } catch (error) {
    console.error('Erro no login/cadastro:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
}

.card {
  border: none;
  border-radius: var(--border-radius-xl);
}
</style>
