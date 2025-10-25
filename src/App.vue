<template>
  <div id="app">
    <!-- Cabeçalho com botões -->
    <div class="container mt-4">
      <div class="mb-4 d-flex flex-wrap gap-2">
        <RouterLink 
          to="/formulario"
          class="btn btn-outline-primary"
          active-class="active"
        >
          Formulário Original
        </RouterLink>

        <RouterLink 
          to="/cadastro"
          class="btn btn-outline-primary"
          active-class="active"
        >
          Cadastro Multi-Componente
        </RouterLink>

        <RouterLink 
          to="/busca"
          class="btn btn-outline-primary"
          active-class="active"
        >
          Pesquisa de Produtos
        </RouterLink>

        <RouterLink 
          to="/wizard"
          class="btn btn-outline-primary"
          active-class="active"
        >
          Formulário Multi-Etapas
        </RouterLink>
      </div>

      <!-- Área principal de exibição das rotas -->
      <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafc;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
  margin-bottom: 1.5rem;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

button.active,
a.active {
  background-color: #667eea !important;
  color: white !important;
  border-color: #667eea !important;
}
</style>
