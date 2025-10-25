<template>
  <div class="admin-layout">
    <!-- MENU LATERAL -->
    <aside class="sidebar">
      <h2 class="logo">Painel Admin</h2>
      <nav>
        <ul>
          <li><router-link to="/admin" exact>🏠 Dashboard</router-link></li>
          <li><router-link to="/admin/posts">📝 Posts</router-link></li>
          <li><router-link to="/admin/posts/new">➕ Novo Post</router-link></li>
          <li><router-link to="/">⬅ Voltar ao Site</router-link></li>
        </ul>
      </nav>
    </aside>

    <!-- CONTEÚDO PRINCIPAL (dinâmico) -->
    <div class="main-content">
      <router-view /> <!-- As páginas filhas aparecem aqui -->
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
  color: #333;
}

.sidebar {
  width: 240px;
  background: #2c3e50;
  color: #fff;
  padding: 20px;
}

.sidebar .logo {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar a {
  color: #ecf0f1;
  text-decoration: none;
}

.sidebar a.router-link-active {
  font-weight: bold;
  color: #1abc9c;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
