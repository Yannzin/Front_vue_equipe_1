<template>
  <form @submit.prevent="handleSubmit" class="post-form">
    <div class="form-group">
      <label for="title">Título</label>
      <input 
        id="title"
        v-model="form.title"
        type="text"
        required
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="content">Conteúdo</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="5"
        required
        class="form-control"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="category">Categoria</label>
      <select 
        id="category"
        v-model="form.category"
        required
        class="form-control"
      >
        <option value="">Selecione uma categoria</option>
        <option value="tech">Tecnologia</option>
        <option value="life">Lifestyle</option>
        <option value="code">Programação</option>
      </select>
    </div>

    <div class="form-group">
      <label for="publishDate">Data de Publicação</label>
      <input
        id="publishDate"
        v-model="form.publishDate"
        type="date"
        required
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="status">Status</label>
      <select 
        id="status"
        v-model="form.status"
        required
        class="form-control"
      >
        <option value="draft">Rascunho</option>
        <option value="published">Publicado</option>
      </select>
    </div>

    <div class="form-actions">
      <button type="button" @click="$router.back()" class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        Salvar Post
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostForm',
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '',
        publishDate: '',
        status: 'draft'
      }
    }
  },
  methods: {
    handleSubmit() {
      // Aqui você implementaria a lógica para salvar o post
      console.log('Dados do formulário:', this.form)
      
      // Simular salvamento
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      posts.push({
        id: Date.now(),
        ...this.form
      })
      localStorage.setItem('posts', JSON.stringify(posts))
      
      // Redirecionar para lista de posts
      this.$router.push('/admin/posts')
    }
  }
}
</script>

<style scoped>
.post-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-secondary {
  background: #666;
  color: white;
}
</style>