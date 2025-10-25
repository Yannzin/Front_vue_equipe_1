/**
 * Constantes da aplicacao
 * Centralize todos os valores fixos aqui para facilitar manutencao
 */

// Categorias de produtos
export const CATEGORIAS = [
  'Eletronicos',
  'Livros',
  'Escritorio',
  'Acessorios',
  'Cursos',
  'Outros'
]

// Status de estoque
export const STATUS_ESTOQUE = {
  CRITICO: { valor: 5, label: 'Critico', cor: 'danger' },
  BAIXO: { valor: 10, label: 'Baixo', cor: 'warning' },
  NORMAL: { valor: 20, label: 'Normal', cor: 'success' },
  ALTO: { valor: Infinity, label: 'Alto', cor: 'primary' }
}

// Tipos de notificacao (toast)
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info'
}

// Duracao padrao dos toasts (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
}

// Opcoes de ordenacao para produtos
export const ORDENACAO_PRODUTOS = [
  { valor: 'nome', label: 'Nome' },
  { valor: 'preco', label: 'Preco' },
  { valor: 'data_criacao', label: 'Data' },
  { valor: 'estoque', label: 'Estoque' }
]

// Opcoes de direcao de ordenacao
export const DIRECAO_ORDENACAO = [
  { valor: 'asc', label: 'Crescente' },
  { valor: 'desc', label: 'Decrescente' }
]

// Faixas de preco para filtros
export const FAIXAS_PRECO = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Ate R$ 100', min: 0, max: 100 },
  { label: 'R$ 100 - R$ 500', min: 100, max: 500 },
  { label: 'R$ 500 - R$ 1000', min: 500, max: 1000 },
  { label: 'Acima de R$ 1000', min: 1000, max: Infinity }
]

// Regras de validacao
export const VALIDACAO = {
  SENHA_MIN_LENGTH: 6,
  NOME_MIN_LENGTH: 3,
  PRECO_MIN: 0,
  PRECO_MAX: 999999.99,
  ESTOQUE_MIN: 0,
  ESTOQUE_MAX: 999999,
  DESCRICAO_MAX_LENGTH: 500
}

// Configuracoes de paginacao
export const PAGINACAO = {
  PRODUTOS_POR_PAGINA: 12,
  ATIVIDADES_POR_PAGINA: 10
}

// Temas disponiveis
export const TEMAS = {
  LIGHT: 'light',
  DARK: 'dark'
}

// Rotas que nao precisam de autenticacao
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

// Mensagens de erro padrao
export const MENSAGENS_ERRO = {
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
  ERRO_AUTENTICACAO: 'Email ou senha invalidos.',
  ERRO_SESSAO_EXPIRADA: 'Sua sessao expirou. Faca login novamente.',
  ERRO_PERMISSAO: 'Voce nao tem permissao para esta acao.',
  ERRO_CONEXAO: 'Erro de conexao. Verifique sua internet.',
  ERRO_SERVIDOR: 'Erro no servidor. Tente novamente mais tarde.',
  CAMPO_OBRIGATORIO: 'Este campo e obrigatorio.',
  EMAIL_INVALIDO: 'Email invalido.',
  SENHA_FRACA: 'Senha deve ter no minimo 6 caracteres.',
  PRECO_INVALIDO: 'Preco deve ser um numero positivo.',
  ESTOQUE_INVALIDO: 'Estoque deve ser um numero inteiro positivo.'
}

// Mensagens de sucesso padrao
export const MENSAGENS_SUCESSO = {
  LOGIN_SUCESSO: 'Login realizado com sucesso!',
  LOGOUT_SUCESSO: 'Logout realizado com sucesso!',
  CADASTRO_SUCESSO: 'Cadastro realizado com sucesso!',
  PRODUTO_CRIADO: 'Produto criado com sucesso!',
  PRODUTO_ATUALIZADO: 'Produto atualizado com sucesso!',
  PRODUTO_DELETADO: 'Produto deletado com sucesso!',
  PERFIL_ATUALIZADO: 'Perfil atualizado com sucesso!'
}

// Icones do Bootstrap Icons para cada categoria
export const ICONES_CATEGORIA = {
  'Eletronicos': 'bi-laptop',
  'Livros': 'bi-book',
  'Escritorio': 'bi-briefcase',
  'Acessorios': 'bi-gear',
  'Cursos': 'bi-mortarboard',
  'Outros': 'bi-box'
}

// Cores para graficos
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
