<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      titulo: 'Minha Primeira Aula Vue!',
      contador: 0
    }
  },
  methods: {
    incrementar() {
      this.contador++
    },

    incrementar5() {
      this.contador = this.contador+5
    },

    decrementarum() {
      this.contador = this.contador-1
    },

    decrementarcinco(){
      this.contador = this.contador-5
    }
  }
}

</script>
<template>
  <div class="hello">
    <h1>{{ titulo }}</h1>
    <h2>Contador: {{ contador }}</h2>

    <button @click="incrementar">+1</button>
    <button @click="incrementar5">+5</button>
    <button @click="decrementarum">-1</button>
    <button @click="decrementarcinco">-5</button>

  </div>
</template>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
