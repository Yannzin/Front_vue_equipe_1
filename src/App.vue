<script setup>
import { ref, onMounted } from 'vue';

import GlobalLoadingBar from './components/GlobalLoadingBar.vue'; 




const isRouteLoading = ref(false);


const areTransitionsEnabled = ref(true); 

onMounted(() => {

  if (window.loadingState) {
    window.loadingState.start = () => isRouteLoading.value = true;
    window.loadingState.finish = () => isRouteLoading.value = false;
  }
});
</script>

<template>
  <div id="app">
    
    <GlobalLoadingBar :is-loading="isRouteLoading" />

    <header class="nav">
      <nav class="nav-container">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/blog" class="nav-link">Blog</router-link>
        <router-link to="/about" class="nav-link">Sobre</router-link>
        <router-link to="/user" class="nav-link">Usuário</router-link>
        <router-link to="/admin" class="nav-link">Admin</router-link>
        
        <button @click="areTransitionsEnabled = !areTransitionsEnabled" 
                :aria-label="areTransitionsEnabled ? 'Desativar animações de página' : 'Ativar animações de página'"
                class="toggle-animations-btn"
                :class="{ 'animations-disabled': !areTransitionsEnabled }">
          Animações: {{ areTransitionsEnabled ? 'Ligadas' : 'Desligadas' }}
        </button>
      </nav>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition 
          :name="areTransitionsEnabled ? 'slide-fade' : ''" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>

#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.nav {
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
}
.nav-container {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 10px 0;
}
.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.2s ease;
}
.nav-link:hover {
  color: #42b983;
}
.nav-link.router-link-active {
  color: #42b983;
  font-weight: bold;
}
.main-content {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  min-height: 70vh;
}


.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {

  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); 
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}


.toggle-animations-btn {

  margin-left: auto;
  padding: 5px 10px;
  background-color: #42b983; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.toggle-animations-btn:hover {
  background-color: #3aa673;
}


.toggle-animations-btn:focus {
  outline: 3px solid #2c3e50;
  outline-offset: 2px;
}

.toggle-animations-btn.animations-disabled {
  background-color: #e74c3c;
}
</style>