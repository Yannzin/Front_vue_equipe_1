<template>
  <div id="app">
    <header class="nav">
      <nav class="nav-container">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/blog" class="nav-link">Blog</router-link>
        <router-link to="/about" class="nav-link">Sobre</router-link>
        <router-link to="/user" class="nav-link">Usuário</router-link>
        <router-link to="/admin" class="nav-link">Admin</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Barra de navegação */
.nav {
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
}

.nav-container {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 10px 0;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #42b983;
}

.nav-link.router-link-active {
  color: #42b983;
  font-weight: bold;
}

/* Conteúdo principal */
.main-content {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  min-height: 70vh;
}
</style>
