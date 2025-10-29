# Exercicio 2: Store de Favoritos

## Objetivo

Criar um sistema de produtos favoritos usando Pinia, permitindo marcar/desmarcar produtos e visualizar lista de favoritos.

**Nivel**: Intermediario  
**Tempo estimado**: 40 minutos

---

## Tarefa

Implemente um sistema completo de favoritos que se comunica com a store de produtos.

### Requisitos

1. **Criar store** (`src/stores/favorites.js`):
   - State: `favoritos` (array de IDs)
   - Getters: `totalFavoritos`, `isFavorito(id)`, `produtosFavoritos`
   - Actions: `adicionarFavorito()`, `removerFavorito()`, `toggleFavorito()`, `limparFavoritos()`
   - Persistencia no localStorage

2. **Atualizar ProductCard** para incluir botao de favorito

3. **Criar componente FavoritesList** para exibir favoritos

4. **Integrar** no App.vue com nova aba

---

## Codigo Base

### Store de Favoritos

Crie `src/stores/favorites.js`:

```javascript
import { defineStore } from 'pinia'
import { useProductsStore } from './products'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoritos: []  // Array de IDs
  }),
  
  getters: {
    totalFavoritos(state) {
      return state.favoritos.length
    },
    
    isFavorito: (state) => (produtoId) => {
      return state.favoritos.includes(produtoId)
    },
    
    produtosFavoritos() {
      const productsStore = useProductsStore()
      return this.favoritos
        .map(id => productsStore.produtoPorId(id))
        .filter(produto => produto !== undefined)
    }
  },
  
  actions: {
    adicionarFavorito(produtoId) {
      if (!this.favoritos.includes(produtoId)) {
        this.favoritos.push(produtoId)
      }
    },
    
    removerFavorito(produtoId) {
      const index = this.favoritos.indexOf(produtoId)
      if (index > -1) {
        this.favoritos.splice(index, 1)
      }
    },
    
    toggleFavorito(produtoId) {
      if (this.isFavorito(produtoId)) {
        this.removerFavorito(produtoId)
      } else {
        this.adicionarFavorito(produtoId)
      }
    },
    
    limparFavoritos() {
      if (confirm('Deseja limpar todos os favoritos?')) {
        this.favoritos = []
      }
    }
  },
  
  persist: true
})
```

### Componente ProductCard

Crie `src/components/ProductCard.vue`:

```vue
<template>
  <div class="product-card">
    <div class="product-header">
      <h3>{{ produto.nome }}</h3>
      <button 
        class="btn-favorito"
        :class="{ ativo: favoritesStore.isFavorito(produto.id) }"
        @click="favoritesStore.toggleFavorito(produto.id)"
      >
        ❤️
      </button>
    </div>
    
    <div class="product-body">
      <p class="categoria">{{ produto.categoria }}</p>
      <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
      <p class="estoque">Estoque: {{ produto.estoque }}</p>
    </div>
    
    <button class="btn-comprar" @click="$emit('adicionar-carrinho', produto)">
      Adicionar ao Carrinho
    </button>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'ProductCard',
  props: {
    produto: {
      type: Object,
      required: true
    }
  },
  emits: ['adicionar-carrinho'],
  setup() {
    const favoritesStore = useFavoritesStore()
    return { favoritesStore }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.product-header h3 {
  margin: 0;
  font-size: 1.1em;
}

.btn-favorito {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.btn-favorito:hover,
.btn-favorito.ativo {
  filter: grayscale(0%);
}

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
}

.preco {
  font-size: 1.4em;
  font-weight: bold;
  color: #27ae60;
  margin: 8px 0;
}

.estoque {
  color: #666;
  font-size: 0.9em;
}

.btn-comprar {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-comprar:hover {
  background: #2980b9;
}
</style>
```

### Componente FavoritesList

Crie `src/components/FavoritesList.vue`:

```vue
<template>
  <div class="favorites-list">
    <div class="header">
      <h2>Meus Favoritos ({{ favoritesStore.totalFavoritos }})</h2>
      
      <button 
        v-if="favoritesStore.totalFavoritos > 0"
        class="btn-limpar"
        @click="favoritesStore.limparFavoritos()"
      >
        Limpar Tudo
      </button>
    </div>
    
    <div v-if="favoritesStore.totalFavoritos === 0" class="empty">
      <p>Voce ainda nao tem favoritos</p>
      <p class="subtitle">Explore os produtos e adicione seus preferidos!</p>
    </div>
    
    <div v-else class="favorites-grid">
      <div 
        v-for="produto in favoritesStore.produtosFavoritos" 
        :key="produto.id"
        class="favorite-item"
      >
        <button 
          class="btn-remover"
          @click="favoritesStore.removerFavorito(produto.id)"
        >
          ✕
        </button>
        
        <h3>{{ produto.nome }}</h3>
        <p class="categoria">{{ produto.categoria }}</p>
        <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
        
        <button 
          class="btn-adicionar"
          @click="adicionarAoCarrinho(produto)"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'FavoritesList',
  setup() {
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()
    return { favoritesStore, cartStore }
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
.favorites-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
}

.btn-limpar {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-limpar:hover {
  background: #c0392b;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.subtitle {
  font-size: 0.9em;
  color: #bbb;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.favorite-item {
  position: relative;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.btn-remover {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.btn-remover:hover {
  background: #c0392b;
}

.favorite-item h3 {
  margin: 0 0 8px 0;
}

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
}

.preco {
  font-size: 1.4em;
  font-weight: bold;
  color: #27ae60;
  margin: 12px 0;
}

.btn-adicionar {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-adicionar:hover {
  background: #2980b9;
}
</style>
```

### Componente ProductsList

Crie `src/components/ProductsList.vue`:

```vue
<template>
  <div class="products-list">
    <h2>Produtos Disponiveis</h2>
    
    <div class="products-grid">
      <ProductCard
        v-for="produto in productsStore.produtosDisponiveis"
        :key="produto.id"
        :produto="produto"
        @adicionar-carrinho="adicionarAoCarrinho"
      />
    </div>
  </div>
</template>

<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductsList',
  components: { ProductCard },
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
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
```

### Integrar no App.vue

```vue
<template>
  <div id="app">
    <header class="app-header">
      <h1>Loja Virtual - Aula 8: Pinia</h1>
      <div class="header-stats">
        <span class="stat">❤️ {{ favoritesStore.totalFavoritos }}</span>
        <span class="stat">🛒 {{ cartStore.totalItems }}</span>
      </div>
    </header>
    
    <nav class="tabs">
      <button 
        :class="{ active: abaAtiva === 'produtos' }"
        @click="abaAtiva = 'produtos'"
      >
        Produtos
      </button>
      <button 
        :class="{ active: abaAtiva === 'favoritos' }"
        @click="abaAtiva = 'favoritos'"
      >
        Favoritos
      </button>
      <button 
        :class="{ active: abaAtiva === 'carrinho' }"
        @click="abaAtiva = 'carrinho'"
      >
        Carrinho
      </button>
      <button 
        :class="{ active: abaAtiva === 'usuario' }"
        @click="abaAtiva = 'usuario'"
      >
        Usuario
      </button>
    </nav>
    
    <main class="app-main">
      <ProductsList v-if="abaAtiva === 'produtos'" />
      <FavoritesList v-if="abaAtiva === 'favoritos'" />
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
      <UserProfile v-if="abaAtiva === 'usuario'" />
    </main>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import ProductsList from '@/components/ProductsList.vue'
import FavoritesList from '@/components/FavoritesList.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import UserProfile from '@/components/UserProfile.vue'

export default {
  name: 'App',
  components: {
    ProductsList,
    FavoritesList,
    ShoppingCart,
    UserProfile
  },
  setup() {
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()
    return { favoritesStore, cartStore }
  },
  data() {
    return {
      abaAtiva: 'produtos'
    }
  }
}
</script>

<style>
/* Estilos existentes do App.vue */
</style>
```

---

## Teste

1. Execute `npm run dev`
2. Navegue para aba "Produtos"
3. Clique no coracao nos cards de produto
4. Veja contador de favoritos no header aumentar
5. Navegue para aba "Favoritos"
6. Remova favoritos individualmente ou todos
7. Recarregue a pagina - favoritos devem persistir
