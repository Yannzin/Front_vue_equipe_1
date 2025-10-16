<template>
  <div class="lista-posts">
    <div class="card">
      <div class="card-header">
        <h2>Lista de Posts</h2>
        <p class="subtitle">Posts carregados da API JSONPlaceholder</p>
      </div>

      <div class="card-body">
        <!-- Filtro -->
        <input
          v-model="filtro"
          type="text"
          class="input"
          placeholder="Filtrar por título..."
        />

        <!-- Botão de recarregar -->
        <button
          @click="carregarPosts"
          class="btn btn-primary"
          :disabled="carregando"
        >
          {{ carregando ? 'Carregando...' : 'Recarregar Posts' }}
        </button>

        <!-- Estado: Erro -->
        <div v-if="erro" class="alert alert-danger">
          <h4>Erro ao carregar posts</h4>
          <p>{{ erro }}</p>
        </div>

        <!-- Lista de posts -->
        <div v-if="!carregando && !erro" class="posts">
          <div
            v-for="post in postsFiltrados"
            :key="post.id"
            class="post-card"
          >
            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>
          </div>
        </div>

        <!-- Estado: Loading -->
        <div v-if="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando posts...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ListaPosts',

  data() {
    return {
      posts: [],
      filtro: '',
      carregando: false,
      erro: null
    }
  },

  computed: {
    postsFiltrados() {
      return this.posts.filter(post =>
        post.title.toLowerCase().includes(this.filtro.toLowerCase())
      )
    }
  },

  mounted() {
    this.carregarPosts()
  },

  methods: {
    async carregarPosts() {
      this.carregando = true
      this.erro = null
      this.posts = []

      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
        this.posts = res.data
      } catch (err) {
        console.error('Erro ao buscar posts:', err)
        this.erro = 'Não foi possível carregar os posts.'
      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style scoped>
.lista-posts {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  padding: 2rem;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.card-body {
  padding: 2rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.post-card {
  background: #f2f2f2;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.post-card h3 {
  margin-top: 0;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #eee;
  border-top: 4px solid #764ba2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
