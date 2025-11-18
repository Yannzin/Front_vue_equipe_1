/**
 * Funcoes auxiliares gerais
 * Utilitarios diversos que nao se encaixam em outras categorias
 */

/**
 * Aguarda um tempo especifico (util para testes e delays)
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce - executa funcao apenas apos intervalo sem chamadas
 */
export function debounce(func, wait = 300) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle - limita execucao de funcao a um intervalo minimo
 */
export function throttle(func, limit = 300) {
  let inThrottle
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clone de objeto
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  
  // Usar JSON para clone simples (funciona para maioria dos casos)
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    console.error('Erro ao clonar objeto:', e)
    return obj
  }
}

/**
 * Verifica se objeto esta vazio
 */
export function isObjectEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * Filtra valores nulos/undefined de objeto
 */
export function removeNullValues(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

/**
 * Agrupa array por propriedade
 */
export function groupBy(array, property) {
  return array.reduce((acc, item) => {
    const key = item[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
}

/**
 * Ordena array de objetos por propriedade
 */
export function sortBy(array, property, ascending = true) {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (aVal < bVal) return ascending ? -1 : 1
    if (aVal > bVal) return ascending ? 1 : -1
    return 0
  })
}

/**
 * Remove duplicatas de array
 */
export function uniqueArray(array) {
  return [...new Set(array)]
}

/**
 * Gera ID unico simples
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Converte query string para objeto
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}

/**
 * Converte objeto para query string
 */
export function toQueryString(obj) {
  return Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * Download de arquivo
 */
export function downloadFile(data, filename, mimeType = 'text/plain') {
  const blob = new Blob([data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.href = url
  link.download = filename
  link.click()
  
  window.URL.revokeObjectURL(url)
}

/**
 * Copia texto para area de transferencia
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Erro ao copiar:', err)
    return false
  }
}

/**
 * Detecta modo escuro do sistema
 */
export function prefersDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Calcula porcentagem
 */
export function calculatePercentage(parte, total) {
  if (!total || total === 0) return 0
  return (parte / total) * 100
}

/**
 * Formata objeto de erro de API para mensagem legivel
 */
export function extractErrorMessage(error) {
  if (typeof error === 'string') return error
  
  if (error.response) {
    // Erro de resposta HTTP
    return error.response.data?.message || error.response.statusText || 'Erro no servidor'
  }
  
  if (error.request) {
    // Requisicao feita mas sem resposta
    return 'Erro de conexao. Verifique sua internet.'
  }
  
  // Outro tipo de erro
  return error.message || 'Erro desconhecido'
}

/**
 * Verifica se navegador tem suporte a localStorage
 */
export function hasLocalStorageSupport() {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}
