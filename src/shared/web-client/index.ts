import axios from "axios"
import dayjs from "@/shared/dayjs"

const WebClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: dayjs.duration({ seconds: 10 }).asMilliseconds(),
  withCredentials: true
})

export { WebClient }
