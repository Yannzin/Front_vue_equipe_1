<template>
  <div class="login-page">
    
    <video autoplay muted :src="currentVideo" @ended="playNextVideo" id="background-video-login"></video>
    <div class="video-overlay-login"></div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <img :src="logoCoroaImage" alt="Logo Drive Imports" class="login-logo mb-3 mx-auto d-block"> 
                <h2 class="mt-3 text-white">{{ modoRegistro ? 'Criar Conta' : 'Login' }}</h2>
                <p class="text-white-50">
                  {{ modoRegistro ? 'Preencha os dados abaixo' : 'Entre com suas credenciais' }}
                </p>
              </div>
              
              <form @submit.prevent="handleSubmit">
                <div v-if="modoRegistro" class="mb-3">
                  <label class="form-label text-white-50">Nome</label>
                  <input 
                    v-model="form.nome" 
                    type="text" 
                    class="form-control" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label text-white-50">Email</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    class="form-control" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label text-white-50">Senha</label>
                  <input 
                    v-model="form.senha" 
                    type="password" 
                    class="form-control" 
                    required
                    minlength="6"
                  >
                </div>
                
                <button 
                  type="submit" 
                  class="btn custom-btn w-100 mb-3"
                  :disabled="authStore.carregando"
                >
                  <span v-if="authStore.carregando">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Processando...
                  </span>
                  <span v-else>
                    {{ modoRegistro ? 'Cadastrar' : 'Entrar' }}
                  </span>
                </button>
                
                <div class="text-center">
                  <a href="#" @click.prevent="modoRegistro = !modoRegistro" class="auth-toggle-link">
                    {{ modoRegistro ? 'Já tem uma conta? Entrar' : 'Cadastre-se' }}
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const modoRegistro = ref(false)
const form = ref({
  nome: '',
  email: '',
  senha: ''
})

const logoCoroaImage = new URL('@/assets/logo/logo01.png', import.meta.url).href; 

function getAssetUrl(name) {
    return new URL(`/src/assets/videos/${name}.mp4`, import.meta.url).href
}

const videoList = [
    'Video 03', 
    'Video 04',
];

const videoIndex = ref(0);
const currentVideo = ref(getAssetUrl(videoList[0]));

const playNextVideo = () => {
    videoIndex.value = (videoIndex.value + 1) % videoList.length;
    currentVideo.value = getAssetUrl(videoList[videoIndex.value]);
    
    const videoElement = document.getElementById('background-video-login'); 
    if (videoElement) {
        videoElement.load();
        videoElement.play();
    }
};

const handleSubmit = async () => {
  try {
    if (modoRegistro.value) {
      await authStore.cadastrar(form.value.nome, form.value.email, form.value.senha)
    } else {
      await authStore.login(form.value.email, form.value.senha)
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.push('/dashboard')
    
    if (router.currentRoute.value.path === '/login') {
      window.location.href = '/dashboard'
    }
  } catch (error) {
    console.error('Erro no login/cadastro:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center; 
  position: relative; 
  z-index: 1; 
  background: none; 
}

#background-video-login {
    width: 100%;
    height: 100%;
    position: fixed; 
    top: 0;
    left: 0;
    object-fit: cover;
    z-index: -2; 
    transition: opacity 0.5s ease-in-out; 
}

.video-overlay-login {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); 
    z-index: -1; 
}

.card {
  border: none;
  border-radius: var(--border-radius-xl);
  z-index: 2; 
  background-color: rgba(0, 0, 0, 0.8); 
  color: white; 
}

.form-control {
    background-color: rgba(255, 255, 255, 0.1); 
    color: white; 
    border: 1px solid rgba(255, 255, 255, 0.3); 
}

.form-control:focus {
    background-color: rgba(255, 255, 255, 0.2); 
    border-color: var(--color-primary); 
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25); 
}

.custom-btn {
    background-color: var(--color-primary); 
    border: 2px solid var(--color-primary);
    color: white; 
    font-weight: bold;
    letter-spacing: 1px;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease-in-out;
    border-radius: 50px; 
}

.custom-btn:hover {
    background-color: var(--color-info); 
    border-color: var(--color-info);
    transform: translateY(-2px); 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* ESTILO CUSTOMIZADO PARA O LINK DE CADASTRO */
.auth-toggle-link {
    /* Cor inicial sutil */
    color: #cccccc; 
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s ease-in-out;
}

.auth-toggle-link:hover {
    /* Cor de luxo/dourada no hover */
    color: #FFD700; 
}


.login-logo {
  height: 140px; 
  width: auto;
  margin-bottom: 2rem !important; 
}

h2 {
    font-weight: bold; 
}
</style>