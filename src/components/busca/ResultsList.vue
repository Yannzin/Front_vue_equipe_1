<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="product in products"
      :key="product.id"
      class="border rounded-lg p-4 shadow hover:shadow-lg transition"
    >
      <img
        :src="product.image"
        alt="Produto"
        class="w-full h-40 object-cover rounded-md mb-3"
      />
      <h4 class="font-semibold">{{ product.name }}</h4>
      <p class="text-gray-600">R$ {{ product.price }}</p>
      <p class="text-sm text-gray-400">{{ product.category }}</p>
      <button class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
        Ver detalhes
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultsList',
  props: {
    products: {
      type: Array,
      default: () => []
    }
  }
}
</script>
