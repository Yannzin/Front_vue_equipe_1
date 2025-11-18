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

  // 🔽 --- ROTAS DE CARROS --- 🔽
  {
    path: '/carros',
    name: 'Carros',
    component: () => import('@/views/Carros.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/carros/novo',
    name: 'CarroNovo',
    component: () => import('@/views/CarroNovo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/carros/:id/editar',
    name: 'CarroEdit',
    component: () => import('@/views/CarroEdit.vue'),
    meta: { requiresAuth: true }
  },
  // 🔼 --- FIM DAS ROTAS DE CARROS --- 🔼

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

// Guard global (inalterado)
router.beforeEach((to, from, next) => {
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
      console.log('Redirecionando para login - nao autenticado')
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.name === 'Login' && authStore.isAutenticado) {
      console.log('Redirecionando para dashboard - ja autenticado')
      next({ name: 'Dashboard' })
    } else {
      console.log('Permitindo navegacao')
      next()
    }
  }, 0)
})

export default router
