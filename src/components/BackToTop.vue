<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);

const handleScroll = () => {
  showButton.value = window.scrollY > 300; 
};

const scrollToTop = () => {
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <transition name="fade">
    <button v-if="showButton" 
            @click="scrollToTop" 
            class="back-to-top-btn"
            aria-label="Voltar ao topo da página">
      ↑
    </button>
  </transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  font-size: 1.5em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  transition: opacity 0.3s ease, transform 0.3s ease; 
}
.back-to-top-btn:hover {
  background-color: #0056b3;
}
.back-to-top-btn:focus {
  outline: 3px solid #007bff; 
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>