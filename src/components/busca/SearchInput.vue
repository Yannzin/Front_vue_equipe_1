<template>
  <div class="mb-4">
    <input
      v-model="query"
      @input="debouncedSearch"
      type="text"
      placeholder="Buscar produtos..."
      class="border rounded-md px-3 py-2 w-full"
    />
    <p v-if="count !== null" class="text-sm text-gray-500 mt-1">
      {{ count }} resultado(s) encontrado(s)
    </p>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    count: Number
  },
  emits: ['search'],
  data() {
    return {
      query: '',
      timeout: null
    }
  },
  methods: {
    debouncedSearch() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$emit('search', this.query)
      }, 400)
    }
  }
}
</script>
