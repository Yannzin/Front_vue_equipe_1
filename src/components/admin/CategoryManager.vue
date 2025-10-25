<template>
  <div>
    <h2>Gerenciar Categorias</h2>
    <form @submit.prevent="add">
      <input v-model="name" placeholder="Nova categoria" />
      <button type="submit">Adicionar</button>
    </form>

    <ul>
      <li v-for="c in categories" :key="c.id">
        {{ c.name }}
        <button @click="remove(c.id)" style="margin-left:8px">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const categories = ref([])
const name = ref('')

onMounted(()=> {
  categories.value = JSON.parse(localStorage.getItem('categories')) || []
})

function save(){ localStorage.setItem('categories', JSON.stringify(categories.value)) }
function add(){
  if(!name.value.trim()) return
  categories.value.push({ id: Date.now(), name: name.value.trim() })
  save()
  name.value = ''
}
function remove(id){
  if(!confirm('Excluir categoria?')) return
  categories.value = categories.value.filter(x=>x.id!==id)
  save()
}
</script>
