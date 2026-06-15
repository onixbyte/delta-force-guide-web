export type FirearmType =
  | "RIFLE"
  | "SUB_MACHINE_GUN"
  | "SHOTGUN"
  | "LIGHT_MACHINE_GUN"
  | "DESIGNATED_MARKSMAN_RIFLE"
  | "SNIPER_RIFLE"
  | "PISTOL"
  | "SPECIAL"

export interface Firearm {
  id: number
  name: string
  type: FirearmType
  level: string
  calibre: string
  fireRate: number
  armourDamage: number
  bodyDamage: number
  review: string | null
}

export interface AddFirearmRequest extends Omit<Firearm, "id"> {}

