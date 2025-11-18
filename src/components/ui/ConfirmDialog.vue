<template>
  <teleport to="body">
    <transition name="modal">
      <div 
        v-if="uiStore.modalVisivel" 
        class="modal-backdrop"
        @click="uiStore.cancelarModal"
      >
        <div class="modal-dialog" @click.stop>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i :class="getIconClass(uiStore.modal.tipo)" class="me-2"></i>
                {{ uiStore.modal.titulo }}
              </h5>
              <button 
                type="button" 
                class="btn-close" 
                @click="uiStore.cancelarModal"
              ></button>
            </div>
            <div class="modal-body">
              {{ uiStore.modal.mensagem }}
            </div>
            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="uiStore.cancelarModal"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                :class="['btn', `btn-${uiStore.modal.tipo}`]"
                @click="uiStore.confirmarModal"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const getIconClass = (tipo) => {
  const icons = {
    danger: 'bi bi-exclamation-triangle-fill text-danger',
    warning: 'bi bi-exclamation-circle-fill text-warning',
    info: 'bi bi-info-circle-fill text-info',
    success: 'bi bi-check-circle-fill text-success'
  }
  return icons[tipo] || icons.info
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-normal);
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.9);
}
</style>
