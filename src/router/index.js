import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import BlogList from '../views/BlogList.vue'
import BlogPost from '../views/BlogPost.vue'
import About from '../views/About.vue'
import User from '../views/User.vue'

import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminHome from '../views/admin/AdminHome.vue'
import AdminPosts from '../views/admin/AdminPosts.vue'
import PostForm from '../views/admin/PostForm.vue'


const loadingState = {
  isLoading: false,
  start: () => { loadingState.isLoading = true; },
  finish: () => { loadingState.isLoading = false; },
};

window.loadingState = loadingState; 

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home, 

    meta: { title: 'Início', breadcrumb: 'Início' }
  },
  { 
    path: '/about', 
    name: 'About', 
    component: About, 
    meta: { title: 'Sobre', breadcrumb: 'Sobre Nós' }
  },
  { 
    path: '/user', 
    name: 'User', 
    component: User, 
    meta: { title: 'Perfil', breadcrumb: 'Perfil' }
  },
  { 
    path: '/blog', 
    name: 'BlogList', 
    component: BlogList, 
    meta: { title: 'Blog', breadcrumb: 'Blog' }
  },
  { 
    path: '/blog/:id', 
    name: 'BlogPost', 
    component: BlogPost, 
    props: true, 

    meta: { 
      title: 'Post', 
      breadcrumb: (route) => `Post #${route.params.id}` 

    }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { title: 'Admin', breadcrumb: 'Admin' }, 
    beforeEnter: (to, from, next) => {
      const isAuthenticated = localStorage.getItem('isAdmin')
      if (isAuthenticated) next()
      else next('/')
    },
    children: [
      { path: '', name: 'AdminHome', component: AdminHome, meta: { title: 'Painel', breadcrumb: 'Painel' } },
      { 
        path: 'posts', 
        name: 'AdminPosts', 
        component: AdminPosts, 
        meta: { title: 'Gerenciar Posts', breadcrumb: 'Posts' } 
      },
      { 
        path: 'posts/new', 
        name: 'AdminPostNew', 
        component: PostForm,
        meta: { title: 'Novo Post', breadcrumb: 'Novo' } 
      },
      { 
        path: 'posts/:id/edit', 
        name: 'AdminPostEdit', 
        component: PostForm, 
        props: true,
        meta: { title: 'Editar Post', breadcrumb: 'Editar' } 
      },
      { 
        path: 'categories', 
        name: 'AdminCategories', 
        component: () => import('../components/admin/CategoryManager.vue'),
        meta: { title: 'Categorias', breadcrumb: 'Categorias' } 
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {

      return { top: 0, behavior: 'smooth' }; 
    }
  }
})


router.beforeEach((to, from, next) => {

  loadingState.start(); 
  

  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title;
  document.title = title ? `${title} | Meu Blog` : 'Meu Blog Vue';
  
  next();
});

router.afterEach(() => {

  setTimeout(() => {
    loadingState.finish(); 
  }, 300); 
});

router.onError((error) => {
  console.error('Erro de Rota:', error);
  loadingState.finish();
});

export default router