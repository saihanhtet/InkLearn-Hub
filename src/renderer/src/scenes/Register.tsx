// Register.tsx
import React, { useState } from 'react'
import { registerUser } from '@renderer/client'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate } from 'react-router-dom'

interface RegisterProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const Register: React.FC<RegisterProps> = ({ setLoggedIn }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretKey, setSecretKey] = useState('')

  async function handleRegister(e): Promise<boolean> {
    e.preventDefault()
    try {
      const { success, response } = await registerUser(username, email, password, secretKey)
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
      console.error('Error during register:', error)
      return false
    }
  }
  return (
    <div
      className="center card border-0 shadow-none 
              p-3 w-100 h-100
              d-flex justify-content-center align-items-center"
    >
      <Form onSubmit={(e) => handleRegister(e)} className="login-form shadow-sm rounded p-5">
        <h5 className="text-start mb-3">Sign up Form</h5>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label className="text-bold">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We&apos;ll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
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
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicSecretKey">
          <Form.Label className="text-bold">Secret Key</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </Form.Group>
        <Link to="/login" className="mb-3 text-decoration-none text-danger text-bold">
          {' '}
          Already an User?
        </Link>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Sign Up
        </Button>
      </Form>
    </div>
  )
}

export default Register
