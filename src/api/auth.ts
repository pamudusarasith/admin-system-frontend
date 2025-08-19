import { client } from './client'

export async function getCsrf(): Promise<{
  token: string
  parameterName: string
}> {
  const response = await client.get('/csrf-token')
  return response.data
}

export async function login(
  username: string,
  password: string,
): Promise<{ access_token: string }> {
  try {
    const csrf = await getCsrf()
    const response = await client.post(
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
