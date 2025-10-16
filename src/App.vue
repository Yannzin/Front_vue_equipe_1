<template>
  <div>
    <ListaPosts />
  </div>
</template>

<script>

import ListaPosts from './components/ListaPosts.vue';

export default {
  name: 'App',
  components: {
    ListaPosts
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

#app {
  width: 100%;
}
</style>