<template>
  <div class="container">
    <h1>Lista de Tarefas</h1>

    <div class="nova-tarefa">
      <input
        v-model="novaTarefa"
        @keyup.enter="adicionarTarefa"
        placeholder="Digite uma nova tarefa..."
      />
      <button @click="adicionarTarefa">+</button>
    </div>

    <div class="filtros">
      <label><input type="radio" value="todas" v-model="filtro" /> Todas</label>
      <label><input type="radio" value="pendentes" v-model="filtro" /> Pendentes</label>
      <label><input type="radio" value="concluidas" v-model="filtro" /> Concluídas</label>
    </div>

    <ul>
      <ItemTarefa
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @remover="removerTarefa"
        @editar="editarTarefa"
        @toggle="alternarConclusao"
      />
    </ul>

    <p class="contador">Total: {{ tarefas.length }}</p>
  </div>
</template>

<script>
import ItemTarefa from './ItemTarefa.vue'

export default {
  components: { ItemTarefa },
  data() {
    return {
      novaTarefa: '',
      filtro: 'todas',
      tarefas: []
    }
  },
  computed: {
    tarefasFiltradas() {
      if (this.filtro === 'pendentes') return this.tarefas.filter(t => !t.concluida)
      if (this.filtro === 'concluidas') return this.tarefas.filter(t => t.concluida)
      return this.tarefas
    }
  },
  methods: {
    adicionarTarefa() {
      if (this.novaTarefa.trim() !== '') {
        this.tarefas.push({
          id: Date.now(),
          titulo: this.novaTarefa.trim(),
          concluida: false,
          editando: false
        })
        this.novaTarefa = ''
      }
    },
    removerTarefa(id) {
      this.tarefas = this.tarefas.filter(t => t.id !== id)
    },
    editarTarefa({ id, titulo }) {
      const tarefa = this.tarefas.find(t => t.id === id)
      if (tarefa) tarefa.titulo = titulo
    },
    alternarConclusao({ id, concluida }) {
      const tarefa = this.tarefas.find(t => t.id === id)
      if (tarefa) tarefa.concluida = concluida
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 450px;
  margin: 40px auto;
  text-align: center;
  font-family: system-ui, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.nova-tarefa {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.nova-tarefa input {
  flex: 1;
  padding: 8px;
  border: 1px solid #bbb;
  border-radius: 5px;
}

.nova-tarefa button {
  padding: 0 12px;
  font-size: 18px;
  border: none;
  background: #3a86ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.nova-tarefa button:hover {
  background: #2c6cd6;
}

.filtros {
  margin-bottom: 15px;
  font-size: 14px;
  color: #444;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contador {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}
</style>
