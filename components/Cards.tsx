"use client"

import React, { useEffect, useState } from "react"
import ServiceCard from "@/components/Cards/ServiceCard"
import ContactCard from "@/components/Cards/card-contact"
import { ServiceSelectionModal } from "@/components/checkout/ServiceSelectionModal"

interface Service {
  id: string
  name: string
  description: string | null
  image?: string | null
  enabled: boolean
}

const Cards = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/dashboard/services")
        if (!response.ok) throw new Error("Failed to fetch services")
        const data = await response.json()
        
        // Filter enabled services
        const enabledServices = data
          .filter((service: Service) => service.enabled)
        
        setServices(enabledServices)
        setError(null)
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Nepavyko įkelti paslaugų")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleOrderClick = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setModalOpen(true)
  }

  const handleModalClose = (isOpen: boolean) => {
    setModalOpen(isOpen)
    if (!isOpen) setSelectedServiceId(null)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:gap-6 xs:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[360px] bg-gray-200 rounded-[10px] animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:gap-6 xs:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            name={service.name}
            description={service.description}
            image={service.image}
            onOrderClick={() => handleOrderClick(service.id)}
          />
        ))}
        <ContactCard />
      </div>
      <ServiceSelectionModal 
        open={modalOpen} 
        onOpenChange={handleModalClose} 
        selectedServiceId={selectedServiceId} 
      />
    </div>
  )
}

export default Cards