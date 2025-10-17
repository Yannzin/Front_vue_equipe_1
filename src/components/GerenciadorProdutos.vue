<template>
  <div class="gerenciador-produtos container mt-4">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0">Gerenciador de Produtos</h3>
        <button @click="abrirModalNovo" class="btn btn-success">
          <i class="fas fa-plus"></i> Novo Produto
        </button>
      </div>

      <div class="card-body">
        <div v-if="carregando && produtos.length === 0" class="text-center p-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Carregando produtos...</p>
        </div>

        <div v-else-if="erro" class="alert alert-danger">{{ erro }}</div>

        <div v-else>
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th style="width:150px">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in produtos" :key="produto.id">
                <td>{{ produto.id }}</td>
                <td>{{ produto.title }}</td>
                <td>{{ produto.body.substring(0, 50) }}...</td>
                <td>
                  <button @click="editarProduto(produto)" class="btn btn-sm btn-primary me-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deletarProduto(produto.id)" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal" @click.self="mostrarModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ modoEdicao ? 'Editar' : 'Novo' }} Produto</h5>
            <button class="btn-close" @click="mostrarModal = false"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="modoEdicao ? salvarEdicao() : criarProduto()">
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input v-model="produtoAtual.title" type="text" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Descrição</label>
                <textarea v-model="produtoAtual.body" class="form-control" rows="4" required></textarea>
              </div>

              <div class="d-flex gap-2 justify-content-end">
                <button type="button" class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
                <button type="submit" class="btn btn-success" :disabled="carregando">
                  {{ carregando ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProdutosService from '../services/ProdutosService'

export default {
  name: 'GerenciadorProdutos',
  data() {
    return {
      carregando: false,
      erro: null,
      produtos: [],
      modoEdicao: false,
      produtoAtual: {
        id: null,
        title: '',
        body: '',
        userId: 1
      },
      mostrarModal: false
    }
  },
  methods: {
    async listarProdutos() {
      this.carregando = true
      const resposta = await ProdutosService.listar()
      if (resposta.sucesso) this.produtos = resposta.dados
      else this.erro = resposta.mensagem
      this.carregando = false
    },
    async criarProduto() {
      if (!this.produtoAtual.title || !this.produtoAtual.body) {
        alert('Preencha todos os campos!')
        return
      }
      this.carregando = true
      const resposta = await ProdutosService.criar(this.produtoAtual)
      if (resposta.sucesso) {
        this.produtos.unshift(resposta.dados)
        this.limparFormulario()
        this.mostrarModal = false
        alert('Produto criado com sucesso!')
      } else alert(`Erro: ${resposta.mensagem}`)
      this.carregando = false
    },
    editarProduto(produto) {
      this.produtoAtual = { ...produto }
      this.modoEdicao = true
      this.mostrarModal = true
    },
    async salvarEdicao() {
      this.carregando = true
      const resposta = await ProdutosService.atualizar(this.produtoAtual.id, this.produtoAtual)
      if (resposta.sucesso) {
        const index = this.produtos.findIndex(p => p.id === this.produtoAtual.id)
        if (index !== -1) this.produtos[index] = resposta.dados
        this.limparFormulario()
        this.mostrarModal = false
        alert('Produto atualizado!')
      }
      this.carregando = false
    },
    async deletarProduto(id) {
      if (!confirm('Tem certeza que deseja deletar este produto?')) return
      this.carregando = true
      const resposta = await ProdutosService.deletar(id)
      if (resposta.sucesso) {
        this.produtos = this.produtos.filter(p => p.id !== id)
        alert('Produto deletado!')
      } else alert(`Erro: ${resposta.mensagem}`)
      this.carregando = false
    },
    limparFormulario() {
      this.produtoAtual = { id: null, title: '', body: '', userId: 1 }
      this.modoEdicao = false
    },
    abrirModalNovo() {
      this.limparFormulario()
      this.mostrarModal = true
    }
  },
  mounted() {
    this.listarProdutos()
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-dialog {
  background: white;
  border-radius: 8px;
  width: 90%; max-width: 500px;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}
.modal-body { padding: 1rem; }
.btn { margin-right: 0.5rem; }
</style>
