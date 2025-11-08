// Funções de validação
// Regras de validação reutilizáveis para formulários de carros

import { VALIDACAO } from './constants'

// Valida se um valor está vazio
export function validarObrigatorio(valor) {
  if (typeof valor === 'string') {
    return valor.trim().length > 0
  }
  return valor !== null && valor !== undefined && valor !== ''
}

// Valida se o ano é válido
export function validarAno(ano) {
  const numero = parseInt(ano, 10)
  const anoAtual = new Date().getFullYear()
  if (isNaN(numero)) return false
  return numero >= 1900 && numero <= anoAtual + 1
}

// Valida se o preço é um número válido
export function validarPreco(preco) {
  const numero = parseFloat(preco)
  if (isNaN(numero)) return false
  if (numero < VALIDACAO.PRECO_MIN) return false
  if (numero > VALIDACAO.PRECO_MAX) return false
  return true
}

// Valida se a quilometragem é um número inteiro positivo
export function validarQuilometragem(quilometragem) {
  const numero = parseInt(quilometragem, 10)
  if (isNaN(numero)) return false
  return numero >= 0 && Number.isInteger(numero)
}

// Valida URL da imagem (opcional)
export function validarUrl(url) {
  if (!url || url.trim() === '') return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Valida se a categoria (ex: SUV, Hatch, Sedan) é válida
export function validarCategoria(categoria, categoriasPermitidas) {
  if (!categoria) return false
  return categoriasPermitidas.includes(categoria)
}

// Conjunto de validações para formulário de carro
export function validarFormularioCarro(dados, categoriasPermitidas) {
  const erros = {}
  
  if (!validarObrigatorio(dados.modelo)) {
    erros.modelo = 'Modelo é obrigatório'
  }

  if (!validarObrigatorio(dados.marca)) {
    erros.marca = 'Marca é obrigatória'
  }

  if (!validarAno(dados.ano)) {
    erros.ano = 'Ano inválido'
  }

  if (!validarObrigatorio(dados.preco)) {
    erros.preco = 'Preço é obrigatório'
  } else if (!validarPreco(dados.preco)) {
    erros.preco = 'Preço inválido'
  }

  if (!validarQuilometragem(dados.quilometragem)) {
    erros.quilometragem = 'Quilometragem deve ser um número inteiro positivo'
  }

  if (!validarCategoria(dados.categoria, categoriasPermitidas)) {
    erros.categoria = 'Categoria inválida'
  }

  if (!validarUrl(dados.imagem_url)) {
    erros.imagem_url = 'URL da imagem inválida'
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}

// Conjunto de validações para formulário de login
export function validarFormularioLogin(dados) {
  const erros = {}
  
  if (!validarObrigatorio(dados.email)) {
    erros.email = 'Email é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    erros.email = 'Email inválido'
  }
  
  if (!validarObrigatorio(dados.senha)) {
    erros.senha = 'Senha é obrigatória'
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}

// Conjunto de validações para formulário de cadastro
export function validarFormularioCadastro(dados) {
  const erros = {}
  
  if (!validarObrigatorio(dados.nome)) {
    erros.nome = 'Nome é obrigatório'
  }
  
  if (!validarObrigatorio(dados.email)) {
    erros.email = 'Email é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    erros.email = 'Email inválido'
  }
  
  if (!validarObrigatorio(dados.senha)) {
    erros.senha = 'Senha é obrigatória'
  } else if (dados.senha.length < VALIDACAO.SENHA_MIN_LENGTH) {
    erros.senha = `Senha deve ter no mínimo ${VALIDACAO.SENHA_MIN_LENGTH} caracteres`
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}
