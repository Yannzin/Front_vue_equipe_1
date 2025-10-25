<template>
  <div class="indicator">
    <div
      v-for="n in 4"
      :key="n"
      :class="['step', { active: n <= step }]"
    >
      Etapa {{ n }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  step: Number
});
</script>

<style scoped>
.indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.step {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-bottom: 3px solid #ccc;
}
.step.active {
  border-color: #42b883;
  font-weight: bold;
}
</style>
