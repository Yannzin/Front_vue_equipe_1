# Aula 8: Gerenciamento de Estado com Pinia - Guia de Uso

## O que voce vai aprender nesta aula

- Gerenciamento de estado global com Pinia
- Criacao de stores (state, getters, actions)
- Comunicacao entre componentes via stores
- Persistencia de dados no localStorage
- Nao ha backend nesta aula - tudo funciona no frontend!

---

## Estrutura do Projeto (Aula 8)

```
src/
├── main.js                 (configuracao do Pinia)
├── App.vue                 (componente principal com abas)
├── components/
│   ├── ShoppingCart.vue    (carrinho de compras)
│   └── UserProfile.vue     (perfil de usuario)
└── stores/
    ├── cart.js             (store do carrinho)
    ├── user.js             (store do usuario)
    └── products.js         (store de produtos com dados mock)
```

---

## Como Usar

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Instalar Plugin de Persistencia (para exercicios)

```bash
npm install pinia-plugin-persistedstate
```

### 3. Executar a Aplicacao

```bash
npm run dev
```

**IMPORTANTE**: Nao execute o backend! Esta aula usa apenas dados mock no frontend.

---

## Funcionalidades Atuais

### Carrinho de Compras
- Adicionar produtos
- Aumentar/diminuir quantidade
- Remover itens
- Calcular total
- Limpar carrinho

### Perfil de Usuario
- Login simples (sem API)
- Armazenar nome e email
- Logout

### Produtos
- Lista de 5 produtos mock
- Dados locais (sem API)

---

## Stores Implementadas

### 1. Cart Store (`stores/cart.js`)

**State**:
- `items`: Array de produtos no carrinho

**Getters**:
- `totalItems`: Total de itens
- `totalPreco`: Valor total
- `carrinhoVazio`: Boolean

**Actions**:
- `adicionarItem(produto)`
- `removerItem(id)`
- `atualizarQuantidade(id, qtd)`
- `limparCarrinho()`

### 2. User Store (`stores/user.js`)

**State**:
- `nome`: Nome do usuario
- `email`: Email
- `isLoggedIn`: Boolean

**Getters**:
- `nomeCompleto`: Saudacao
- `primeiroNome`: Primeiro nome

**Actions**:
- `login(nome, email)`
- `logout()`

### 3. Products Store (`stores/products.js`)

**State**:
- `produtos`: Array de 5 produtos mock
- `loading`: Boolean
- `erro`: String

**Getters**:
- `produtosDisponiveis`: Produtos com estoque
- `produtoPorId(id)`: Buscar por ID

---

## Exercicios

### Exercicio 1: Store de Configuracoes
**Arquivo**: `aulas/Exercicio1_Aula8.md`

Crie uma store para gerenciar tema (claro/escuro), idioma e notificacoes.

**Objetivo**: Entender state, getters, actions e persistencia.

### Exercicio 2: Store de Favoritos
**Arquivo**: `aulas/Exercicio2_Aula8.md`

Crie um sistema de produtos favoritos.

**Objetivo**: Comunicacao entre stores e uso de getters avancados.

### Exercicio 3: Store de Notificacoes
**Arquivo**: `aulas/Exercicio3_Aula8.md`

Crie um sistema de notificacoes toast.

**Objetivo**: Auto-remocao, animacoes e integracao com toda a aplicacao.

---

## Dicas

### Estado Local vs Global

**Use state local** (dentro do componente):
```vue
<script>
export default {
  data() {
    return {
      mostrarMenu: false // Apenas este componente precisa
    }
  }
}
</script>
```

**Use state global** (Pinia store):
```javascript
// Quando multiplos componentes precisam acessar
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // Varios componentes acessam o carrinho
  })
})
```

### Acessando Stores

```vue
<script>
import { useCartStore } from '@/stores/cart'

export default {
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  }
}
</script>

<template>
  <div>{{ cartStore.totalItems }}</div>
</template>
```

### Getters com Parametros

```javascript
getters: {
  produtoPorId: (state) => (id) => {
    return state.produtos.find(p => p.id === id)
  }
}

// Uso:
const produto = store.produtoPorId(1)
```

### Persistencia

```javascript
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  persist: true // Salva automaticamente no localStorage
})
```

---

## Troubleshooting

### Pinia nao esta definido
```bash
npm install pinia
```

Verifique `main.js`:
```javascript
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)
```

### Store nao persiste dados
```bash
npm install pinia-plugin-persistedstate
```

Configure em `main.js`:
```javascript
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)
```

### Erro ao importar store
Verifique o caminho:
```javascript
import { useCartStore } from '@/stores/cart' // Correto
import { useCartStore } from './stores/cart'  // Se @ nao funcionar
```

---

## Recursos Adicionais

- Documentacao Pinia: https://pinia.vuejs.org/
- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- LocalStorage API: https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage

---

## Proxima Aula

Aula 9: Componentes Avancados e Slots
