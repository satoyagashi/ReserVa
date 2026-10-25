import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import './auth.css'

export default function App() {
  const [page, setPage] = useState('login')

  // Replace with a fetch() to your Node backend when it's ready
  const handleSubmit = (values) => console.log(`${page} submitted`, values)

  return page === 'login'
    ? <Login onSwitch={() => setPage('signup')} onSubmit={handleSubmit} />
    : <Signup onSwitch={() => setPage('login')} onSubmit={handleSubmit} />
}
