<template>
  <div class="dashboard">
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">
          <i class="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h5>
      </div>
      
      <div class="card-body">
        <div v-if="!usuario" class="text-center text-muted">
          <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
          <div>Carregando...</div>
        </div>

        <div v-else>
          <!-- Informações básicas -->
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="text-muted mb-3">
                <i class="fas fa-user me-2"></i>
                Informações Pessoais
              </h6>
              
              <div class="mb-2">
                <strong>Nome:</strong> {{ usuario.nome }}
              </div>
              <div class="mb-2">
                <strong>Email:</strong> {{ usuario.email }}
              </div>
              <div class="mb-2">
                <strong>Membro desde:</strong> {{ formatarData(usuario.data_criacao) }}
              </div>
            </div>

            <div class="col-md-6">
              <h6 class="text-muted mb-3">
                <i class="fas fa-clock me-2"></i>
                Sessão Atual
              </h6>
                
              <div class="mb-2">
                <strong>Tempo de sessão:</strong> {{ tempoSessao }}
              </div>
              <div class="mb-2">
                <strong>Status:</strong> 
                <span class="badge bg-success">Ativo</span>
              </div>
            </div>
          </div>

          <!-- Estatísticas -->
          <div class="row">
            <div class="col-md-4 mb-3">
              <div class="card bg-primary text-white">
                <div class="card-body text-center">
                  <i class="fas fa-sign-in-alt fa-2x mb-2"></i>
                  <h3 class="mb-0">{{ totalLogins }}</h3>
                  <small>Total de Logins</small>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-3">
              <div class="card bg-success text-white">
                <div class="card-body text-center">
                  <i class="fas fa-calendar-check fa-2x mb-2"></i>
                  <h3 class="mb-0">{{ diasDesdeRegistro }}</h3>
                  <small>Dias Cadastrado</small>
                </div>
              </div>
            </div>

            <div class="col-md-4 mb-3">
              <div class="card bg-info text-white">
                <div class="card-body text-center">
                  <i class="fas fa-shield-alt fa-2x mb-2"></i>
                  <h3 class="mb-0">{{ tokenValido ? 'Válido' : 'Inválido' }}</h3>
                  <small>Status do Token</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'Dashboard',
  data() {
    return {
      usuario: null,
      tempoSessao: '0s',
      inicioSessao: null,
      intervaloTempo: null, 
    }
  },
  computed: {
    totalLogins() {
      const count = localStorage.getItem('total_logins')
      return count ? parseInt(count) : 1
    },
    
    diasDesdeRegistro() {
      if (!this.usuario || !this.usuario.data_criacao) return 0
      
      const dataCriacao = new Date(this.usuario.data_criacao)
      const agora = new Date()
      const diff = agora - dataCriacao
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      return dias
    },
    
    tokenValido() {
      return AuthService.isAuthenticated()
    }
  },
  mounted() {
    this.usuario = AuthService.getCurrentUser()
    this.inicioSessao = Date.now()
    this.intervaloTempo = setInterval(() => {
      this.atualizarTempoSessao()
    }, 1000)
  },
  beforeUnmount() {
    if (this.intervaloTempo) {
      clearInterval(this.intervaloTempo)
    }
  },
  methods: {    
    atualizarTempoSessao() {
      const agora = Date.now()
      const diff = Math.floor((agora - this.inicioSessao) / 1000) 
      
      const horas = Math.floor(diff / 3600)
      const minutos = Math.floor((diff % 3600) / 60)
      const segundos = diff % 60
      if (horas > 0) {
        this.tempoSessao = `${horas}h ${minutos}m ${segundos}s`
      } else if (minutos > 0) {
        this.tempoSessao = `${minutos}m ${segundos}s`
      } else {
        this.tempoSessao = `${segundos}s`
      }
    },

    formatarData(dataISO) {
      if (!dataISO) return 'N/A'
      
      const data = new Date(dataISO)
      const opcoes = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }
      
      return data.toLocaleDateString('pt-BR', opcoes)
    }
  }
}
</script>

<style scoped>
.dashboard {
  margin-top: 20px;
  margin-bottom: 20px; 
}
</style>
