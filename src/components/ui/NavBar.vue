<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <router-link to="/dashboard" class="navbar-brand">
        <i class="bi bi-box-seam me-2"></i>
        Sistema de Produtos
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="uiStore.alternarSidebar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link">
              <i class="bi bi-speedometer2 me-1"></i>
              Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/produtos" class="nav-link">
              <i class="bi bi-box me-1"></i>
              Produtos
            </router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item">
            <button 
              class="btn btn-link nav-link" 
              @click="uiStore.alternarTema"
              title="Alternar tema"
            >
              <i :class="uiStore.isDarkMode ? 'bi bi-sun' : 'bi bi-moon'"></i>
            </button>
          </li>
          
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="userDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle me-1"></i>
              {{ authStore.nomeUsuario }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link to="/perfil" class="dropdown-item">
                  <i class="bi bi-person me-2"></i>
                  Perfil
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Sair
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  box-shadow: var(--shadow-md);
  height: var(--navbar-height);
}

.nav-link {
  transition: opacity var(--transition-fast);
}

.nav-link:hover {
  opacity: 0.8;
}

.router-link-active {
  font-weight: var(--font-weight-semibold);
}
</style>
