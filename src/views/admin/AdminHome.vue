<template>
  <div class="admin-layout">


    <!-- CONTEÚDO PRINCIPAL -->
    <div class="main-content">
      <header class="header">
        <h1>Bem-vindo ao Painel Administrativo</h1>
        <button @click="logout" class="logout">Sair</button>
      </header>

      <section class="dashboard">
        <div class="card">
          <h3>Total de Posts</h3>
          <p>{{ totalPosts }}</p>
        </div>
        <div class="card">
          <h3>Último Acesso</h3>
          <p>{{ lastLogin }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminHome',
  data() {
    return {
      totalPosts: 12, // exemplo estático
      lastLogin: new Date().toLocaleString(),
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('isAdmin')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
  color: #333;
}

/* Sidebar */
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

/* Conteúdo principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.logout:hover {
  background: #c0392b;
}

/* Dashboard */
.dashboard {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.card {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.card h3 {
  margin-bottom: 10px;
}
</style>
