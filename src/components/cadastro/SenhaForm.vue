<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">3. Senha</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- Senha -->
        <div class="col-12">
          <label class="form-label">Senha <span class="text-danger">*</span></label>
          <div class="input-group">
            <input
              :type="mostrarSenha ? 'text' : 'password'"
              v-model="form.senha"
              class="form-control"
              :class="{ 'is-invalid': hasError('senha') }"
              @blur="validarCampo('senha')"
              placeholder="Mínimo 8 caracteres"
            >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="mostrarSenha = !mostrarSenha"
            >
              {{ mostrarSenha ? 'Esconder' : 'Mostrar' }}
            </button>
          </div>
          <div class="invalid-feedback" v-if="hasError('senha')">
            {{ getError('senha') }}
          </div>

          <!-- Indicador de força -->
          <div class="mt-2" v-if="form.senha">
            <div class="progress" style="height: 6px;">
              <div
                class="progress-bar"
                :class="classeForca"
                :style="{ width: percentualForca + '%' }"
              ></div>
            </div>
            <small class="text-muted">
              Força: <strong :class="classeForca">{{ nomeForca }}</strong>
            </small>
          </div>
        </div>

        <!-- Confirmar Senha -->
        <div class="col-12">
          <label class="form-label">Confirmar Senha <span class="text-danger">*</span></label>
          <div class="input-group">
            <input
              :type="mostrarConfirma ? 'text' : 'password'"
              v-model="form.confirma"
              class="form-control"
              :class="{ 'is-invalid': hasError('confirma') }"
              @blur="validarCampo('confirma')"
              placeholder="Digite a mesma senha"
            >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="mostrarConfirma = !mostrarConfirma"
            >
              {{ mostrarConfirma ? 'Esconder' : 'Mostrar' }}
            </button>
          </div>
          <div class="invalid-feedback" v-if="hasError('confirma')">
            {{ getError('confirma') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'SenhaForm',
  data() {
    return {
      form: {
        senha: '',
        confirma: ''
      },
      validator: null,
      mostrarSenha: false,
      mostrarConfirma: false
    }
  },
  computed: {
    percentualForca() {
      const senha = this.form.senha
      if (!senha) return 0
      
      let pontos = 0
      if (senha.length >= 8) pontos += 30
      if (senha.length >= 12) pontos += 10
      if (/[A-Z]/.test(senha)) pontos += 20
      if (/[0-9]/.test(senha)) pontos += 20
      if (/[!@#$%^&*]/.test(senha)) pontos += 20
      
      return Math.min(pontos, 100)
    },

    nomeForca() {
      const p = this.percentualForca
      if (p < 40) return 'Fraca'
      if (p < 70) return 'Média'
      return 'Forte'
    },

    classeForca() {
      const p = this.percentualForca
      if (p < 40) return 'bg-danger'
      if (p < 70) return 'bg-warning'
      return 'bg-success'
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      senha: ['required', 'min:8'],
      confirma: ['required']
    })
  },
  methods: {
    validarCampo(fieldName) {
      if (fieldName === 'confirma') {
        if (this.form.senha !== this.form.confirma) {
          this.validator.errors.confirma = 'As senhas não conferem'
          return false
        } else {
          delete this.validator.errors.confirma
          return true
        }
      }
      
      this.validator.validateField(fieldName, this.form[fieldName])
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      const senhaOk = this.validator.validate(this.form)
      const confirmaOk = this.validarCampo('confirma')
      return senhaOk && confirmaOk
    },

    obterDados() {
      return {
        senha: this.form.senha
      }
    },

    limpar() {
      this.form = {
        senha: '',
        confirma: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>