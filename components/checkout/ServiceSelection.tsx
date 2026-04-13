'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Loader2 } from 'lucide-react';
import ServiceConfigDialog from '@/components/checkout/ServiceConfigDialog';
import ServiceCard from '@/components/checkout/ServiceSelection/ServiceCard';
import type { Service, Addon, ServiceSelectionProps, ServiceSelectionHandle } from '@/components/checkout/types';

export type { ServiceSelectionHandle };

const ServiceSelection = forwardRef<ServiceSelectionHandle, ServiceSelectionProps>(
  ({ onAddService, onEditService, cart }, ref) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [editingCartIndex, setEditingCartIndex] = useState<number | null>(null);
    const [tempAddons, setTempAddons] = useState<Array<{ addonId: string; addonName: string; addonPrice: number }>>([]);
    const [tempRequirements, setTempRequirements] = useState('');

    useImperativeHandle(ref, () => ({
      openEditDialog: (cartIndex: number) => {
        const cartItem = cart[cartIndex];
        const service = services.find((s) => s.id === cartItem.serviceId);
        if (service) {
          setSelectedService(service);
          setEditingCartIndex(cartIndex);
          setTempAddons([...cartItem.addons]);
          setTempRequirements(cartItem.specialRequirements);
          setDialogOpen(true);
        }
      },
    }));

    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          if (response.ok) {
            const data = await response.json();
            setServices(data);
          }
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }, []);

    const openAddServiceDialog = (service: Service) => {
      setSelectedService(service);
      setEditingCartIndex(null);
      setTempAddons([]);
      setTempRequirements('');
      setDialogOpen(true);
    };

    const handleAddonToggle = (addon: Addon) => {
      const isSelected = tempAddons.some((a) => a.addonId === addon.id);
      if (isSelected) {
        setTempAddons(tempAddons.filter((a) => a.addonId !== addon.id));
      } else {
        setTempAddons([
          ...tempAddons,
          { addonId: addon.id, addonName: addon.name, addonPrice: addon.price },
        ]);
      }
    };

    const handleConfirm = () => {
      if (!selectedService || tempAddons.length === 0) return;
      if (editingCartIndex !== null) {
        onEditService(editingCartIndex, tempAddons, tempRequirements);
      } else {
        onAddService(selectedService, tempAddons, tempRequirements);
      }
      setDialogOpen(false);
      setSelectedService(null);
      setEditingCartIndex(null);
      setTempAddons([]);
      setTempRequirements('');
    };

    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[--RepasBlue]" />
        </div>
      );
    }

    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Pasirinkite paslaugas
        </h2>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Prieinamos paslaugos
          </h3>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {services
              .filter((s) => s.addons.length > 0)
              .map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={openAddServiceDialog}
                />
              ))}
          </div>
        </div>

        <ServiceConfigDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedService={selectedService}
          tempAddons={tempAddons}
          tempRequirements={tempRequirements}
          editingCartIndex={editingCartIndex}
          onAddonToggle={handleAddonToggle}
          onRequirementsChange={setTempRequirements}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }
);

ServiceSelection.displayName = 'ServiceSelection';
export default ServiceSelection;