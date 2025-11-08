/**
 * Constantes da aplicação
 * Centralize todos os valores fixos aqui para facilitar manutenção
 */

// Categorias de carros
export const CATEGORIAS = [
  'SUV',
  'Sedan',
  'Hatch',
  'Pickup',
  'Esportivo',
  'Conversível',
  'Crossover',
  'Minivan',
  'Outros'
]

// Status de estoque (ex: quantidade disponível em estoque físico)
export const STATUS_ESTOQUE = {
  CRITICO: { valor: 1, label: 'Crítico', cor: 'danger' },
  BAIXO: { valor: 3, label: 'Baixo', cor: 'warning' },
  NORMAL: { valor: 10, label: 'Normal', cor: 'success' },
  ALTO: { valor: Infinity, label: 'Alto', cor: 'primary' }
}

// Tipos de notificação (toast)
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info'
}

// Duração padrão dos toasts (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
}

// Opções de ordenação para carros
export const ORDENACAO_CARROS = [
  { valor: 'marca', label: 'Marca' },
  { valor: 'modelo', label: 'Modelo' },
  { valor: 'ano', label: 'Ano' },
  { valor: 'preco', label: 'Preço' },
  { valor: 'quilometragem', label: 'Quilometragem' },
  { valor: 'data_criacao', label: 'Data de Cadastro' }
]

// Opções de direção de ordenação
export const DIRECAO_ORDENACAO = [
  { valor: 'asc', label: 'Crescente' },
  { valor: 'desc', label: 'Decrescente' }
]

// Faixas de preço para filtros de carros
export const FAIXAS_PRECO = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Até R$ 50.000', min: 0, max: 50000 },
  { label: 'R$ 50.000 - R$ 100.000', min: 50000, max: 100000 },
  { label: 'R$ 100.000 - R$ 200.000', min: 100000, max: 200000 },
  { label: 'Acima de R$ 200.000', min: 200000, max: Infinity }
]

// Regras de validação
export const VALIDACAO = {
  SENHA_MIN_LENGTH: 6,
  NOME_MIN_LENGTH: 3,
  PRECO_MIN: 0,
  PRECO_MAX: 9999999.99,
  ESTOQUE_MIN: 0,
  ESTOQUE_MAX: 9999,
  DESCRICAO_MAX_LENGTH: 1000
}

// Configurações de paginação
export const PAGINACAO = {
  CARROS_POR_PAGINA: 10,
  ATIVIDADES_POR_PAGINA: 10
}

// Temas disponíveis
export const TEMAS = {
  LIGHT: 'light',
  DARK: 'dark'
}

// Rotas públicas (sem autenticação obrigatória)
export const ROTAS_PUBLICAS = [
  '/login',
  '/sobre'
]

// Chaves do localStorage
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme'
}

// Mensagens de erro padrão
export const MENSAGENS_ERRO = {
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
  ERRO_AUTENTICACAO: 'Email ou senha inválidos.',
  ERRO_SESSAO_EXPIRADA: 'Sua sessão expirou. Faça login novamente.',
  ERRO_PERMISSAO: 'Você não tem permissão para esta ação.',
  ERRO_CONEXAO: 'Erro de conexão. Verifique sua internet.',
  ERRO_SERVIDOR: 'Erro no servidor. Tente novamente mais tarde.',
  CAMPO_OBRIGATORIO: 'Este campo é obrigatório.',
  EMAIL_INVALIDO: 'Email inválido.',
  SENHA_FRACA: 'Senha deve ter no mínimo 6 caracteres.',
  PRECO_INVALIDO: 'Preço deve ser um número positivo.',
  ESTOQUE_INVALIDO: 'Estoque deve ser um número inteiro positivo.'
}

// Mensagens de sucesso padrão
export const MENSAGENS_SUCESSO = {
  LOGIN_SUCESSO: 'Login realizado com sucesso!',
  LOGOUT_SUCESSO: 'Logout realizado com sucesso!',
  CADASTRO_SUCESSO: 'Cadastro realizado com sucesso!',
  CARRO_CRIADO: 'Carro cadastrado com sucesso!',
  CARRO_ATUALIZADO: 'Carro atualizado com sucesso!',
  CARRO_DELETADO: 'Carro removido com sucesso!',
  PERFIL_ATUALIZADO: 'Perfil atualizado com sucesso!'
}

// Ícones do Bootstrap Icons para cada categoria de carro
export const ICONES_CATEGORIA = {
  'SUV': 'bi-truck',
  'Sedan': 'bi-car-front',
  'Hatch': 'bi-car-front-fill',
  'Pickup': 'bi-truck-flatbed',
  'Esportivo': 'bi-lightning-charge',
  'Conversível': 'bi-wind',
  'Crossover': 'bi-car-front',
  'Minivan': 'bi-bus-front',
  'Outros': 'bi-box'
}

// Cores para gráficos
export const CORES_GRAFICO = [
  '#0d6efd', // primary
  '#6c757d', // secondary
  '#198754', // success
  '#dc3545', // danger
  '#ffc107', // warning
  '#0dcaf0', // info
  '#6f42c1', // purple
  '#fd7e14'  // orange
]
