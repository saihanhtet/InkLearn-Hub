import axios, { AxiosResponse } from 'axios'

axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const requestClient = axios.create({
  // baseURL: 'https://ink-backend.vercel.app/'
  baseURL: 'http://127.0.0.1:8000/'
})

export function saveLoginData(tokens: any, userData: any) {
  localStorage.setItem('authToken', tokens.access)
  localStorage.setItem('userData', JSON.stringify(userData))
}

interface ApiResponse<T> {
  response: T
  success: boolean
}

export function loginUser(email: string, password: string): Promise<ApiResponse<AxiosResponse>> {
  return requestClient
    .post('/api/login', {
      email: email,
      password: password
    })
    .then((res) => {
      const authToken = res.data.tokens
      const userData = res.data.user
      if (authToken) {
        saveLoginData(authToken, userData)
        window.electron.saveToken(authToken)
      }
      return { response: res.data, success: true }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export function registerUser(
  username: string,
  email: string,
  password: string,
  secret_key: string
): Promise<ApiResponse<AxiosResponse>> {
  return requestClient
    .post('/api/register', {
      username: username,
      email: email,
      password: password,
      secret_key: secret_key
    })
    .then(async (res) => {
      if (res.status === 201) {
        await loginUser(email, password)
        return { response: res.data, success: true }
      } else {
        return { response: res.data, success: false }
      }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export function get(url: string): Promise<ApiResponse<AxiosResponse>> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return Promise.reject('Authentication token not set')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return requestClient
    .get(url, config)
    .then(async (res) => {
      if (res.status === 200) {
        return { response: res, success: true }
      } else {
        return { response: res, success: false }
      }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export function post(url: string, data: JSON): Promise<ApiResponse<AxiosResponse>> {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return Promise.reject('Authentication token not set')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return requestClient
    .post(url, data, config)
    .then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        return { response: res, success: true }
      } else {
        return { response: res, success: false }
      }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export function setCookie(): Promise<ApiResponse<any>> {
  return requestClient
    .post('/api/set-cookie')
    .then((res) => {
      if (res.status === 200) {
        return { response: res, success: true }
      } else {
        localStorage.removeItem('authToken')
        return { response: res, success: false }
      }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export function checkToken() {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return Promise.reject('Authentication token not set')
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return requestClient
    .get('/api/check-token', config)
    .then((res) => {
      window.electron.saveToken(token)
      return res
    })
    .catch((error) => {
      return error.response
    })
}

export function logoutUser(): Promise<ApiResponse<string>> {
  return requestClient
    .post('/api/logout')
    .then((res) => {
      if (res.status === 200) {
        localStorage.removeItem('authToken')
        return { response: 'Logout successful', success: true }
      } else {
        return { response: 'Error occurred during logout', success: false }
      }
    })
    .catch((error) => {
      return { response: error.response, success: false }
    })
}

export const getDetails = async () => {
  try {
    const { success, response } = await get('/api/user')
    if (success) {
      return response.data.user
    }
  } catch (err) {
    console.log('Error occurred while getting credentials:', err)
    return null
  }
}
