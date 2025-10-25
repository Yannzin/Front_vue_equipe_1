<template>
  <div class="mb-4">
    <h4 class="font-semibold mb-2">Ordenar por</h4>
    <select v-model="selected" @change="emitChange" class="border rounded-md px-2 py-1">
      <option value="name-asc">Nome (A-Z)</option>
      <option value="price-asc">Preço: menor → maior</option>
      <option value="price-desc">Preço: maior → menor</option>
      <option value="recent">Mais recentes</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SortOptions',
  emits: ['change'],
  data() {
    return { selected: 'name-asc' }
  },
  methods: {
    emitChange() {
      this.$emit('change', this.selected)
    }
  }
}
</script>
