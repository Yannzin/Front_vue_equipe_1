<template>
  <nav class="navbar navbar-expand-lg custom-navbar fixed-top" style="background-color: #000000 !important;">
    <div class="container-fluid d-flex justify-content-between align-items-center py-2">
      
      <div class="d-flex align-items-center" style="width: 30%;">
        <router-link to="/dashboard" class="navbar-brand text-white">
          Drive Imports 
        </router-link>

        <ul class="navbar-nav d-none d-lg-flex">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link text-white-50">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/produtos" class="nav-link text-white-50">Carros</router-link>
          </li>
        </ul>
      </div>

      <div class="text-center" style="width: 30%;">
        <img :src="logoCoroaImage" alt="Drive Imports Logo" class="header-logo mx-auto"> 
      </div>

      <div class="d-flex justify-content-end align-items-center" style="width: 30%;">
        
        <button 
          class="btn btn-link nav-link me-3 p-0" 
          @click="uiStore.alternarTema"
          title="Alternar tema"
        >
          <i :class="uiStore.isDarkMode ? 'bi bi-sun text-white' : 'bi bi-moon text-white'" style="font-size: 1.5rem;"></i>
        </button>
        
        <li class="nav-item dropdown list-unstyled">
          <a 
            class="nav-link dropdown-toggle text-white" 
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
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { computed } from 'vue';

// IMPORTAÇÃO DA LOGO: O caminho deve ser ajustado para a sua estrutura (src/assets/logo/logo01.png)
const logoCoroaImage = new URL('@/assets/logo/logo01.png', import.meta.url).href; 

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
  height: var(--navbar-height);
  padding: 0;
}

.custom-navbar {
    background-color: #000000 !important;
}

.header-logo {
    height: 70px; 
    width: auto;
    display: block;
    transition: height 0.3s ease;
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