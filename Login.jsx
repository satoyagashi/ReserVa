import { useState } from 'react'
import Field, { LockIcon } from './Field'
import { validateLogin } from './validation'

export default function Login({ onSwitch, onSubmit }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ messages: [], invalid: {} })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors.invalid[name]) {
      setErrors({ messages: [], invalid: { ...errors.invalid, [name]: false } })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = validateLogin(values)
    setErrors(result)
    if (result.messages.length === 0) onSubmit?.(values)
  }

  return (
    <div className="wrapper">
      <h1>Login</h1>
      <p id="error-message">{errors.messages.join('. ')}</p>
      <form id="form" onSubmit={handleSubmit} noValidate>
        <Field id="email-input" name="email" type="email" placeholder="Email" icon={<span>@</span>}
          value={values.email} onChange={handleChange} invalid={errors.invalid.email} />
        <Field id="password-input" name="password" type="password" placeholder="Password" icon={<LockIcon />}
          value={values.password} onChange={handleChange} invalid={errors.invalid.password} />
        <button type="submit">Login</button>
      </form>
      <p>New here? <a href="#signup" onClick={(e) => { e.preventDefault(); onSwitch() }}>Create an Account</a></p>
    </div>
  )
}
