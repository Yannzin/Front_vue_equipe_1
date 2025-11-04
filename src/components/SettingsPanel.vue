<template>
  <div class="settings-panel">
    <h3>Configuracoes</h3>
    
    <!-- Tema -->
    <div class="setting-item">
      <label>Tema:</label>
      <div class="button-group">
        <button
          :class="{ active: settingsStore.tema === 'claro' }"
          @click="settingsStore.alterarTema('claro')"
        >
          ☀️ Claro
        </button>
        <button
          :class="{ active: settingsStore.tema === 'escuro' }"
          @click="settingsStore.alterarTema('escuro')"
        >
          🌙 Escuro
        </button>
      </div>
    </div>
    
    <!-- Idioma -->
    <div class="setting-item">
      <label>Idioma:</label>
      <select v-model="settingsStore.idioma" @change="settingsStore.alterarIdioma(settingsStore.idioma)">
        <option value="pt">Portugues</option>
        <option value="en">English</option>
      </select>
    </div>
    
    <!-- Notificacoes -->
    <div class="setting-item">
      <label>Notificacoes:</label>
      <input
        type="checkbox"
        :checked="settingsStore.notificacoes"
        @change="settingsStore.toggleNotificacoes()"
      >
      <span>{{ settingsStore.notificacoes ? 'Ativadas' : 'Desativadas' }}</span>
    </div>
    
    <!-- Preview -->
    <div class="preview">
      <strong>Configuracoes atuais:</strong>
      <ul>
        <li>Tema: {{ settingsStore.temaAtivo }}</li>
        <li>Idioma: {{ settingsStore.idiomaAtual }}</li>
        <li>Notificacoes: {{ settingsStore.notificacoesHabilitadas ? 'Sim' : 'Nao' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'SettingsPanel',
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.setting-item {
  margin: 20px 0;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.button-group button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.preview ul {
  margin: 10px 0 0 20px;
}
</style>
