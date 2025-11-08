<template>
  <div id="app" :data-theme="uiStore.tema">
    <!-- NavBar -->
    <NavBar 
      v-if="authStore.isAutenticado && !$route.meta.hideNavbar" 
    />
    
    <!-- Conteudo Principal -->
    <main 
      class="main-content" 
      :class="{ 'with-navbar': authStore.isAutenticado && !$route.meta.hideNavbar }"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Toast Container -->
    <ToastContainer />
    
    <!-- Modal de Confirmacao -->
    <ConfirmDialog />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="uiStore.carregando" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import NavBar from '@/components/ui/NavBar.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()

onMounted(() => {
  // Aplicar tema salvo
  document.documentElement.setAttribute('data-theme', uiStore.tema)
  
  // Tentar restaurar sessao se houver token
  if (authStore.isAutenticado) {
    authStore.atualizarPerfil().catch(() => {
      // Se falhar, fazer logout
      authStore.logout()
    })
  }
})
</script>

<style>
@import '@/styles/main.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg);
  transition: padding-top var(--transition-normal);
}

.main-content.with-navbar {
  padding-top: calc(var(--navbar-height) + var(--spacing-lg));
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }
  
  .main-content.with-navbar {
    padding-top: calc(var(--navbar-height) + var(--spacing-md));
  }
}
</style>
