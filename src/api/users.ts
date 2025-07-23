import axios from "axios"
import { client } from './client'

export async function getUsers(): Promise<any> {
  try {
    const response = await client.get('/users')
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

export interface CreateUserPayload {
  username: string
  email: string
  role: string
  division: string
}

export const createUser = async (data: CreateUserPayload) => {
  const res = await axios.post("http://localhost:8080/users", data)
  return res.data
}

