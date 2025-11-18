<template>
  <div class="perfil-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="bi bi-person-circle me-2"></i>
                Meu Perfil
              </h3>
            </div>
            <div class="card-body text-center">
              <i class="bi bi-person-circle display-1 text-primary mb-3"></i>
              
              <h4>{{ authStore.nomeUsuario }}</h4>
              <p class="text-muted">{{ authStore.emailUsuario }}</p>
              
              <div class="mt-4">
                <p class="mb-2">
                  <strong>Membro desde:</strong> 
                  {{ formatDate(authStore.usuario?.data_criacao) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { formatDate } from '@/utils/formatters'

const authStore = useAuthStore()
</script>

<style scoped>
.perfil-page {
  padding: var(--spacing-xxl) 0;
}
</style>
