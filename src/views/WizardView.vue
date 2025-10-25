<template>
  <div class="wizard-container card p-4">
    <h2 class="mb-4 text-center">Formulário Multi-Etapas</h2>

    <!-- Indicador de progresso -->
    <StepIndicator :currentStep="currentStep" :totalSteps="4" />

    <!-- Etapas dinâmicas -->
    <component
      :is="currentComponent"
      v-model="formData"
      class="mt-4"
    />

    <!-- Botões de navegação -->
    <div class="d-flex justify-content-between mt-4">
      <button
        class="btn btn-secondary"
        :disabled="currentStep === 1"
        @click="previousStep"
      >
        Anterior
      </button>

      <button
        v-if="currentStep < 4"
        class="btn btn-primary"
        @click="nextStep"
      >
        Próximo
      </button>

      <button
        v-else
        class="btn btn-success"
        @click="submitForm"
      >
        Confirmar
      </button>
    </div>
  </div>
</template>

<script>
import StepIndicator from '../components/wizard/StepIndicator.vue'
import Step1Personal from '../components/wizard/Step1Personal.vue'
import Step2Address from '../components/wizard/Step2Address.vue'
import Step3Professional from '../components/wizard/Step3Professional.vue'
import Step4Review from '../components/wizard/Step4Review.vue'
import { validateStep1, validateStep2, validateStep3 } from '../utils/wizardValidation.js'

export default {
  name: 'WizardView',
  components: {
    StepIndicator,
    Step1Personal,
    Step2Address,
    Step3Professional,
    Step4Review,
    validateStep1,
    validateStep2,
    validateStep3
  },
  data() {
    return {
      currentStep: 1,
      formData: {
        nome: '',
        email: '',
        cpf: '',
        cep: '',
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        profissao: '',
        empresa: '',
        salario: ''
      }
    }
  },
  computed: {
    currentComponent() {
      return [
        'Step1Personal',
        'Step2Address',
        'Step3Professional',
        'Step4Review'
      ][this.currentStep - 1]
    }
  },
  methods: {
    async nextStep() {
      const isValid = await validateStep(this.currentStep, this.formData)
      if (isValid) {
        this.currentStep++
      } else {
        alert('Por favor, preencha os campos corretamente antes de avançar.')
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    submitForm() {
      alert('Formulário enviado com sucesso!')
      console.log('Dados finais:', this.formData)
    }
  }
}
</script>

<style scoped>
.wizard-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

button {
  min-width: 120px;
}
</style>
