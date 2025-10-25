// Funcoes de validacao
// Regras de validacao reutilizaveis para formularios

import { VALIDACAO } from './constants'

// Valida se um valor esta vazio
export function validarObrigatorio(valor) {
  if (typeof valor === 'string') {
    return valor.trim().length > 0
  }
  return valor !== null && valor !== undefined && valor !== ''
}

// Valida formato de email
export function validarEmail(email) {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valida forca da senha
export function validarSenhaForte(senha) {
  if (!senha) return false
  if (senha.length < VALIDACAO.SENHA_MIN_LENGTH) {
    return false
  }
  return true
}

// Valida comprimento minimo de texto
export function validarComprimentoMinimo(texto, minimo = 3) {
  if (!texto) return false
  return texto.trim().length >= minimo
}

// Valida comprimento maximo de texto
export function validarComprimentoMaximo(texto, maximo = 500) {
  if (!texto) return true
  return texto.trim().length <= maximo
}

// Valida se preco e um numero valido
export function validarPreco(preco) {
  const numero = parseFloat(preco)
  if (isNaN(numero)) return false
  if (numero < VALIDACAO.PRECO_MIN) return false
  if (numero > VALIDACAO.PRECO_MAX) return false
  return true
}

// Valida se estoque e um numero inteiro positivo
export function validarEstoque(estoque) {
  const numero = parseInt(estoque, 10)
  if (isNaN(numero)) return false
  if (numero < VALIDACAO.ESTOQUE_MIN) return false
  if (numero > VALIDACAO.ESTOQUE_MAX) return false
  if (!Number.isInteger(numero)) return false
  return true
}

// Valida URL (opcional - pode ser vazia)
export function validarUrl(url) {
  if (!url || url.trim() === '') return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Valida se categoria e valida
export function validarCategoria(categoria, categoriasPermitidas) {
  if (!categoria) return false
  return categoriasPermitidas.includes(categoria)
}

// Conjunto de validacoes para formulario de produto
export function validarFormularioProduto(dados, categoriasPermitidas) {
  const erros = {}
  
  if (!validarObrigatorio(dados.nome)) {
    erros.nome = 'Nome e obrigatorio'
  } else if (!validarComprimentoMinimo(dados.nome, VALIDACAO.NOME_MIN_LENGTH)) {
    erros.nome = `Nome deve ter no minimo ${VALIDACAO.NOME_MIN_LENGTH} caracteres`
  }
  
  if (dados.descricao && !validarComprimentoMaximo(dados.descricao, VALIDACAO.DESCRICAO_MAX_LENGTH)) {
    erros.descricao = `Descricao deve ter no maximo ${VALIDACAO.DESCRICAO_MAX_LENGTH} caracteres`
  }
  
  if (!validarObrigatorio(dados.preco)) {
    erros.preco = 'Preco e obrigatorio'
  } else if (!validarPreco(dados.preco)) {
    erros.preco = 'Preco invalido'
  }
  
  if (!validarEstoque(dados.estoque)) {
    erros.estoque = 'Estoque deve ser um numero inteiro positivo'
  }
  
  if (!validarCategoria(dados.categoria, categoriasPermitidas)) {
    erros.categoria = 'Categoria invalida'
  }
  
  if (!validarUrl(dados.imagem_url)) {
    erros.imagem_url = 'URL da imagem invalida'
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}

// Conjunto de validacoes para formulario de login
export function validarFormularioLogin(dados) {
  const erros = {}
  
  if (!validarObrigatorio(dados.email)) {
    erros.email = 'Email e obrigatorio'
  } else if (!validarEmail(dados.email)) {
    erros.email = 'Email invalido'
  }
  
  if (!validarObrigatorio(dados.senha)) {
    erros.senha = 'Senha e obrigatoria'
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}

// Conjunto de validacoes para formulario de cadastro
export function validarFormularioCadastro(dados) {
  const erros = {}
  
  if (!validarObrigatorio(dados.nome)) {
    erros.nome = 'Nome e obrigatorio'
  } else if (!validarComprimentoMinimo(dados.nome, VALIDACAO.NOME_MIN_LENGTH)) {
    erros.nome = `Nome deve ter no minimo ${VALIDACAO.NOME_MIN_LENGTH} caracteres`
  }
  
  if (!validarObrigatorio(dados.email)) {
    erros.email = 'Email e obrigatorio'
  } else if (!validarEmail(dados.email)) {
    erros.email = 'Email invalido'
  }
  
  if (!validarObrigatorio(dados.senha)) {
    erros.senha = 'Senha e obrigatoria'
  } else if (!validarSenhaForte(dados.senha)) {
    erros.senha = `Senha deve ter no minimo ${VALIDACAO.SENHA_MIN_LENGTH} caracteres`
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}
