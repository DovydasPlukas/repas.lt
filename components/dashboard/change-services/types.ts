export type AddonType = "OPTION" | "PAPILDOMA_PASLAUGA" | "PRIEDAI"
export type OptionPricingType = "FIXED" | "QUANTITY" | "RANGE"

export interface RangeInterval {
  id?: string
  minQty: number
  maxQty: number
  price: number
}

export interface ServiceAddon {
  id: string
  name: string
  type: AddonType
  price: number
  enabled: boolean
  optionPricingType?: OptionPricingType
  ranges?: RangeInterval[]
}

export interface NewAddon {
  name: string
  type: AddonType
  price: number
  optionPricingType?: OptionPricingType
  ranges?: RangeInterval[]
}

export interface Service {
  id: string
  name: string
  description: string | null
  image?: string | null
  position: number
  enabled: boolean
  addons: ServiceAddon[]
}