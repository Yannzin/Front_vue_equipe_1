<template>
  <div class="p-6 text-center">
    <h1>Bem-vindo ao Blog!</h1>

    <!-- Botão (Entrar como administrador) -->
    <button @click="loginAsAdmin" class="bg-blue-600 text-white px-4 py-2 rounded mt-4">
      Entrar como Admin
    </button>
  </div>
</template>


<!-- (Função do botão) para entrar como administrador -->
<script setup>
function loginAsAdmin() {
  localStorage.setItem('isAdmin', true)
  alert('Login de administrador ativado!')
}
</script>
