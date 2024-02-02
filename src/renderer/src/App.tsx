import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

// components
import Sidebar from './components/Sidebar'
import Dashboard from './scenes/Dashboard'
import Navbar from './components/Navbar'
import Login from './scenes/Login'
import Logout from './scenes/Logout'
import Register from './scenes/Register'
import PrivateRoute from './components/PrivateRoute'
import { checkToken } from './client'
import Subjects from './scenes/Subjects'
import Students from './scenes/Students'
import Profile from './scenes/Profile'
import Course from './scenes/Course'
import Loading from './components/Loading'

function App(): JSX.Element {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSessionId = async () => {
      console.log('Checking session...')
      try {
        const auth_token = localStorage.getItem('authToken')
        const auth_token_length = auth_token ? auth_token.length : 0

        if (auth_token !== 'undefined' && auth_token_length !== 0) {
          const response = await checkToken()
          if (response.status === 200) {
            console.log('session is still alive')
            setIsLoggedIn(true)
            navigate('/')
          } else {
            console.log('session is dead')
            setIsLoggedIn(false)
            navigate('/login')
          }
        }
      } catch (error) {
        console.error('Error checking session ID:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSessionId()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="wrapper-container">
        {isLoggedIn && <Sidebar />}
        <div className="card shadow-sm bg-transparent w-100 p-3 dashboard-container">
          <Routes>
            <Route
              path="/"
              element={<PrivateRoute element={<Dashboard />} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/subjects"
              element={<PrivateRoute element={<Subjects />} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/students"
              element={<PrivateRoute element={<Students />} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile />} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/course"
              element={<PrivateRoute element={<Course />} isLoggedIn={isLoggedIn} />}
            />
            <Route path="/login" element={<Login setLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setLoggedIn={setIsLoggedIn} />} />
            <Route path="/logout" element={<Logout setLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
