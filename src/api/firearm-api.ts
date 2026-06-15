import { AddFirearmRequest, Direction, Firearm, FirearmType, Page, PageQueryParams } from "@/types"
import { WebClient } from "@/shared/web-client"
import { asUrlSearchParam } from "@/utils/query-param-utils.ts"

interface FirearmParams extends PageQueryParams {
  type?: FirearmType
}

/**
 * Fetch firearm list
 *
 * @param params Paged query parameters
 */
export async function getFirearms(params?: FirearmParams): Promise<Page<Firearm>> {
  let uri = "/firearms"
  const urlSearchParam = asUrlSearchParam(params)

  if (params?.type) {
    urlSearchParam.append("type", params.type)
  }

  if (urlSearchParam.size > 0) {
    uri = uri.concat("?", urlSearchParam.toString())
  }

  const { data } = await WebClient.get<Page<Firearm>>(uri)
  return data
}

/**
 * Fetch firearm by ID
 *
 * @param id Firearm ID
 */
export async function getFirearm(id: number): Promise<Firearm> {
  const { data } = await WebClient.get<Firearm>(`/firearms/${id}`)
  return data
}

/**
 * Create firearm
 * @param request
 */
export async function addFirearm(request: AddFirearmRequest): Promise<Firearm> {
  const { data } = await WebClient.post<Firearm>("/firearms", request)
  return data
}

export async function editFirearm(id: number, request: AddFirearmRequest): Promise<Firearm> {
  const { data } = await WebClient.put<Firearm>(`/firearms/${id}`, request)
  return data
}

export async function removeFirearm(id: number) {
  await WebClient.delete<void>(`/firearms/${id}`)
}
