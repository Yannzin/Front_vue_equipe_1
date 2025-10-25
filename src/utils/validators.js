export class FormValidator {
  constructor() {
    this.rules = {}
    this.errors = {}
  }

  setRules(rules) {
    this.rules = rules
    return this
  }

  validateField(fieldName, fieldValue) {
    if (!this.rules[fieldName]) {
      return true
    }

    const fieldRules = this.rules[fieldName]

    for (const rule of fieldRules) {
      const result = this.applyRule(rule, fieldValue)
      if (result !== true) {
        this.errors[fieldName] = result
        return false
      }
    }

    delete this.errors[fieldName]
    return true
  }

  validate(formData) {
    this.errors = {}
    let isValid = true

    for (const fieldName in this.rules) {
      const fieldValue = formData[fieldName] || ''
      if (!this.validateField(fieldName, fieldValue)) {
        isValid = false
      }
    }

    return isValid
  }

  applyRule(rule, value) {
    // Regras simples
    if (rule === 'required') {
      return value && value.toString().trim().length > 0 ? true : 'Campo obrigatório'
    }

    if (rule === 'email') {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !value || pattern.test(value) ? true : 'Email inválido'
    }

    if (rule === 'cpf') {
      const numbers = value?.replace(/\D/g, '') || ''
      return numbers.length === 11 ? true : 'CPF deve ter 11 dígitos'
    }

    // Regras com parâmetros
    if (typeof rule === 'string' && rule.includes(':')) {
      const [ruleName, param] = rule.split(':')

      if (ruleName === 'min') {
        const min = parseInt(param)
        return value && value.length >= min 
          ? true 
          : `Mínimo ${min} caracteres`
      }

      if (ruleName === 'max') {
        const max = parseInt(param)
        return !value || value.length <= max 
          ? true 
          : `Máximo ${max} caracteres`
      }
    }

    return true
  }

  getError(fieldName) {
    return this.errors[fieldName] || null
  }

  getErrors() {
    return this.errors
  }
}