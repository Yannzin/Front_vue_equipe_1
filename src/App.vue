<script>
export default {
  data() {
    return {
      novaTarefa: '',
      tarefas: []
    }
  },
  methods: {
    adicionarTarefa() {
      if (this.novaTarefa.trim() !== '') {
        this.tarefas.push(this.novaTarefa)
        this.novaTarefa = ''
      }
    }
  }
}
</script>

<template>
  <div>
    <h1>Lista de Tarefas</h1>
    <input v-model="novaTarefa" placeholder="Nova tarefa" />
    <button @click="adicionarTarefa">Adicionar</button>

    <p>Total de tarefas: {{ tarefas.length }}</p>

    <ul>
      <li v-for="(tarefa, index) in tarefas" :key="index">
        {{ tarefa }}
      </li>
    </ul>
  </div>
</template>
