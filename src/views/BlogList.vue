<template>
  <div class="blog-list-page">
    <h1>Blog</h1>
    
    <Breadcrumbs /> 

    <SearchBar
      v-modelSearch="searchTerm"
      v-modelCategory="selectedCategory"
      v-modelSort="sortOrder"
      :categories="categories"
    />
    
    <div class="mb-4">
      <label class="font-semibold text-gray-700">Filtrar por categoria:</label>
      <select v-model="selectedCategory" class="border p-2 rounded ml-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
      </select>
    </div>

    <div v-if="error" class="error-message p-4 my-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
      {{ error }}
      <button @click="fetchData" class="text-blue-600 font-bold ml-4 hover:underline">Tentar Novamente</button>
    </div>

    <div v-else-if="isLoading" class="posts-list">
      <PostSkeleton v-for="n in 3" :key="n" /> 
    </div>

    <div v-else class="posts-list">
      
      <p v-if="!filteredPosts.length" class="text-xl text-gray-500 p-8 text-center">
        Nenhum post encontrado com os filtros aplicados. 😔
      </p>

      <transition-group name="list" tag="div">
        <div v-for="post in filteredPosts" :key="post.id" class="post-item mb-4 border-b pb-4">
          <h2>
            <router-link 
              :to="`/post/${post.id}`" 
              class="post-link text-xl font-bold text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
              :aria-label="`Leia mais sobre: ${post.title}`">
              {{ post.title }}
            </router-link>
          </h2>
          <p class="text-sm text-gray-500 mt-1 mb-2">{{ post.date }} — {{ post.category }}</p>
          <p class="text-gray-700">{{ post.content }}</p>
        </div>
      </transition-group>
    </div>

    <BackToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SearchBar from '../components/SearchBar.vue'
// Componentes UX (devem ser criados nos passos anteriores)
import PostSkeleton from '../components/PostSkeleton.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import BackToTop from '../components/BackToTop.vue'

// --- ESTADOS ---
const posts = ref([])
const categories = ref([])
const searchTerm = ref('')
const selectedCategory = ref('')
const sortOrder = ref('desc')

// Requisito: Loading States
const isLoading = ref(true)
const error = ref(null)

// --- MÉTODOS ---

const fetchData = () => {
  isLoading.value = true
  error.value = null

  // Simulação de chamada assíncrona (substitua por sua chamada real à API!)
  setTimeout(() => {
    try {
        // Simulação de sucesso (80% de chance)
        if (Math.random() > 0.2) { 
            posts.value = JSON.parse(localStorage.getItem('posts')) || [
                { id: 1, title: 'Primeiro post sobre Notícias', content: 'Conteúdo exemplo de notícias relevantes.', category: 'Notícias', date: '2025-10-20' },
                { id: 2, title: 'Tutorial Vue 3 e Composition API', content: 'Aprenda Vue com o novo Composition API.', category: 'Tutoriais', date: '2025-10-18' },
                { id: 3, title: 'Últimas novidades do Front-end', content: 'O que está em alta no desenvolvimento web.', category: 'Notícias', date: '2025-10-22' }
            ]
            categories.value = JSON.parse(localStorage.getItem('categories')) || [
                { id: 1, name: 'Notícias' },
                { id: 2, name: 'Tutoriais' }
            ]
            isLoading.value = false
        } else {
            // Requisito: Feedback para erros de carregamento
            throw new Error('Erro de conexão com o servidor. Tente novamente mais tarde.')
        }
    } catch (e) {
        error.value = e.message
        isLoading.value = false
    }
  }, 1200) // Simulação de 1.2s de carregamento (tempo mínimo para o Skeleton ser visível)
}

onMounted(() => {
  fetchData() // Chama a função que gerencia o loading
})

const filteredPosts = computed(() => {
  let list = posts.value.slice()

  if (searchTerm.value) {
    list = list.filter(p => p.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
  }
  if (selectedCategory.value) {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  list.sort((a,b)=> sortOrder.value === 'desc' ? new Date(b.date)-new Date(a.date) : new Date(a.date)-new Date(b.date))
  return list
})
</script>

<style scoped>
/* Transições para o list-group (Requisito: Animações de Transição) */
.list-move, /* aplicada a elementos em movimento durante transições */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* Garante que o item de saída não afete o layout de entrada */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>