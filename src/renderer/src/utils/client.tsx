import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const requestClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})

interface LoginResponseData {
  tokens: {
    access: string
  }
  user: any
  message: string
}

interface RegisterResponseData {
  user: any
  message: string
}

interface RequestFunctionResponse {
  response: any
  success: boolean
}

interface ApiResponse<T> {
  response: T
  success: boolean
}

export function saveUserData(userData: JSON): void {
  localStorage.setItem('userData', JSON.stringify(userData))
}

export function getToken(): string {
  const cookiesJson = localStorage.getItem('cookies')
  if (cookiesJson) {
    const cookies = JSON.parse(cookiesJson)
    const auth_token: string = cookies?.[1]?.value || ''
    if (auth_token.length !== 0) {
      return auth_token
    } else {
      return ''
    }
  } else {
    return ''
  }
}

function handleResponse<T>(res: AxiosResponse<T>): ApiResponse<T> {
  if (res.status === 200 || res.status === 201) {
    return { response: res.data, success: true }
  } else {
    return { response: res.data, success: false }
  }
}

function handleError(error): string {
  return (error as Error).message || 'An error occurred'
}

export function saveLoginData(tokens, userData): void {
  localStorage.setItem('authToken', tokens.access)
  localStorage.setItem('userData', JSON.stringify(userData))
}

export const loginFunction = async (
  email: string,
  password: string
): Promise<RequestFunctionResponse> => {
  try {
    if (email === '' || password === '') {
      throw new Error("Email and password can't be empty")
    }

    const res: AxiosResponse<LoginResponseData> = await requestClient.post('/api/login', {
      email,
      password
    })
    // save the cookies in local storage
    window.electron.saveCookies()

    const { user, message } = res.data
    if (user) {
      saveUserData(user)
    }

    return { response: message, success: true }
  } catch (error) {
    return { response: handleError(error), success: false }
  }
}

export const registerFunction = async (
  username: string,
  email: string,
  password: string,
  password2: string
): Promise<RequestFunctionResponse> => {
  try {
    if (email === '' || password === '' || username === '') {
      throw new Error("Email, Username, and Password can't be empty")
    }
    if (password !== password2) {
      throw new Error('Both passwords must be the same.')
    }

    const res: AxiosResponse<RegisterResponseData> = await requestClient.post('/api/register', {
      username,
      email,
      password
    })

    const { user, message } = res.data

    if (user) {
      saveUserData(user)
    }
    await loginFunction(email, password)

    return { response: message, success: true }
  } catch (error) {
    return { response: handleError(error), success: false }
  }
}

export const get = async (url: string): Promise<RequestFunctionResponse> => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Authentication token not set')
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const res = await requestClient.get(url, config)

    return { response: res, success: true }
  } catch (error) {
    return { response: handleError(error), success: false }
  }
}

export const post = async (
  url: string,
  data: Record<string, any>
): Promise<RequestFunctionResponse> => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Authentication token not set')
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const res = await requestClient.post(url, data, config)

    return { response: res.data.message, success: true }
  } catch (error) {
    return { response: handleError(error), success: false }
  }
}

// check token function method

export async function checkToken(): Promise<RequestFunctionResponse> {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Authentication token not set')
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await requestClient.get('/api/check-token', config)

    return { response: res.data.message, success: true }
  } catch (error) {
    return { response: handleError(error), success: false }
  }
}

export async function logoutUser(): Promise<ApiResponse<string>> {
  return requestClient
    .post('/api/logout')
    .then((res) => {
      if (res.status === 200) {
        localStorage.clear()
        window.electron.clearCookies()
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
