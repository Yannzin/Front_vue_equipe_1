<template>
  <div>
    <h1>Blog</h1>
    <SearchBar
      v-modelSearch="searchTerm"
      v-modelCategory="selectedCategory"
      v-modelSort="sortOrder"
      :categories="categories"
    />
    <div class="mb-4">
      <label>Filtrar por categoria:</label>
      <select v-model="selectedCategory" class="border p-2 rounded ml-2">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
      </select>
    </div>

    <div v-for="post in filteredPosts" :key="post.id" class="mb-4 border-b pb-2">
      <h2><router-link :to="`/blog/${post.id}`">{{ post.title }}</router-link></h2>
      <p class="text-sm">{{ post.date }} — {{ post.category }}</p>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SearchBar from '../components/SearchBar.vue'

const posts = ref([])
const categories = ref([])
const searchTerm = ref('')
const selectedCategory = ref('')
const sortOrder = ref('desc')

onMounted(() => {
  posts.value = JSON.parse(localStorage.getItem('posts')) || [
    { id: 1, title: 'Primeiro post', content: 'Conteúdo exemplo', category: 'Notícias', date: '2025-10-20' },
    { id: 2, title: 'Tutorial Vue', content: 'Aprenda Vue', category: 'Tutoriais', date: '2025-10-18' }
  ]
  categories.value = JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: 'Notícias' },
    { id: 2, name: 'Tutoriais' }
  ]
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
