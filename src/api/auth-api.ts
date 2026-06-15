import { LoginRequest, User } from "@/types"
import { WebClient } from "@/shared/web-client"

export async function login(loginRequest: LoginRequest): Promise<User> {
  const { data } = await WebClient.post<User>("/auth/login", {
    ...loginRequest,
  })
  return data
}

export async function logout() {
  await WebClient.get<void>("/auth/logout")
}
