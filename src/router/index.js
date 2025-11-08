// Configuracao do Vue Router
// Define todas as rotas e guards de navegacao

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('@/views/Produtos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/produtos/novo',
    name: 'ProdutoNovo',
    component: () => import('@/views/ProdutoNovo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/produtos/:id/editar',
    name: 'ProdutoEdit',
    component: () => import('@/views/ProdutoEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('@/views/Perfil.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Guard de navegacao global
router.beforeEach((to, from, next) => {
  // Aguardar um tick para garantir que o store foi inicializado
  setTimeout(() => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth
    
    console.log('Router Guard:', {
      destino: to.name,
      requiresAuth,
      isAutenticado: authStore.isAutenticado,
      token: authStore.token
    })
    
    if (requiresAuth && !authStore.isAutenticado) {
      // Rota requer autenticacao mas usuario nao esta logado
      console.log('Redirecionando para login - nao autenticado')
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.name === 'Login' && authStore.isAutenticado) {
      // Usuario ja esta logado tentando acessar login
      console.log('Redirecionando para dashboard - ja autenticado')
      next({ name: 'Dashboard' })
    } else {
      // Permitir navegacao
      console.log('Permitindo navegacao')
      next()
    }
  }, 0)
})

export default router
