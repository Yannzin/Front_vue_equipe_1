<template>
  <div class="dashboard-page">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i class="bi bi-speedometer2 me-2"></i>
          Painel de Carros
        </h1>
        <button class="btn btn-primary" @click="recarregar">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Atualizar
        </button>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card card border-primary">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Total de Carros</p>
                  <h3 class="mb-0">{{ dashboardStore.totalCarros }}</h3>
                </div>
                <i class="bi bi-car-front display-4 text-primary"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-success">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Carros Disponíveis</p>
                  <h3 class="mb-0">{{ dashboardStore.carrosDisponiveis }}</h3>
                </div>
                <i class="bi bi-check-circle display-4 text-success"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-warning">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Carros Vendidos</p>
                  <h3 class="mb-0">{{ dashboardStore.carrosVendidos }}</h3>
                </div>
                <i class="bi bi-cash-coin display-4 text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-info">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Valor Total em Estoque</p>
                  <h3 class="mb-0">{{ formatCurrency(dashboardStore.valorTotalEstoque) }}</h3>
                </div>
                <i class="bi bi-currency-dollar display-4 text-info"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos e Tabelas -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-pie-chart me-2"></i>
                Carros por Categoria
              </h5>
            </div>
            <div class="card-body">
              <div v-if="dashboardStore.carrosPorCategoria.length > 0">
                <div
                  v-for="item in dashboardStore.carrosPorCategoria"
                  :key="item.categoria"
                  class="mb-3"
                >
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ item.categoria }}</span>
                    <strong>{{ item.total }}</strong>
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      :style="{ width: calcularPorcentagem(item.total) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted">Nenhum dado disponível</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Atividades Recentes
              </h5>
            </div>
            <div class="card-body">
              <div v-if="dashboardStore.atividadesRecentes.length > 0">
                <div
                  v-for="(atividade, index) in dashboardStore.atividadesRecentes"
                  :key="index"
                  class="d-flex align-items-start mb-3"
                >
                  <i
                    class="bi bi-circle-fill text-primary me-2"
                    style="font-size: 8px; margin-top: 6px;"
                  ></i>
                  <div>
<p v-if="atividade.carro" class="mb-0">
  {{ atividade.carro.modelo }} - {{ atividade.carro.marca }}
</p>
<p v-else class="mb-0 text-muted">
  Sem informações do carro
</p>

                    <small class="text-muted">
                      {{ formatRelativeTime(atividade.data) }}
                    </small>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted">Nenhuma atividade recente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import { formatCurrency, formatRelativeTime } from '@/utils/formatters'

const dashboardStore = useDashboardStore()

const calcularPorcentagem = (total) => {
  const max = Math.max(...dashboardStore.carrosPorCategoria.map(c => c.total))
  return max > 0 ? (total / max) * 100 : 0
}

const recarregar = async () => {
  await dashboardStore.carregarTudo()
}

onMounted(async () => {
  await dashboardStore.carregarTudo()
})
</script>

<style scoped>
.stat-card {
  transition: transform var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}
</style>
