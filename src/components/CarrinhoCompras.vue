<template>
  <div class="d-flex flex-column h-100">

    <!-- Lista de Itens -->
    <div class="flex-grow-1 overflow-auto p-3">
      <div v-if="itens.length === 0" class="text-center text-muted mt-5">
        <i class="fas fa-box-open fa-3x mb-3"></i>
        <p>Seu carrinho está vazio.</p>
      </div>

      <div v-else>
        <div 
          v-for="item in itens" 
          :key="item.id" 
          class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
        >
          <div>
            <strong>{{ item.nome }}</strong><br>
            <small class="text-muted">R$ {{ item.preco.toFixed(2) }}</small>
          </div>

          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-1" @click="diminuir(item)">-</button>
            <span>{{ item.quantidade }}</span>
            <button class="btn btn-sm btn-outline-secondary ms-1" @click="aumentar(item)">+</button>
          </div>

          <button class="btn btn-sm btn-danger ms-2" @click="$emit('remover-item', item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Resumo e Ações -->
    <div class="p-3 border-top bg-light">
      <div class="mb-3">
        <label class="form-label">Cupom de desconto</label>
        <div class="input-group">
          <input v-model="cupom" type="text" class="form-control" placeholder="EX: DESCONTO10">
          <button class="btn btn-outline-primary" @click="aplicarCupom">Aplicar</button>
        </div>
        <small v-if="mensagemCupom" class="text-success">{{ mensagemCupom }}</small>
      </div>

      <div class="d-flex justify-content-between">
        <strong>Total:</strong>
        <span>R$ {{ totalComDesconto.toFixed(2) }}</span>
      </div>

      <button 
        class="btn btn-success w-100 mt-3" 
        :disabled="itens.length === 0"
        @click="$emit('finalizar-compra')"
      >
        Finalizar Compra
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarrinhoCompras',
  props: {
    itens: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      cupom: '',
      desconto: 0,
      mensagemCupom: ''
    }
  },
  computed: {
    total() {
      return this.itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)
    },
    totalComDesconto() {
      return this.total * (1 - this.desconto)
    }
  },
  methods: {
    aumentar(item) {
      this.$emit('atualizar-quantidade', { id: item.id, quantidade: item.quantidade + 1 })
    },
    diminuir(item) {
      if (item.quantidade > 1) {
        this.$emit('atualizar-quantidade', { id: item.id, quantidade: item.quantidade - 1 })
      }
    },
    aplicarCupom() {
      if (this.cupom.toUpperCase() === 'DESCONTO10') {
        this.desconto = 0.1
        this.mensagemCupom = 'Cupom aplicado com sucesso (10% de desconto)!'
      } else {
        this.desconto = 0
        this.mensagemCupom = 'Cupom inválido.'
      }
    }
  }
}
</script>

<style scoped>
.overflow-auto {
  overflow-y: auto;
}
</style>