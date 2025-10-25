<template>
  <div class="sobre-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="bi bi-info-circle display-3 text-primary"></i>
                <h1 class="mt-3">Sobre o Sistema</h1>
              </div>
              
              <div class="content">
                <h4>Sistema de Gerenciamento de Produtos</h4>
                <p class="text-muted">Projeto Final - Curso Vue.js</p>
                
                <hr class="my-4">
                
                <h5>Tecnologias Utilizadas</h5>
                <ul>
                  <li><strong>Frontend:</strong> Vue.js 3, Vue Router, Pinia, Bootstrap 5</li>
                  <li><strong>Backend:</strong> Flask, SQLAlchemy, JWT</li>
                  <li><strong>Banco de Dados:</strong> SQLite</li>
                </ul>
                
                <h5 class="mt-4">Funcionalidades</h5>
                <ul>
                  <li>Autenticacao de usuarios com JWT</li>
                  <li>CRUD completo de produtos</li>
                  <li>Dashboard com estatisticas</li>
                  <li>Filtros e busca de produtos</li>
                  <li>Tema claro e escuro</li>
                  <li>Interface responsiva</li>
                </ul>
                
                <h5 class="mt-4">Desenvolvido por</h5>
                <p class="text-muted">Prof. Rodrigo - Curso Frontend Vue.js</p>
                
                <div class="text-center mt-4">
                  <router-link to="/" class="btn btn-primary">
                    <i class="bi bi-house me-2"></i>
                    Voltar ao Inicio
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sobre-page {
  padding: var(--spacing-xxl) 0;
}

.content h5 {
  color: var(--color-primary);
  margin-top: var(--spacing-lg);
}

.content ul {
  line-height: 2;
}
</style>
