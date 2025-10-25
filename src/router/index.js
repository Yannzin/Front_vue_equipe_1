import { createRouter, createWebHistory } from 'vue-router'
import WizardView from '../views/WizardView.vue'

const routes = [
  { path: '/', redirect: '/formulario' },
  { path: '/formulario', component: () => import('../components/FormularioCompleto.vue') },
  { path: '/cadastro', component: () => import('../views/CadastroView.vue') },
  { path: '/busca', component: () => import('../views/PesquisaView.vue') },
  { path: '/wizard', component: WizardView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
