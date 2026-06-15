import { Modification, ModificationRequest, Page, PageQueryParams } from "@/types"
import { WebClient } from "@/shared/web-client"
import { asUrlSearchParam } from "@/utils/query-param-utils.ts"

interface ModificationParams extends PageQueryParams {
  firearmId?: string
  tags?: string[]
}

export async function getModifications(params?: ModificationParams): Promise<Page<Modification>> {
  let uri = "/modifications"
  const urlSearchParams = asUrlSearchParam(params)

  if (params?.firearmId) {
    urlSearchParams.append("firearmId", "" + params.firearmId)
  }

  if (params?.tags) {
    params.tags.forEach((tag) => urlSearchParams.append("tags", tag))
  }

  if (urlSearchParams.size > 0) {
    uri = uri.concat("?", urlSearchParams.toString())
  }

  const { data } = await WebClient.get<Page<Modification>>(uri)
  return data
}

export async function getModification(id: number): Promise<Modification> {
  const { data } = await WebClient.get<Modification>(`/modifications/${id}`)
  return data
}

export async function addModification(modification: ModificationRequest): Promise<Modification> {
  const { data } = await WebClient.post<Modification>("/modifications", modification)
  return data
}

export async function addModifications(
  modifications: ModificationRequest[]
): Promise<Modification[]> {
  const { data } = await WebClient.post<Modification[]>("/modifications/batch", {
    modifications,
  })
  return data
}

export async function editModification(
  id: number,
  modification: ModificationRequest
): Promise<Modification> {
  const { data } = await WebClient.put<Modification>(`/modifications/${id}`, modification)
  return data
}

export async function removeModification(
  id: number
): Promise<void> {
  await WebClient.delete(`/modifications/${id}`)
}

export async function removeModifications(ids: number[]) {
  const urlSearchParams = new URLSearchParams()
  ids.forEach((id) => urlSearchParams.append("ids", "" + id))
  await WebClient.delete(`/modifications/batch-delete?${urlSearchParams.toString()}`)
}