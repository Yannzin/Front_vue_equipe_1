<template>
  <div class="home-page">
    <div class="container text-center py-5">
      <h1 class="display-4 mb-4">
        <i class="bi bi-box-seam me-3"></i>
        Sistema de Gerenciamento de Produtos
      </h1>
      <p class="lead mb-5">
        Gerencie seus produtos de forma simples e eficiente
      </p>
      
      <div v-if="!authStore.isAutenticado" class="d-flex gap-3 justify-content-center">
        <router-link to="/login" class="btn btn-primary btn-lg">
          <i class="bi bi-box-arrow-in-right me-2"></i>
          Entrar
        </router-link>
      </div>
      
      <div v-else class="d-flex gap-3 justify-content-center">
        <router-link to="/dashboard" class="btn btn-primary btn-lg">
          <i class="bi bi-speedometer2 me-2"></i>
          Ir para Dashboard
        </router-link>
        <router-link to="/produtos" class="btn btn-outline-primary btn-lg">
          <i class="bi bi-box me-2"></i>
          Ver Produtos
        </router-link>
      </div>
      
      <div class="features mt-5 row g-4">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-speedometer2 display-4 text-primary mb-3"></i>
              <h5>Dashboard Completo</h5>
              <p class="text-muted">
                Visualize estatisticas e metricas importantes dos seus produtos
              </p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-box display-4 text-success mb-3"></i>
              <h5>Gestao de Produtos</h5>
              <p class="text-muted">
                Adicione, edite e organize seus produtos com facilidade
              </p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-graph-up display-4 text-info mb-3"></i>
              <h5>Relatorios</h5>
              <p class="text-muted">
                Acompanhe o desempenho e tendencias dos seus produtos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  align-items: center;
}

.features .card {
  border: none;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal);
}

.features .card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
</style>
