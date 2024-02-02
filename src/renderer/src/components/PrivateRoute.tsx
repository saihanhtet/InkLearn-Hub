import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  element: React.ReactNode
  isLoggedIn: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isLoggedIn }) => {
  const location = useLocation()
  return isLoggedIn ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  )
}

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

export default PrivateRoute
