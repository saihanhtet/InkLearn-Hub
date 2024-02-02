// Login.tsx
import React, { useState } from 'react'
import { loginUser } from '@renderer/client'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate } from 'react-router-dom'

interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const Login: React.FC<LoginProps> = ({ setLoggedIn }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e): Promise<boolean> {
    e.preventDefault()
    try {
      const { success, response } = await loginUser(email, password)
      if (success) {
        console.log(response)
        setLoggedIn(true)
        navigate('/')
        return true
      } else {
        console.log(response)
        setLoggedIn(false)
        return false
      }
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }
  return (
    <div
      className="center card border-0 shadow-none 
              p-3 w-100 h-100
              d-flex justify-content-center align-items-center"
    >
      <Form onSubmit={(e) => handleLogin(e)} className="login-form shadow-sm rounded p-5">
        <h5 className="text-start mb-3">Login Form</h5>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="text-bold">Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We&apos;ll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="text-bold">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Link to="/register" className="mb-3 text-decoration-none text-danger text-bold">
          {' '}
          Don&apos;t have an account?
        </Link>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Log In
        </Button>
      </Form>
    </div>
  )
}

export default Login
