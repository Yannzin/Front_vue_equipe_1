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

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/user', name: 'User', component: User },
  { path: '/blog', name: 'BlogList', component: BlogList },
  { path: '/blog/:id', name: 'BlogPost', component: BlogPost, props: true },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = localStorage.getItem('isAdmin')
      if (isAuthenticated) next()
      else next('/')
    },
    children: [
      { path: '', name: 'AdminHome', component: AdminHome },
      { path: 'posts', name: 'AdminPosts', component: AdminPosts },
      { path: 'posts/new', name: 'AdminPostNew', component: PostForm },
      { path: 'posts/:id/edit', name: 'AdminPostEdit', component: PostForm, props: true },
      { path: 'categories', name: 'AdminCategories', component: () => import('../components/admin/CategoryManager.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
