import AddressForm from "@/components/map/address-form"
import { MapPin } from "lucide-react"

export default function Home() {
  return (
  <div className="bg-background rounded-lg px-4 py-8 min-h-screen">
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <MapPin className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold">Pristatymo adresas</h1>
      </div>
      <p className="text-muted-foreground text-balance">Įveskite pristatymo adresą Lietuvoje</p>
    </div>
    <AddressForm />
  </div>
  )
}