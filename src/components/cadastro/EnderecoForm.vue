<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">2. Endereço</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- CEP -->
        <div class="col-md-4">
          <label class="form-label">CEP <span class="text-danger">*</span></label>
          <input
            v-model="form.cep"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cep') }"
            @blur="validarCampo('cep')"
            placeholder="00000-000"
          >
          <div class="invalid-feedback" v-if="hasError('cep')">
            {{ getError('cep') }}
          </div>
        </div>

        <!-- Logradouro -->
        <div class="col-md-8">
          <label class="form-label">Logradouro <span class="text-danger">*</span></label>
          <input
            v-model="form.logradouro"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('logradouro') }"
            @blur="validarCampo('logradouro')"
            placeholder="Rua, Avenida, etc"
          >
          <div class="invalid-feedback" v-if="hasError('logradouro')">
            {{ getError('logradouro') }}
          </div>
        </div>

        <!-- Número -->
        <div class="col-md-4">
          <label class="form-label">Número <span class="text-danger">*</span></label>
          <input
            v-model="form.numero"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('numero') }"
            @blur="validarCampo('numero')"
            placeholder="123"
          >
          <div class="invalid-feedback" v-if="hasError('numero')">
            {{ getError('numero') }}
          </div>
        </div>

        <!-- Complemento (opcional) -->
        <div class="col-md-8">
          <label class="form-label">Complemento (opcional)</label>
          <input
            v-model="form.complemento"
            type="text"
            class="form-control"
            placeholder="Apto, Sala, etc"
          >
        </div>

        <!-- Cidade -->
        <div class="col-md-6">
          <label class="form-label">Cidade <span class="text-danger">*</span></label>
          <input
            v-model="form.cidade"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cidade') }"
            @blur="validarCampo('cidade')"
            placeholder="São Paulo"
          >
          <div class="invalid-feedback" v-if="hasError('cidade')">
            {{ getError('cidade') }}
          </div>
        </div>

        <!-- Estado -->
        <div class="col-md-6">
          <label class="form-label">Estado <span class="text-danger">*</span></label>
          <select
            v-model="form.estado"
            class="form-select"
            :class="{ 'is-invalid': hasError('estado') }"
            @blur="validarCampo('estado')"
          >
            <option value="">-- Selecione um estado --</option>
            <option v-for="estado in estados" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="hasError('estado')">
            {{ getError('estado') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'EnderecoForm',
  data() {
    return {
      form: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: ''
      },
      validator: null,
      estados: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      cep: ['required'],
      logradouro: ['required'],
      numero: ['required'],
      cidade: ['required'],
      estado: ['required']
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
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>