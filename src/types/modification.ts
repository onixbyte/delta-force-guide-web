export interface Tuning {
  tuningName: string
  tuningValue: number
}

export interface Accessory {
  slotName: string
  accessoryName: string
  tunings: Tuning[]
}

export interface Modification {
  id: number
  firearmId: number
  name: string
  code: string
  tags?: string[]
  note?: string
  author?: string
  videoUrl?: string,
  accessories: Accessory[]
}

export interface ModificationRequest extends Omit<Modification, "id"> {}
