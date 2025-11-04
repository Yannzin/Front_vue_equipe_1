<template>
  <div class="editar-perfil">
    <div class="card">
      <div class="card-header bg-warning text-dark">
        <h5 class="mb-0">
          <i class="fas fa-user-edit me-2"></i>
          Editar Perfil
        </h5>
      </div>
      
      <div class="card-body">
        <div v-if="mensagem" class="alert" :class="alertClass" role="alert">
          <i class="fas me-2" :class="mensagem.tipo === 'erro' ? 'fa-exclamation-triangle' : 'fa-check-circle'"></i>
          {{ mensagem.texto }}
        </div>

        <form @submit.prevent="salvarAlteracoes">
          <!-- Campo Nome -->
          <div class="mb-3">
            <label for="nome" class="form-label">
              <i class="fas fa-user me-2"></i>
              Nome Completo
            </label>
            <input
              id="nome"
              v-model.trim="form.nome"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': erros.nome }"
              placeholder="Seu nome completo"
              required
              :disabled="salvando"
            >
            <div v-if="erros.nome" class="invalid-feedback">
              {{ erros.nome }}
            </div>
          </div>

          <!-- Campo Email -->
          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="fas fa-envelope me-2"></i>
              Email
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': erros.email }"
              placeholder="seu@email.com"
              required
              :disabled="salvando"
            >
            <div v-if="erros.email" class="invalid-feedback">
              {{ erros.email }}
            </div>
          </div>

          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Nota:</strong> A senha não pode ser alterada por aqui. 
            Use a opção "Esqueci minha senha" se precisar redefini-la.
          </div>

          <!-- Botões de Ação -->
          <div class="d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelar"
              :disabled="salvando"
            >
              <i class="fas fa-times me-2"></i>
              Cancelar
            </button>

            <button
              type="submit"
              class="btn btn-warning text-dark"
              :disabled="!formularioValido || !houveAlteracoes || salvando"
            >
              <span v-if="salvando" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'EditarPerfil',
  emits: ['perfil-atualizado', 'cancelar'],
  data() {
    return {
      form: {
        nome: '',
        email: ''
      },
      dadosOriginais: { // Usado para checar se houve alterações
        nome: '',
        email: ''
      },
      erros: {},
      mensagem: null,
      salvando: false
    }
  },
  computed: {
    // Validação básica para habilitar o botão de salvar
    formularioValido() {
      // Retorna true se nome e email estiverem preenchidos e válidos, e não houver erros abertos
      return this.form.nome &&
             this.form.email &&
             this.isValidEmail(this.form.email) &&
             this.form.nome.length >= 2 &&
             Object.keys(this.erros).length === 0
    },
    
    // Verifica se os dados do formulário são diferentes dos dados originais
    houveAlteracoes() {
      return this.form.nome !== this.dadosOriginais.nome ||
             this.form.email !== this.dadosOriginais.email
    },
    
    alertClass() {
      return {
        'alert-success': this.mensagem?.tipo === 'sucesso',
        'alert-danger': this.mensagem?.tipo === 'erro'
      }
    }
  },
  watch: {
    // Validação reativa ao digitar
    'form.nome'() { this.validarNome() },
    'form.email'() { this.validarEmail() }
  },
  mounted() {
    this.carregarDadosUsuario()
  },
  methods: {
    carregarDadosUsuario() {
      const usuario = AuthService.getCurrentUser()
      if (usuario) {
        this.form.nome = usuario.nome
        this.form.email = usuario.email
        
        // Guardar cópia dos dados originais
        this.dadosOriginais.nome = usuario.nome
        this.dadosOriginais.email = usuario.email
      }
    },
    
    async salvarAlteracoes() {
      // Validação final antes de enviar
      this.validarFormulario()
      
      if (!this.formularioValido) {
        this.mostrarMensagem('erro', 'Corrija os erros no formulário antes de salvar.')
        return
      }
      
      if (!this.houveAlteracoes) {
        this.mostrarMensagem('erro', 'Nenhuma alteração foi feita.')
        return
      }
      
      this.salvando = true
      this.mensagem = null
      
      // Enviar apenas os campos que foram alterados para o backend
      const dadosParaAtualizar = {}
      if (this.form.nome !== this.dadosOriginais.nome) {
        dadosParaAtualizar.nome = this.form.nome
      }
      if (this.form.email !== this.dadosOriginais.email) {
        dadosParaAtualizar.email = this.form.email
      }

      try {
        const resultado = await AuthService.atualizarPerfil(dadosParaAtualizar)
        
        if (resultado.sucesso) {
          this.mostrarMensagem('sucesso', resultado.mensagem)
          
          // Atualizar dados originais para refletir a mudança salva
          this.dadosOriginais.nome = this.form.nome
          this.dadosOriginais.email = this.form.email
          
          // Emitir evento para o componente pai (App.vue)
          this.$emit('perfil-atualizado', resultado.usuario)
        } else {
          this.mostrarMensagem('erro', resultado.mensagem)
          // Se o erro for de email já registrado, mostramos no campo específico
          if (resultado.mensagem.includes('Email ja registrado')) {
            this.erros.email = resultado.mensagem
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao atualizar perfil:', error)
        this.mostrarMensagem('erro', 'Erro inesperado. Tente novamente.')
      } finally {
        this.salvando = false
      }
    },
    
    cancelar() {
      // Restaurar dados originais ao cancelar
      this.form.nome = this.dadosOriginais.nome
      this.form.email = this.dadosOriginais.email
      this.erros = {}
      this.mensagem = null
      
      this.$emit('cancelar')
    },
    
    validarFormulario() {
      this.erros = {}
      this.validarNome()
      this.validarEmail()
    },
    
    validarNome() {
      if (!this.form.nome) {
        this.erros.nome = 'Nome é obrigatório'
      } else if (this.form.nome.length < 2) {
        this.erros.nome = 'Nome deve ter pelo menos 2 caracteres'
      } else {
        delete this.erros.nome
      }
    },
    
    validarEmail() {
      if (!this.form.email) {
        this.erros.email = 'Email é obrigatório'
      } else if (!this.isValidEmail(this.form.email)) {
        this.erros.email = 'Email inválido'
      } else {
        delete this.erros.email
      }
    },
    
    isValidEmail(email) {
      // Regex simples para validação de formato de email
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },
    
    mostrarMensagem(tipo, texto) {
      this.mensagem = { tipo, texto }
      // Limpa a mensagem após 5 segundos
      setTimeout(() => { this.mensagem = null }, 5000)
    }
  }
}
</script>

<style scoped>
.editar-perfil {
  margin-top: 20px;
}
.invalid-feedback {
  display: block;
}
.btn-warning:disabled {
  opacity: 0.65;
}
</style>
