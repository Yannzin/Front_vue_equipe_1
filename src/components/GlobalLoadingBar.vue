<script setup>
import { watch, ref } from 'vue';

const props = defineProps({
  isLoading: Boolean,
});

const progress = ref(0);
let interval;

watch(() => props.isLoading, (newValue) => {
  if (newValue) {
    progress.value = 0;
    
    interval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 5;
      }
    }, 100); 
  } else {
    
    clearInterval(interval);
    progress.value = 100;
    setTimeout(() => {
      progress.value = 0;
    }, 500);
  }
}, { immediate: true });
</script>

<template>
  <div class="loading-bar-container">
    <div 
      class="loading-bar" 
      :style="{ width: progress + '%' }"
      role="progressbar" 
      aria-valuenow="progress" 
      aria-valuemin="0" 
      aria-valuemax="100"
    ></div>
  </div>
</template>

<style scoped>
.loading-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  overflow: hidden;
}
.loading-bar {
  height: 100%;
  background-color: #007bff; 
  transition: width 0.3s ease, opacity 0.5s ease;
  opacity: v-bind('progress > 0 && progress < 100 ? 1 : 0');
}
</style>