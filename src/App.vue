<script>
import ListaTarefas from './components/ListaTarefas.vue'

export default {
  name: 'App',
  components: {
    ListaTarefas
  }
}
</script>

<template>
  <div id="app">
    <ListaTarefas />
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f6f8;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 40px;
}
</style>
