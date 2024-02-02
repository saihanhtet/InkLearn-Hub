import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const requestClient = axios.create({
  // baseURL: 'https://ink-backend.vercel.app/'
  baseURL: 'http://127.0.0.1:8000/'
})

interface ApiResponse<T> {
  response: T
  success: boolean
}

function getToken() {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Authentication token not set')
  }
  return token
}

function handleResponse<T>(res: AxiosResponse<T>): ApiResponse<T> {
  if (res.status === 200 || res.status === 201) {
    return { response: res.data, success: true }
  } else {
    return { response: res.data, success: false }
  }
}

function handleError(error: any): ApiResponse<any> {
  return { response: error.response, success: false }
}

export function saveLoginData(tokens: any, userData: any): void {
  localStorage.setItem('authToken', tokens.access)
  localStorage.setItem('userData', JSON.stringify(userData))
}

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResponse<AxiosResponse>> {
  try {
    const res = await requestClient.post('/api/login', { email, password })
    const authToken = res.data.tokens
    const userData = res.data.user

    if (authToken) {
      saveLoginData(authToken, userData)
      window.electron.saveToken(authToken)
    }

    return handleResponse(res)
  } catch (error) {
    return handleError(error)
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  secret_key: string
): Promise<ApiResponse<AxiosResponse>> {
  try {
    const res = await requestClient.post('/api/register', { username, email, password, secret_key })

    if (res.status === 201) {
      await loginUser(email, password)
    }

    return handleResponse(res)
  } catch (error) {
    return handleError(error)
  }
}

export async function get(url: string): Promise<ApiResponse<AxiosResponse>> {
  try {
    const token = getToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await requestClient.get(url, config)
    return handleResponse(res)
  } catch (error) {
    return handleError(error)
  }
}

export async function post(url: string, data: JSON): Promise<ApiResponse<AxiosResponse>> {
  try {
    const token = getToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await requestClient.post(url, data, config)
    return handleResponse(res)
  } catch (error) {
    return handleError(error)
  }
}
export async function checkToken(): Promise<ApiResponse<AxiosResponse>> {
  try {
    const token = getToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await requestClient.get('/api/check-token', config)
    window.electron.saveToken(token)
    console.log(res)
    return handleResponse(res)
  } catch (error) {
    return handleError(error)
  }
}

export async function logoutUser(): Promise<ApiResponse<string>> {
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

export const getDetails = async (): Promise<any> => {
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
