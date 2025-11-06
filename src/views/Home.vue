<template>
  <div class="home-page">
    
    <video autoplay muted :src="currentVideo" @ended="playNextVideo" id="background-video"></video>

    <div class="video-overlay"></div>

    <div class="top-button-bar" style="background-color: #000000 !important;">
      <div class="container d-flex justify-content-between align-items-center py-4"> 
        
        <div class="header-titles d-flex flex-column justify-content-center" style="width: 30%;"> 
          <h5 class="mb-0 text-white"> 
            Drive Imports
          </h5>
          <h6 class="subtitle mb-0 text-white-50"> 
            ONDE O LUXO ENCONTRA A PERFORMANCE
          </h6>
        </div>

        <img :src="logoCoroaImage" alt="Logo Drive Imports" class="header-logo mx-auto"> 

        <div class="d-flex justify-content-end align-items-center" style="width: 30%;">
            
            <div v-if="!authStore.isAutenticado" class="d-flex gap-3">
              <router-link to="/login" class="enter-icon-btn">
                <i class="bi bi-box-arrow-in-right display-6 text-white"></i>
              </router-link>
            </div>
            
            <div v-else class="d-flex gap-3">
              <router-link to="/dashboard" class="btn btn-primary">
                <i class="bi bi-speedometer2 me-2"></i>
                Ir para Dashboard
              </router-link>
            </div>
        </div>
        </div>
    </div>
    <div class="content-wrapper">
      <div class="container text-center">
        </div>
    </div>

    <div class="contact-bar" style="background-color: #000000 !important;">
      <div class="container py-4">
        <div class="row g-3 justify-content-center">
          
          <div class="col-lg-3 col-md-6 col-sm-12">
            <a href="https://wa.me/5548988662438" target="_blank" class="contact-block-link">
              <div class="contact-block text-center p-3">
                <i class="bi bi-whatsapp display-4 mb-2 text-white"></i>
                <h6 class="text-white">WHATSAPP</h6>
                <p class="text-white-50">(48) 9 8866-2438</p>
              </div>
            </a>
          </div>

          <div class="col-lg-3 col-md-6 col-sm-12">
            <a href="tel:+5548988662438" class="contact-block-link">
              <div class="contact-block text-center p-3">
                <i class="bi bi-phone display-4 mb-2 text-white"></i>
                <h6 class="text-white">TELEFONE</h6>
                <p class="text-white-50">(48) 9 8866-2438</p>
              </div>
            </a>
          </div>

          <div class="col-lg-3 col-md-6 col-sm-12">
            <a href="https://instagram.com/htimimportscars" target="_blank" class="contact-block-link">
              <div class="contact-block text-center p-3">
                <i class="bi bi-instagram display-4 mb-2 text-white"></i>
                <h6 class="text-white">INSTAGRAM</h6>
                <p class="text-white-50">@htimimportscars</p>
              </div>
            </a>
          </div>

          <div class="col-lg-3 col-md-6 col-sm-12">
            <a href="https://facebook.com/htimimportscars" target="_blank" class="contact-block-link">
              <div class="contact-block text-center p-3">
                <i class="bi bi-facebook display-4 mb-2 text-white"></i>
                <h6 class="text-white">FACEBOOK</h6>
                <p class="text-white-50">@htimimportscars</p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const logoCoroaImage = new URL('@/assets/logo/logo01.png', import.meta.url).href;

const authStore = useAuthStore();

function getAssetUrl(name) {
    return new URL(`/src/assets/videos/${name}.mp4`, import.meta.url).href
}

const videoList = [
    'Video 01', 
    'Video 02',
];

const videoIndex = ref(0);
const currentVideo = ref(getAssetUrl(videoList[0]));

const playNextVideo = () => {
    videoIndex.value = (videoIndex.value + 1) % videoList.length;
    currentVideo.value = getAssetUrl(videoList[videoIndex.value]);
    
    const videoElement = document.getElementById('background-video');
    if (videoElement) {
        videoElement.load();
        videoElement.play();
    }
};
</script>

<style scoped>
/* ESTILOS CSS - MANTIDOS */
.home-page {
    min-height: 100vh;
    background: none !important; 
    position: relative; 
    display: flex;
    align-items: center;
}

#background-video {
    width: 100%;
    height: 100%;
    position: fixed; 
    top: 0;
    left: 0;
    object-fit: cover;
    z-index: -2; 
    transition: opacity 0.5s ease-in-out; 
}

.video-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: -1; 
}

.content-wrapper {
    width: 100%; 
    position: relative;
    z-index: 1; 
    margin-top: 0; 
}

.top-button-bar {
    width: 100%;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 10; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.top-button-bar .header-titles {
    line-height: 1; 
}

/* ESTILOS DO NOVO BOTÃO DE ÍCONE */
.enter-icon-btn {
    text-decoration: none; 
    padding: 0.5rem; 
    transition: transform 0.3s ease, opacity 0.3s ease; 
}

.enter-icon-btn i {
    /* Garante que o ícone tenha um tamanho decente no cabeçalho */
    font-size: 2.5rem !important; 
}

.enter-icon-btn:hover {
    /* Efeito de animação similar aos cards de contato */
    transform: scale(1.1); 
    opacity: 0.8; 
}

/* ESTILOS DE CABEÇALHO (MANTIDOS) */
.header-logo {
    height: 120px; 
    width: auto; 
    vertical-align: middle; 
    margin-right: 1.5rem; 
    transform: translateY(0px); 
}

.top-button-bar h5 { 
    text-shadow: none; 
    margin-bottom: 0; 
    font-size: 2.5rem; 
    font-weight: 700; 
    display: block; 
    text-align: left; 
}

.top-button-bar .subtitle {
    font-size: 1.25rem; 
    text-transform: uppercase;
    margin-top: 5px; 
    text-shadow: none; 
    text-align: left; 
}

.top-button-bar .btn {
    font-size: var(--font-size-md); 
}


/* ESTILOS DO RODAPÉ (MANTIDOS) */
.contact-bar {
    width: 100%;
    position: fixed; 
    bottom: 0; 
    left: 0;
    z-index: 15; 
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3); 
}

.contact-block-link {
    text-decoration: none; 
    color: inherit; 
    display: block; 
    height: 100%;
}

.contact-block {
    background-color: transparent; 
    transition: all 0.3s ease; 
    height: 100%; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem; 
}

.contact-block:hover {
    transform: translateY(-5px); 
    cursor: pointer; 
}
</style>