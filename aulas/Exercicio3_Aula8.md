# Exercicio 3: Store de Notificacoes

## Objetivo

Criar um sistema de notificacoes toast usando Pinia, com diferentes tipos de mensagens e auto-remocao.

**Nivel**: Avancado  
**Tempo estimado**: 50 minutos

---

## Tarefa

Implemente um sistema completo de notificacoes tipo toast que pode ser usado em toda a aplicacao.

### Requisitos

1. **Criar store** (`src/stores/notifications.js`):
   - State: `notificacoes` (array), `proximoId` (contador)
   - Getters: `notificacoesAtivas`, `totalNotificacoes`
   - Actions: `adicionar()`, `remover()`, `limparTodas()`
   - Metodos de conveniencia: `success()`, `error()`, `warning()`, `info()`
   - Auto-remocao apos 5 segundos

2. **Criar componente NotificationToast** para exibir notificacoes

3. **Integrar** em outros componentes (carrinho, favoritos)

---

## Codigo Base

### Store de Notificacoes

Crie `src/stores/notifications.js`:

```javascript
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notificacoes: [],
    proximoId: 1
  }),
  
  getters: {
    notificacoesAtivas(state) {
      return state.notificacoes
    },
    
    totalNotificacoes(state) {
      return state.notificacoes.length
    }
  },
  
  actions: {
    adicionar(mensagem, tipo = 'info', duracao = 5000) {
      const notificacao = {
        id: this.proximoId++,
        mensagem,
        tipo, // 'success', 'error', 'warning', 'info'
        timestamp: new Date(),
        duracao
      }
      
      this.notificacoes.push(notificacao)
      
      // Auto-remover apos duracao
      if (duracao > 0) {
        setTimeout(() => {
          this.remover(notificacao.id)
        }, duracao)
      }
      
      return notificacao.id
    },
    
    remover(id) {
      const index = this.notificacoes.findIndex(n => n.id === id)
      if (index > -1) {
        this.notificacoes.splice(index, 1)
      }
    },
    
    limparTodas() {
      this.notificacoes = []
    },
    
    // Metodos de conveniencia
    success(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'success', duracao)
    },
    
    error(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'error', duracao)
    },
    
    warning(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'warning', duracao)
    },
    
    info(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'info', duracao)
    }
  }
})
```

### Componente NotificationToast

Crie `src/components/NotificationToast.vue`:

```vue
<template>
  <div class="notifications-container">
    <TransitionGroup name="toast">
      <div 
        v-for="notificacao in notificationsStore.notificacoesAtivas"
        :key="notificacao.id"
        :class="['toast', `toast-${notificacao.tipo}`]"
        @click="notificationsStore.remover(notificacao.id)"
      >
        <div class="toast-icon">
          {{ getIcone(notificacao.tipo) }}
        </div>
        
        <div class="toast-content">
          <p class="toast-mensagem">{{ notificacao.mensagem }}</p>
        </div>
        
        <button 
          class="toast-close"
          @click.stop="notificationsStore.remover(notificacao.id)"
        >
          ✕
        </button>
        
        <div 
          class="toast-progress"
          :style="{ animationDuration: `${notificacao.duracao}ms` }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'NotificationToast',
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },
  methods: {
    getIcone(tipo) {
      const icones = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }
      return icones[tipo] || icones.info
    }
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  overflow: hidden;
  min-width: 300px;
}

.toast:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* Cores por tipo */
.toast-success {
  border-left: 4px solid #27ae60;
}

.toast-error {
  border-left: 4px solid #e74c3c;
}

.toast-warning {
  border-left: 4px solid #f39c12;
}

.toast-info {
  border-left: 4px solid #3498db;
}

/* Icone */
.toast-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

/* Conteudo */
.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-mensagem {
  margin: 0;
  color: #333;
  font-weight: 500;
  word-wrap: break-word;
}

/* Botao fechar */
.toast-close {
  background: none;
  border: none;
  color: #999;
  font-size: 1.2em;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #333;
}

/* Barra de progresso */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: progress linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Animacoes de entrada/saida */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsivo */
@media (max-width: 480px) {
  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>
```

### Integrar no App.vue

Adicione ao `App.vue`:

```vue
<template>
  <div id="app">
    <!-- Seu conteudo existente -->
    
    <!-- Componente de notificacoes (sempre visivel) -->
    <NotificationToast />
  </div>
</template>

<script>
import NotificationToast from '@/components/NotificationToast.vue'
// Outros imports...

export default {
  name: 'App',
  components: {
    NotificationToast,
    // Outros componentes...
  }
  // Resto do codigo...
}
</script>
```

### Usar em ProductsList

Atualize `src/components/ProductsList.vue`:

```vue
<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useNotificationsStore } from '@/stores/notifications'
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductsList',
  components: { ProductCard },
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    const notificationsStore = useNotificationsStore()
    return { productsStore, cartStore, notificationsStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      this.notificationsStore.success(`${produto.nome} adicionado ao carrinho!`)
    }
  }
}
</script>
```

### Usar em ProductCard (favoritos)

Atualize `src/components/ProductCard.vue`:

```vue
<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useNotificationsStore } from '@/stores/notifications'

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
    const notificationsStore = useNotificationsStore()
    return { favoritesStore, notificationsStore }
  },
  methods: {
    toggleFavorito() {
      const isFavorito = this.favoritesStore.isFavorito(this.produto.id)
      this.favoritesStore.toggleFavorito(this.produto.id)
      
      if (isFavorito) {
        this.notificationsStore.info(`${this.produto.nome} removido dos favoritos`)
      } else {
        this.notificationsStore.success(`${this.produto.nome} adicionado aos favoritos!`)
      }
    }
  }
}
</script>

<template>
  <div class="product-card">
    <div class="product-header">
      <h3>{{ produto.nome }}</h3>
      <button 
        class="btn-favorito"
        :class="{ ativo: favoritesStore.isFavorito(produto.id) }"
        @click="toggleFavorito"
      >
        ❤️
      </button>
    </div>
    
    <!-- Resto do template... -->
  </div>
</template>
```

### Criar Painel de Teste

Crie `src/components/NotificationDemo.vue`:

```vue
<template>
  <div class="notification-demo">
    <h2>Teste de Notificacoes</h2>
    
    <div class="demo-grid">
      <button 
        class="btn-success"
        @click="notificationsStore.success('Operacao realizada com sucesso!')"
      >
        Success
      </button>
      
      <button 
        class="btn-error"
        @click="notificationsStore.error('Ocorreu um erro!')"
      >
        Error
      </button>
      
      <button 
        class="btn-warning"
        @click="notificationsStore.warning('Atencao! Verifique os dados.')"
      >
        Warning
      </button>
      
      <button 
        class="btn-info"
        @click="notificationsStore.info('Voce tem uma nova mensagem.')"
      >
        Info
      </button>
    </div>
    
    <div class="demo-controls">
      <button 
        class="btn-custom"
        @click="notificacoesMultiplas"
      >
        Multiplas Notificacoes
      </button>
      
      <button 
        class="btn-clear"
        @click="notificationsStore.limparTodas()"
      >
        Limpar Todas
      </button>
    </div>
    
    <p>Total: <strong>{{ notificationsStore.totalNotificacoes }}</strong></p>
  </div>
</template>

<script>
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'NotificationDemo',
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },
  methods: {
    notificacoesMultiplas() {
      setTimeout(() => this.notificationsStore.success('Primeira!'), 0)
      setTimeout(() => this.notificationsStore.info('Segunda!'), 300)
      setTimeout(() => this.notificationsStore.warning('Terceira!'), 600)
    }
  }
}
</script>

<style scoped>
.notification-demo {
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 20px 0;
}

.demo-controls {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 1em;
}

.btn-success { background: #27ae60; }
.btn-error { background: #e74c3c; }
.btn-warning { background: #f39c12; }
.btn-info { background: #3498db; }
.btn-custom { background: #9b59b6; flex: 1; }
.btn-clear { background: #95a5a6; flex: 1; }
</style>
```

Adicione ao App.vue como nova aba "Demo".

---

## Teste

1. Execute `npm run dev`
2. Adicione produto ao carrinho - veja notificacao de sucesso
3. Favorite um produto - veja notificacao
4. Navegue para aba "Demo"
5. Teste cada tipo de notificacao
6. Observe auto-remocao apos 5 segundos
7. Clique em notificacao para fechar manualmente
8. Teste multiplas notificacoes simultaneas