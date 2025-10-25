<template>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Cadastro Completo</h3>
            <p class="mb-0 opacity-75">Preencha todos os campos para criar sua conta</p>
          </div>

          <div class="card-body">
            <!-- Barra de progresso -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span><strong>Progresso</strong></span>
                <span>{{ progresso }}%</span>
              </div>
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{ width: progresso + '%' }"
                ></div>
              </div>
            </div>

            <!-- Formulário -->
            <form @submit.prevent="enviarFormulario">
              <!-- Componente 1: Dados Pessoais -->
              <DadosPessoaisForm ref="dadosPessoais" />

              <!-- Componente 2: Endereço -->
              <EnderecoForm ref="endereco" />

              <!-- Componente 3: Senha -->
              <SenhaForm ref="senha" />

              <!-- Componente 4: Termos -->
              <TermosForm ref="termos" />

              <!-- Mensagem de erro (se houver) -->
              <div v-if="erroGeral" class="alert alert-danger mb-4">
                {{ erroGeral }}
              </div>

              <!-- Botões -->
              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="limparFormulario"
                >
                  Limpar
                </button>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="processando"
                >
                  <span v-if="processando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ processando ? 'Cadastrando...' : 'Cadastrar' }}
                </button>
              </div>
            </form>

            <!-- Sucesso -->
            <div v-if="sucesso" class="alert alert-success mt-4">
              Cadastro realizado com sucesso!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DadosPessoaisForm from '@/components/cadastro/DadosPessoaisForm.vue'
import EnderecoForm from '@/components/cadastro/EnderecoForm.vue'
import SenhaForm from '@/components/cadastro/SenhaForm.vue'
import TermosForm from '@/components/cadastro/TermosForm.vue'

export default {
  name: 'CadastroView',
  components: {
    DadosPessoaisForm,
    EnderecoForm,
    SenhaForm,
    TermosForm
  },
  data() {
    return {
      processando: false,
      erroGeral: null,
      sucesso: false
    }
  },
  computed: {
    progresso() {
      let total = 0
      let preenchidos = 0

      // Verifica dados pessoais
      const dp = this.$refs.dadosPessoais?.form || {}
      if (dp.nome) preenchidos++
      if (dp.email) preenchidos++
      if (dp.cpf) preenchidos++
      if (dp.telefone) preenchidos++
      total += 4

      // Verifica endereço
      const end = this.$refs.endereco?.form || {}
      if (end.cep) preenchidos++
      if (end.logradouro) preenchidos++
      if (end.numero) preenchidos++
      if (end.cidade) preenchidos++
      if (end.estado) preenchidos++
      total += 5

      // Verifica senha
      const sen = this.$refs.senha?.form || {}
      if (sen.senha) preenchidos++
      if (sen.confirma) preenchidos++
      total += 2

      // Verifica termos
      const ter = this.$refs.termos?.form || {}
      if (ter.aceitar) preenchidos++
      total += 1

      return total > 0 ? Math.round((preenchidos / total) * 100) : 0
    }
  },
  methods: {
    enviarFormulario() {
      this.erroGeral = null
      this.sucesso = false

      // Valida cada componente
      const dadosPessoaisOk = this.$refs.dadosPessoais.validarTudo()
      const enderecoOk = this.$refs.endereco.validarTudo()
      const senhaOk = this.$refs.senha.validarTudo()
      const termosOk = this.$refs.termos.validarTudo()

      if (!dadosPessoaisOk) {
        this.erroGeral = 'Preencha corretamente os dados pessoais'
        return
      }
      if (!enderecoOk) {
        this.erroGeral = 'Preencha corretamente o endereço'
        return
      }
      if (!senhaOk) {
        this.erroGeral = 'Senha inválida ou não confere'
        return
      }
      if (!termosOk) {
        this.erroGeral = 'Você deve aceitar os termos'
        return
      }

      // Coleta dados de todos os componentes
      const dados = {
        ...this.$refs.dadosPessoais.obterDados(),
        ...this.$refs.endereco.obterDados(),
        ...this.$refs.senha.obterDados(),
        ...this.$refs.termos.obterDados()
      }

      // Simula envio ao servidor
      this.processando = true
      setTimeout(() => {
        console.log('Dados do cadastro:', dados)
        this.sucesso = true
        this.processando = false

        // Limpa formulário após 2 segundos
        setTimeout(() => {
          this.limparFormulario()
          this.sucesso = false
        }, 2000)
      }, 1500)
    },

    limparFormulario() {
      this.$refs.dadosPessoais.limpar()
      this.$refs.endereco.limpar()
      this.$refs.senha.limpar()
      this.$refs.termos.limpar()
      this.erroGeral = null
      this.sucesso = false
    }
  }
}
</script>

<style scoped>
.shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>