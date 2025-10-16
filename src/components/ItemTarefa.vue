<template>
  <li :class="{ concluida: tarefa.concluida }" class="tarefa">
    <input
      type="checkbox"
      :checked="tarefa.concluida"
      @change="$emit('toggle', { id: tarefa.id, concluida: $event.target.checked })"
    />

    <span v-if="!tarefa.editando" @dblclick="editarTarefa">{{ tarefa.titulo }}</span>

    <input
      v-else
      v-model="novoTitulo"
      @keyup.enter="salvarEdicao"
      @blur="salvarEdicao"
      autofocus
    />

    <button class="remover" @click="$emit('remover', tarefa.id)">✕</button>
  </li>
</template>

<script>
export default {
  props: { tarefa: Object },
  data() {
    return { novoTitulo: this.tarefa.titulo }
  },
  methods: {
    editarTarefa() {
      this.tarefa.editando = true
      this.novoTitulo = this.tarefa.titulo
    },
    salvarEdicao() {
      if (this.novoTitulo.trim() !== '') {
        this.$emit('editar', { id: this.tarefa.id, titulo: this.novoTitulo })
      }
      this.tarefa.editando = false
    }
  }
}
</script>

<style scoped>
.tarefa {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-bottom: 1px solid #eee;
}

.tarefa span {
  flex: 1;
  text-align: left;
  cursor: pointer;
}

.tarefa input[type="text"] {
  flex: 1;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.concluida span {
  text-decoration: line-through;
  color: #888;
}

.remover {
  border: none;
  background: none;
  cursor: pointer;
  color: #888;
  font-size: 16px;
}

.remover:hover {
  color: #e63946;
}
</style>
