<template>
  <div class="products-list">
    <h2>Produtos Disponíveis</h2>
    
    <div class="products-grid">
      <div
        v-for="produto in productsStore.produtosDisponiveis"
        :key="produto.id"
        class="product-card"
      >
        <h3>{{ produto.nome }}</h3>
        <p class="categoria">{{ produto.categoria }}</p>
        <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
        <p class="estoque">Estoque: {{ produto.estoque }}</p>
        
        <button class="btn-comprar" @click="adicionarAoCarrinho(produto)">
          🛒 Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductsList',
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    return { productsStore, cartStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      alert(`${produto.nome} adicionado ao carrinho!`)
    }
  }
}
</script>

<style scoped>
.products-list {
  padding: 20px;
}

.products-list h2 {
  margin-bottom: 24px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.product-card h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.3em;
}

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
  margin: 8px 0;
}

.preco {
  font-size: 1.5em;
  font-weight: bold;
  color: #27ae60;
  margin: 12px 0;
}

.estoque {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 16px;
}

.btn-comprar {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s;
}

.btn-comprar:hover {
  background: #2980b9;
}

.btn-comprar:active {
  transform: scale(0.98);
}
</style>
