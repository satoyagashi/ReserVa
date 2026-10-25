// Pure validation helpers: each returns { messages: string[], invalid: { fieldName: true } }

const isEmpty = (v) => v == null || v.trim() === ''

export function validateSignup({ firstname, email, password, repeatPassword }) {
  const messages = []
  const invalid = {}

  if (isEmpty(firstname)) {
    messages.push('Firstname is required')
    invalid.firstname = true
  }
  if (isEmpty(email)) {
    messages.push('Email is required')
    invalid.email = true
  }
  if (isEmpty(password)) {
    messages.push('Password is required')
    invalid.password = true
  } else if (password.length < 8) {
    messages.push('Password must have at least 8 characters')
    invalid.password = true
  }
  if (password !== repeatPassword) {
    messages.push('Password does not match repeated password')
    invalid.password = true
    invalid.repeatPassword = true
  }

  return { messages, invalid }
}

export function validateLogin({ email, password }) {
  const messages = []
  const invalid = {}

  if (isEmpty(email)) {
    messages.push('Email is required')
    invalid.email = true
  }
  if (isEmpty(password)) {
    messages.push('Password is required')
    invalid.password = true
  }

  return { messages, invalid }
}
