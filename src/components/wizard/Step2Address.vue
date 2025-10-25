<template>
  <div>
    <h2>Etapa 2: Endereço</h2>

    <form @submit.prevent="nextStep">
      <div>
        <label>CEP:</label>
        <input v-model="form.cep" type="text" />
        <p class="error" v-if="errors.cep">{{ errors.cep }}</p>
      </div>

      <div>
        <label>Rua:</label>
        <input v-model="form.rua" type="text" />
        <p class="error" v-if="errors.rua">{{ errors.rua }}</p>
      </div>

      <div>
        <label>Número:</label>
        <input v-model="form.numero" type="text" />
        <p class="error" v-if="errors.numero">{{ errors.numero }}</p>
      </div>

      <div>
        <label>Cidade:</label>
        <input v-model="form.cidade" type="text" />
        <p class="error" v-if="errors.cidade">{{ errors.cidade }}</p>
      </div>

      <div>
        <label>Estado:</label>
        <input v-model="form.estado" type="text" />
        <p class="error" v-if="errors.estado">{{ errors.estado }}</p>
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
import { validateStep2 } from "@/utils/wizardValidation";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "next", "prev"]);

const form = reactive({ ...props.modelValue });
const errors = reactive({});

function nextStep() {
  const result = validateStep2(form);
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
.buttons {
  margin-top: 10px;
}
</style>
