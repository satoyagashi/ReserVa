import { useState } from 'react'
import Field, { PersonIcon, LockIcon } from './Field'
import { validateSignup } from './validation'

export default function Signup({ onSwitch, onSubmit }) {
  const [values, setValues] = useState({ firstname: '', email: '', password: '', repeatPassword: '' })
  const [errors, setErrors] = useState({ messages: [], invalid: {} })

  // Update a field and clear its error state as the user types
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors.invalid[name]) {
      setErrors({ messages: [], invalid: { ...errors.invalid, [name]: false } })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = validateSignup(values)
    setErrors(result)
    if (result.messages.length === 0) onSubmit?.(values)
  }

  return (
    <div className="wrapper">
      <h1>Sign-up</h1>
      <p id="error-message">{errors.messages.join('. ')}</p>
      <form id="form" onSubmit={handleSubmit} noValidate>
        <Field id="firstname-input" name="firstname" placeholder="Firstname" icon={<PersonIcon />}
          value={values.firstname} onChange={handleChange} invalid={errors.invalid.firstname} />
        <Field id="email-input" name="email" type="email" placeholder="Email" icon={<span>@</span>}
          value={values.email} onChange={handleChange} invalid={errors.invalid.email} />
        <Field id="password-input" name="password" type="password" placeholder="Password" icon={<LockIcon />}
          value={values.password} onChange={handleChange} invalid={errors.invalid.password} />
        <Field id="repeat-password-input" name="repeatPassword" type="password" placeholder="Repeat Password" icon={<LockIcon />}
          value={values.repeatPassword} onChange={handleChange} invalid={errors.invalid.repeatPassword} />
        <button type="submit">Signup</button>
      </form>
      <p>Already have an Account? <a href="#login" onClick={(e) => { e.preventDefault(); onSwitch() }}>Login</a></p>
    </div>
  )
}
