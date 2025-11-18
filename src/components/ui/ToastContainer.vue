<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <transition-group name="toast">
      <div 
        v-for="toast in uiStore.toasts" 
        :key="toast.id"
        :class="['toast', 'show', `bg-${toast.tipo}`, 'text-white']"
        role="alert"
      >
        <div class="toast-body d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i :class="getIconClass(toast.tipo)" class="me-2"></i>
            <span>{{ toast.mensagem }}</span>
          </div>
          <button 
            type="button" 
            class="btn-close btn-close-white ms-2" 
            @click="uiStore.removerToast(toast.id)"
          ></button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const getIconClass = (tipo) => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    danger: 'bi bi-exclamation-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[tipo] || icons.info
}
</script>

<style scoped>
.toast {
  min-width: 250px;
  margin-bottom: var(--spacing-sm);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
