<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p class="text-sm">{{ post.date }} — {{ post.category }}</p>
    <p>{{ post.content }}</p>
  </div>
</template>








<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref({ title: '', content: '', date: '', category: '' })

onMounted(() => {
  const posts = JSON.parse(localStorage.getItem('posts')) || []
  const found = posts.find(p => String(p.id) === route.params.id)
  if (found) post.value = found
})
</script>
