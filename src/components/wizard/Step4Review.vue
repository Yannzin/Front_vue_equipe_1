<template>
  <div>
    <h2>Etapa 4: Revisão dos Dados</h2>

    <pre>{{ modelValue }}</pre>

    <div class="buttons">
      <button @click="$emit('prev')">Anterior</button>
      <button @click="$emit('submit')">Confirmar</button>
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["prev", "submit"]);
</script>

<style scoped>
pre {
  background: #f7f7f7;
  padding: 10px;
  border-radius: 5px;
}
.buttons {
  margin-top: 10px;
}
</style>
