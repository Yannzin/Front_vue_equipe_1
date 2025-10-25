<template>
  <div class="searchbar" style="display:flex;gap:8px;align-items:center">
    <input v-model="modelSearch" placeholder="Buscar..." />
    <select v-model="modelCategory">
      <option value="">Todas</option>
      <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
    </select>
    <select v-model="modelSort">
      <option value="desc">Mais recentes</option>
      <option value="asc">Mais antigos</option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValueSearch: String,
  modelValueCategory: String,
  modelValueSort: String,
  categories: { type: Array, default: ()=>[] }
})
const emit = defineEmits(['update:modelValueSearch','update:modelValueCategory','update:modelValueSort'])

const modelSearch = computed({
  get: ()=> props.modelValueSearch,
  set: v => emit('update:modelValueSearch', v)
})
const modelCategory = computed({
  get: ()=> props.modelValueCategory,
  set: v => emit('update:modelValueCategory', v)
})
const modelSort = computed({
  get: ()=> props.modelValueSort,
  set: v => emit('update:modelValueSort', v)
})
</script>
