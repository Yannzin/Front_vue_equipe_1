// src/utils/wizardValidation.js

export const validateStep1 = (data) => {
  const errors = {};

  if (!data.nome) errors.nome = "O nome é obrigatório.";
  if (!data.email) errors.email = "O e-mail é obrigatório.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "E-mail inválido.";
  if (!data.cpf) errors.cpf = "O CPF é obrigatório.";
  else if (!/^\d{11}$/.test(data.cpf)) errors.cpf = "CPF deve ter 11 dígitos.";

  return errors;
};

export const validateStep2 = (data) => {
  const errors = {};

  if (!data.cep) errors.cep = "O CEP é obrigatório.";
  if (!data.rua) errors.rua = "A rua é obrigatória.";
  if (!data.numero) errors.numero = "O número é obrigatório.";
  if (!data.cidade) errors.cidade = "A cidade é obrigatória.";
  if (!data.estado) errors.estado = "O estado é obrigatório.";

  return errors;
};

export const validateStep3 = (data) => {
  const errors = {};

  if (!data.profissao) errors.profissao = "A profissão é obrigatória.";
  if (!data.empresa) errors.empresa = "A empresa é obrigatória.";
  if (!data.salario) errors.salario = "O salário é obrigatório.";

  return errors;
};
