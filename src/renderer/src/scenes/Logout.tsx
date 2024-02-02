// Logout.tsx
import { logoutUser } from '@renderer/client'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { IoMdLogOut } from 'react-icons/io'
interface LogoutProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const Logout: React.FC<LogoutProps> = ({ setLoggedIn }) => {
  const navigate = useNavigate()
  async function handleLogout(e): Promise<boolean> {
    e.preventDefault()
    try {
      const { success, response } = await logoutUser()
      if (success) {
        console.log(response)
        setLoggedIn(false)
        navigate('/')
        return true
      } else {
        console.log(response)
        return false
      }
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  return (
    <Form
      onSubmit={(e) => handleLogout(e)}
      className="login-form shadow-sm rounded p-5 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
    >
      <div className="d-flex gap-3 align-items-center justify-content-center mb-2 w-50">
        <IoMdLogOut size={100} />
        <h2>Logout Page</h2>
      </div>
      <p className="text-muted text-bold">Are you sure you want to logout?</p>
      <Button variant="danger" type="submit" className="w-50 mt-3">
        Logout
      </Button>
    </Form>
  )
}

export default Logout
