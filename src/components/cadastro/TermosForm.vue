<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">4. Termos e Condições</h5>
    </div>
    
    <div class="card-body">
      <!-- Texto dos termos -->
      <div class="mb-3 p-3 bg-light" style="height: 150px; overflow-y: auto;">
        <h6>Termos de Uso e Condições</h6>
        <p class="small mb-1">
          Ao criar uma conta, você concorda com nossos termos de serviço e política de privacidade.
        </p>
        <p class="small mb-1">
          Você é responsável por manter confidencial sua senha e por toda atividade que ocorrer 
          em sua conta.
        </p>
        <p class="small mb-1">
          Você concorda em não transmitir qualquer conteúdo ilegal ou ofensivo através de nossa 
          plataforma.
        </p>
        <p class="small mb-1">
          Reservamo-nos o direito de remover qualquer conta que viole estes termos, a qualquer 
          momento.
        </p>
        <p class="small">
          Para mais detalhes, visite nossa página de política de privacidade.
        </p>
      </div>

      <!-- Checkbox -->
      <div class="form-check">
        <input
          v-model="form.aceitar"
          type="checkbox"
          class="form-check-input"
          :class="{ 'is-invalid': hasError('aceitar') }"
          id="aceitar"
        >
        <label class="form-check-label" for="aceitar">
          Li e aceito os termos e condições <span class="text-danger">*</span>
        </label>
        <div class="invalid-feedback" v-if="hasError('aceitar')">
          {{ getError('aceitar') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'TermosForm',
  data() {
    return {
      form: {
        aceitar: false
      },
      validator: null
    }
  },
  created() {
    this.validator = new FormValidator()
  },
  methods: {
    validarCampo() {
      if (!this.form.aceitar) {
        this.validator.errors.aceitar = 'Você deve aceitar os termos'
        return false
      } else {
        delete this.validator.errors.aceitar
        return true
      }
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      return this.validarCampo()
    },

    obterDados() {
      return { ...this.form }
    },

    limpar() {
      this.form = { aceitar: false }
      this.validator.errors = {}
    }
  }
}
</script>