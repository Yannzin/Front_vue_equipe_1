# Exercicio 1: Store de Configuracoes

## Objetivo

Criar uma store Pinia para gerenciar preferencias do usuario (tema, idioma, notificacoes) com persistencia no localStorage.

---

## Tarefa

Implemente um sistema de configuracoes de usuario usando Pinia.

### Requisitos

1. **Criar store** (`src/stores/settings.js`):
   - State: `tema` ('claro'/'escuro'), `idioma` ('pt'/'en'), `notificacoes` (boolean)
   - Getters: `temaAtivo`, `idiomaAtual`, `notificacoesHabilitadas`
   - Actions: `alterarTema()`, `alterarIdioma()`, `toggleNotificacoes()`
   - Persistencia: `persist: true`

2. **Criar componente** (`src/components/SettingsPanel.vue`):
   - Botoes para alternar tema claro/escuro
   - Select para escolher idioma
   - Checkbox para ativar/desativar notificacoes
   - Exibir configuracoes atuais

3. **Aplicar tema dinamicamente** no `App.vue`:
   - Adicionar classe CSS baseada no tema atual
   - Estilos diferentes para tema claro e escuro

---

## Codigo Base

### Store de Configuracoes

Crie `src/stores/settings.js`:

```javascript
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    tema: 'claro',
    idioma: 'pt',
    notificacoes: true
  }),
  
  getters: {
    temaAtivo(state) {
      return state.tema
    },
    
    idiomaAtual(state) {
      return state.idioma
    },
    
    notificacoesHabilitadas(state) {
      return state.notificacoes
    }
  },
  
  actions: {
    alterarTema(novoTema) {
      if (novoTema === 'claro' || novoTema === 'escuro') {
        this.tema = novoTema
      }
    },
    
    alterarIdioma(novoIdioma) {
      if (novoIdioma === 'pt' || novoIdioma === 'en') {
        this.idioma = novoIdioma
      }
    },
    
    toggleNotificacoes() {
      this.notificacoes = !this.notificacoes
    }
  },
  
  persist: true
})
```

### Componente SettingsPanel

Crie `src/components/SettingsPanel.vue`:

```vue
<template>
  <div class="settings-panel">
    <h3>Configuracoes</h3>
    
    <!-- Tema -->
    <div class="setting-item">
      <label>Tema:</label>
      <div class="button-group">
        <button
          :class="{ active: settingsStore.tema === 'claro' }"
          @click="settingsStore.alterarTema('claro')"
        >
          ☀️ Claro
        </button>
        <button
          :class="{ active: settingsStore.tema === 'escuro' }"
          @click="settingsStore.alterarTema('escuro')"
        >
          🌙 Escuro
        </button>
      </div>
    </div>
    
    <!-- Idioma -->
    <div class="setting-item">
      <label>Idioma:</label>
      <select v-model="settingsStore.idioma" @change="settingsStore.alterarIdioma(settingsStore.idioma)">
        <option value="pt">Portugues</option>
        <option value="en">English</option>
      </select>
    </div>
    
    <!-- Notificacoes -->
    <div class="setting-item">
      <label>Notificacoes:</label>
      <input
        type="checkbox"
        :checked="settingsStore.notificacoes"
        @change="settingsStore.toggleNotificacoes()"
      >
      <span>{{ settingsStore.notificacoes ? 'Ativadas' : 'Desativadas' }}</span>
    </div>
    
    <!-- Preview -->
    <div class="preview">
      <strong>Configuracoes atuais:</strong>
      <ul>
        <li>Tema: {{ settingsStore.temaAtivo }}</li>
        <li>Idioma: {{ settingsStore.idiomaAtual }}</li>
        <li>Notificacoes: {{ settingsStore.notificacoesHabilitadas ? 'Sim' : 'Nao' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'SettingsPanel',
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.setting-item {
  margin: 20px 0;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.button-group button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.preview ul {
  margin: 10px 0 0 20px;
}
</style>
```

### Aplicar Tema no App.vue

Adicione ao seu `App.vue`:

```vue
<template>
  <div id="app" :class="temaClass">
    <!-- Seu conteudo existente -->
    
    <!-- Adicionar nova aba para settings -->
    <nav class="tabs">
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
      <button 
        :class="{ active: abaAtiva === 'config' }"
        @click="abaAtiva = 'config'"
      >
        Configuracoes
      </button>
    </nav>
    
    <main class="app-main">
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
      <UserProfile v-if="abaAtiva === 'usuario'" />
      <SettingsPanel v-if="abaAtiva === 'config'" />
    </main>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import ShoppingCart from '@/components/ShoppingCart.vue'
import UserProfile from '@/components/UserProfile.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

export default {
  name: 'App',
  components: {
    ShoppingCart,
    UserProfile,
    SettingsPanel
  },
  setup() {
    const cartStore = useCartStore()
    const settingsStore = useSettingsStore()
    return { cartStore, settingsStore }
  },
  data() {
    return {
      abaAtiva: 'carrinho'
    }
  },
  computed: {
    temaClass() {
      return `tema-${this.settingsStore.tema}`
    }
  }
}
</script>

<style>
/* Tema Claro (padrao) */
#app.tema-claro {
  background-color: #f5f5f5;
  color: #333;
}

/* Tema Escuro */
#app.tema-escuro {
  background-color: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

#app.tema-escuro .app-header {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

#app.tema-escuro .settings-panel,
#app.tema-escuro .shopping-cart,
#app.tema-escuro .user-profile {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

#app.tema-escuro input,
#app.tema-escuro select {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

#app.tema-escuro .preview {
  background-color: #3d3d3d;
}
</style>
```

---

## Configurar Persistencia

No `src/main.js`, certifique-se de ter:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

Instalar plugin:
```bash
npm install pinia-plugin-persistedstate
```

---

## Teste

1. Execute `npm run dev`
2. Alterne entre tema claro e escuro
3. Mude o idioma
4. Ative/desative notificacoes
5. **Recarregue a pagina (F5)** - configuracoes devem persistir!
6. Abra DevTools → Application → Local Storage → veja os dados salvos

