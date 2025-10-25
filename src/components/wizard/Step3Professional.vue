<template>
  <div>
    <h2>Etapa 3: Dados Profissionais</h2>

    <form @submit.prevent="nextStep">
      <div>
        <label>Profissão:</label>
        <input v-model="form.profissao" type="text" />
        <p class="error" v-if="errors.profissao">{{ errors.profissao }}</p>
      </div>

      <div>
        <label>Empresa:</label>
        <input v-model="form.empresa" type="text" />
        <p class="error" v-if="errors.empresa">{{ errors.empresa }}</p>
      </div>

      <div>
        <label>Salário:</label>
        <input v-model="form.salario" type="number" />
        <p class="error" v-if="errors.salario">{{ errors.salario }}</p>
      </div>

      <div class="buttons">
        <button type="button" @click="$emit('prev')">Anterior</button>
        <button type="submit">Próximo</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { validateStep3 } from "@/utils/wizardValidation";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "next", "prev"]);

const form = reactive({ ...props.modelValue });
const errors = reactive({});

function nextStep() {
  const result = validateStep3(form);
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
}
</style>
