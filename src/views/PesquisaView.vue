<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Busca de Produtos</h2>

    <SearchInput :count="filtered.length" @search="text = $event" />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="md:col-span-1">
        <FilterCategory @change="categories = $event" />
        <PriceRange @change="updatePrice" />
        <SortOptions @change="sortBy = $event" />
      </div>

      <div class="md:col-span-3">
        <ResultsList :products="filtered" />
      </div>
    </div>
  </div>
</template>

<script>
import { applyFilters } from '@/utils/searchFilters'
import SearchInput from '@/components/busca/SearchInput.vue'
import FilterCategory from '@/components/busca/FilterCategory.vue'
import PriceRange from '@/components/busca/PriceRange.vue'
import SortOptions from '@/components/busca/SortOptions.vue'
import ResultsList from '@/components/busca/ResultsList.vue'

export default {
  name: 'PesquisaView',
  components: {
    SearchInput,
    FilterCategory,
    PriceRange,
    SortOptions,
    ResultsList
  },
  data() {
    return {
      products: [
        { id: 1, name: 'Camiseta Azul', category: 'Roupas', price: 79.9, image: 'https://via.placeholder.com/200', createdAt: '2025-05-01' },
        { id: 2, name: 'Tênis Esportivo', category: 'Calçados', price: 299.9, image: 'https://via.placeholder.com/200', createdAt: '2025-03-15' },
        { id: 3, name: 'Relógio Clássico', category: 'Acessórios', price: 159.9, image: 'https://via.placeholder.com/200', createdAt: '2025-04-10' },
        { id: 4, name: 'Camiseta Preta', category: 'Roupas', price: 89.9, image: 'https://via.placeholder.com/200', createdAt: '2025-02-20' }
      ],
      text: '',
      categories: [],
      minPrice: null,
      maxPrice: null,
      sortBy: 'name-asc'
    }
  },
  computed: {
    filtered() {
      return applyFilters(this.products, {
        text: this.text,
        categories: this.categories,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        sortBy: this.sortBy
      })
    }
  },
  methods: {
    updatePrice({ min, max }) {
      this.minPrice = min
      this.maxPrice = max
    }
  }
}
</script>
