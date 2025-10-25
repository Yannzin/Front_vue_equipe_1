<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">1. Dados Pessoais</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- Nome -->
        <div class="col-md-6">
          <label class="form-label">Nome <span class="text-danger">*</span></label>
          <input
            v-model="form.nome"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('nome') }"
            @blur="validarCampo('nome')"
            placeholder="Seu nome completo"
          >
          <div class="invalid-feedback" v-if="hasError('nome')">
            {{ getError('nome') }}
          </div>
        </div>

        <!-- Email -->
        <div class="col-md-6">
          <label class="form-label">Email <span class="text-danger">*</span></label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': hasError('email') }"
            @blur="validarCampo('email')"
            placeholder="seu@email.com"
          >
          <div class="invalid-feedback" v-if="hasError('email')">
            {{ getError('email') }}
          </div>
        </div>

        <!-- CPF -->
        <div class="col-md-6">
          <label class="form-label">CPF <span class="text-danger">*</span></label>
          <input
            v-model="form.cpf"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cpf') }"
            @blur="validarCampo('cpf')"
            placeholder="000.000.000-00"
          >
          <div class="invalid-feedback" v-if="hasError('cpf')">
            {{ getError('cpf') }}
          </div>
        </div>

        <!-- Telefone -->
        <div class="col-md-6">
          <label class="form-label">Telefone <span class="text-danger">*</span></label>
          <input
            v-model="form.telefone"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('telefone') }"
            @blur="validarCampo('telefone')"
            placeholder="(00) 00000-0000"
          >
          <div class="invalid-feedback" v-if="hasError('telefone')">
            {{ getError('telefone') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'DadosPessoaisForm',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        cpf: '',
        telefone: ''
      },
      validator: null
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      nome: ['required', 'min:3'],
      email: ['required', 'email'],
      cpf: ['required', 'cpf'],
      telefone: ['required', 'min:8']
    })
  },
  methods: {
    validarCampo(fieldName) {
      this.validator.validateField(fieldName, this.form[fieldName])
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      return this.validator.validate(this.form)
    },

    obterDados() {
      return { ...this.form }
    },

    limpar() {
      this.form = {
        nome: '',
        email: '',
        cpf: '',
        telefone: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>