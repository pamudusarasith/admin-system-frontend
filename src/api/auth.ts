import { client, unauthenticatedClient } from './client'

export async function getCsrf(): Promise<{
  token: string
  parameterName: string
}> {
  const response = await unauthenticatedClient.get('/csrf-token')
  return response.data
}

export async function login(
  username: string,
  password: string,
): Promise<{ access_token: string }> {
  try {
    const csrf = await getCsrf()
    const response = await unauthenticatedClient.post(
      `/login`,
      { username, password },
      {
        params: {
          [csrf.parameterName]: csrf.token,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export async function refreshToken(): Promise<{ access_token: string }> {
  try {
    const csrf = await getCsrf()
    const response = await unauthenticatedClient.post(
      `/refresh-token`,
      {},
      {
        params: {
          [csrf.parameterName]: csrf.token,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    const csrf = await getCsrf()
    await client.post(
      `/logout`,
      {},
      {
        params: {
          [csrf.parameterName]: csrf.token,
        },
      },
    )
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}
