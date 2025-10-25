<template>
  <div id="app">
    <!-- Conteúdo principal -->
    <div class="container">
      <!-- Botões de navegação -->
      <div class="mb-4 mt-4 d-flex flex-wrap gap-2">
        <button 
          class="btn btn-outline-primary"
          @click="visualizacao = 'formulario'"
          :class="{ active: visualizacao === 'formulario' }"
        >
          Formulário Original
        </button>

        <button 
          class="btn btn-outline-primary"
          @click="visualizacao = 'cadastro'"
          :class="{ active: visualizacao === 'cadastro' }"
        >
          Cadastro Multi-Componente
        </button>

        <button 
          class="btn btn-outline-primary"
          @click="visualizacao = 'busca'"
          :class="{ active: visualizacao === 'busca' }"
        >
          Pesquisa de Produtos
        </button>
      </div>

      <!-- Alternar entre visualizações -->
      <div v-show="visualizacao === 'formulario'">
        <div class="row">
          <div class="col-md-9">
            <FormularioCompleto />
          </div>
        </div>
      </div>

      <div v-show="visualizacao === 'cadastro'">
        <CadastroView />
      </div>

      <div v-show="visualizacao === 'busca'">
        <PesquisaView />
      </div>
    </div>
  </div>
</template>

<script>
import FormularioCompleto from './components/FormularioCompleto.vue'
import CadastroView from './views/CadastroView.vue'
import PesquisaView from './views/PesquisaView.vue'

export default {
  name: 'App',
  components: {
    FormularioCompleto,
    CadastroView,
    PesquisaView
  },
  data() {
    return {
      visualizacao: 'formulario'
    }
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

button.active {
  background-color: #667eea !important;
  color: white !important;
  border-color: #667eea !important;
}
</style>
