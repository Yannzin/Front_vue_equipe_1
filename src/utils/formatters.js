/**
 * Funcoes de formatacao
 * Transformam dados brutos em formatos legiveis para exibicao
 */

/**
 * Formata numero como moeda brasileira
 */
export function formatCurrency(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  
  const numero = parseFloat(valor)
  if (isNaN(numero)) return 'R$ 0,00'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numero)
}

/**
 * Formata numero com separadores de milhares
 */
export function formatNumber(valor) {
  if (valor === null || valor === undefined) return '0'
  
  const numero = parseFloat(valor)
  if (isNaN(numero)) return '0'
  
  return new Intl.NumberFormat('pt-BR').format(numero)
}

/**
 * Formata data em formato brasileiro
 */
export function formatDate(data, opcoes = {}) {
  if (!data) return '-'
  
  const dataObj = typeof data === 'string' ? new Date(data) : data
  
  if (isNaN(dataObj.getTime())) return '-'
  
  const opcoesFormatacao = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...opcoes
  }
  
  return new Intl.DateTimeFormat('pt-BR', opcoesFormatacao).format(dataObj)
}

/**
 * Formata data e hora em formato brasileiro
 */
export function formatDateTime(data) {
  if (!data) return '-'
  
  return formatDate(data, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formata data relativa (ex: "2 horas atras", "ontem")
 */
export function formatRelativeTime(data) {
  if (!data) return '-'
  
  const dataObj = typeof data === 'string' ? new Date(data) : data
  const agora = new Date()
  const diferencaMs = agora - dataObj
  const diferencaSegundos = Math.floor(diferencaMs / 1000)
  const diferencaMinutos = Math.floor(diferencaSegundos / 60)
  const diferencaHoras = Math.floor(diferencaMinutos / 60)
  const diferencaDias = Math.floor(diferencaHoras / 24)
  
  if (diferencaSegundos < 60) {
    return 'agora mesmo'
  } else if (diferencaMinutos < 60) {
    return `${diferencaMinutos} minuto${diferencaMinutos > 1 ? 's' : ''} atras`
  } else if (diferencaHoras < 24) {
    return `${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''} atras`
  } else if (diferencaDias === 1) {
    return 'ontem'
  } else if (diferencaDias < 7) {
    return `${diferencaDias} dias atras`
  } else {
    return formatDate(data)
  }
}

/**
 * Trunca texto longo adicionando reticencias
 */
export function truncateText(texto, maxLength = 100) {
  if (!texto) return ''
  if (texto.length <= maxLength) return texto
  
  return texto.substring(0, maxLength).trim() + '...'
}

/**
 * Capitaliza primeira letra de cada palavra
 */
export function capitalize(texto) {
  if (!texto) return ''
  
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ')
}

/**
 * Converte texto para slug URL-friendly
 */
export function slugify(texto) {
  if (!texto) return ''
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por -
    .replace(/^-+|-+$/g, '')         // Remove - do inicio e fim
}

/**
 * Formata numero de telefone brasileiro
 */
export function formatPhone(telefone) {
  if (!telefone) return ''
  
  const numeros = telefone.replace(/\D/g, '')
  
  if (numeros.length === 11) {
    // Celular: (11) 98765-4321
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numeros.length === 10) {
    // Fixo: (11) 8765-4321
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return telefone
}

/**
 * Formata CPF brasileiro
 */
export function formatCPF(cpf) {
  if (!cpf) return ''
  
  const numeros = cpf.replace(/\D/g, '')
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}

/**
 * Formata tamanho de arquivo em bytes para KB, MB, GB
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const tamanhos = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamanhos[i]
}

/**
 * Formata porcentagem
 */
export function formatPercentage(valor, casasDecimais = 1) {
  if (valor === null || valor === undefined) return '0%'
  
  const numero = parseFloat(valor)
  if (isNaN(numero)) return '0%'
  
  return numero.toFixed(casasDecimais) + '%'
}

/**
 * Formata status de estoque com cor
 */
export function formatStockStatus(estoque) {
  if (estoque === 0) {
    return { label: 'Esgotado', cor: 'danger' }
  } else if (estoque < 5) {
    return { label: 'Critico', cor: 'danger' }
  } else if (estoque < 10) {
    return { label: 'Baixo', cor: 'warning' }
  } else if (estoque < 20) {
    return { label: 'Normal', cor: 'success' }
  } else {
    return { label: 'Alto', cor: 'primary' }
  }
}
