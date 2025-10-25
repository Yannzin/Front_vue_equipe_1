<template>
  <teleport to="body">
    <div class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 text-white">Carregando...</p>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.spinner-container {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
