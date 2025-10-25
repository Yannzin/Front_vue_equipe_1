import { createApp } from 'vue'
import App from './App.vue'

// Router e Store
import router from './router'
import pinia from './store'

// Bootstrap CSS e Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos globais
import '@/styles/main.css'

// Criar aplicacao
const app = createApp(App)

// Registrar plugins
app.use(router)
app.use(pinia)

// Montar aplicacao
app.mount('#app')

console.log('Sistema de Gerenciamento de Produtos - Aula 12')
console.log('Projeto Final do Curso Vue.js')