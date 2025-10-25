<template>
  <div class="mb-4">
    <h4 class="font-semibold mb-2">Faixa de preço</h4>
    <div class="flex gap-2 items-center">
      <input type="number" v-model.number="min" @input="emitChange" placeholder="Mín" class="border rounded-md px-2 py-1 w-24" />
      <span>-</span>
      <input type="number" v-model.number="max" @input="emitChange" placeholder="Máx" class="border rounded-md px-2 py-1 w-24" />
    </div>
    <p class="text-sm text-gray-500 mt-1">
      Intervalo: R$ {{ min || 0 }} - R$ {{ max || '∞' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'PriceRange',
  emits: ['change'],
  data() {
    return {
      min: null,
      max: null
    }
  },
  methods: {
    emitChange() {
      this.$emit('change', { min: this.min, max: this.max })
    }
  }
}
</script>
