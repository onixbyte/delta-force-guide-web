import { WebClient } from "@/shared/web-client"
import { DailyPasswordResponse, PasswordItem } from "@/types/DailyPasswordResponse"


export async function getDailyPassword(): Promise<PasswordItem[]> {
  const { data } = await WebClient.get<DailyPasswordResponse>(`/daily-passwords`)
  const allPasswords:PasswordItem[]=data.data.passwords
  return allPasswords
}