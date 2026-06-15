export type Direction = "ASC" | "DESC"

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PageQueryParams {
  page?: number
  size?: number
  sortBy?: string
  direction?: Direction
}

