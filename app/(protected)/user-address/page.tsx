import AddressForm from "@/components/map/address-form"

export default function AddresPage() {
  return (
    <div className="w-full max-w-4xl bg-background rounded-lg overflow-hidden">
      <p className="text-2xl font-semibold text-center text-black pt-8">Adresas</p>
      <AddressForm />
    </div>
  )
}