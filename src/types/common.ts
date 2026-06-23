export type Direction = "ASC" | "DESC"

export interface Page<T> {
  map(arg0: (item: any) => { label: any; value: any; data: any }): unknown
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

