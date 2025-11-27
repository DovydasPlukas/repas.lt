export type AddonType = "PAPILDOMA_PASLAUGA" | "PRIEDAI"

export interface ServiceAddon {
  id: string
  name: string
  type: AddonType
  price: number
  enabled: boolean
}

export interface NewAddon {
  name: string
  type: AddonType
  price: number
}

export interface Service {
  id: string
  name: string
  description: string | null
  enabled: boolean
  addons: ServiceAddon[]
}

export interface NewAddon {
  name: string
  type: AddonType
  price: number
}