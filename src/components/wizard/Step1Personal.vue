<template>
  <div>
    <h2>Etapa 1: Dados Pessoais</h2>

    <form @submit.prevent="nextStep">
      <div>
        <label>Nome:</label>
        <input v-model="form.nome" type="text" />
        <p class="error" v-if="errors.nome">{{ errors.nome }}</p>
      </div>

      <div>
        <label>Email:</label>
        <input v-model="form.email" type="email" />
        <p class="error" v-if="errors.email">{{ errors.email }}</p>
      </div>

      <div>
        <label>CPF:</label>
        <input v-model="form.cpf" type="text" />
        <p class="error" v-if="errors.cpf">{{ errors.cpf }}</p>
      </div>

      <button type="submit">Próximo</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { validateStep1 } from "@/utils/wizardValidation";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "next"]);

const form = reactive({ ...props.modelValue });
const errors = reactive({});

function nextStep() {
  const result = validateStep1(form);
  Object.assign(errors, result);
  if (Object.keys(result).length === 0) {
    emit("update:modelValue", form);
    emit("next");
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
</style>
