<template>
  <div class="mb-4">
    <h4 class="font-semibold mb-2">Categorias</h4>
    <div v-for="cat in categories" :key="cat">
      <label class="flex items-center gap-2">
        <input type="checkbox" :value="cat" v-model="selected" @change="update" />
        {{ cat }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterCategory',
  props: {
    categories: {
      type: Array,
      default: () => ['Roupas', 'Calçados', 'Acessórios']
    }
  },
  emits: ['change'],
  data() {
    return { selected: [] }
  },
  methods: {
    update() {
      this.$emit('change', this.selected)
    }
  }
}
</script>
