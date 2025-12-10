'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {Loader2} from 'lucide-react';
import ServiceConfigDialog from '@/components/checkout/ServiceConfigDialog';
import type { Service, Addon, ServiceSelectionProps, ServiceSelectionHandle } from '@/components/checkout/types';

export type { ServiceSelectionHandle };

const ServiceSelection = forwardRef<ServiceSelectionHandle, ServiceSelectionProps>(
  (
    {
      onAddService,
      onEditService,
      cart,
    },
    ref
  ) => {
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
          {
            addonId: addon.id,
            addonName: addon.name,
            addonPrice: addon.price,
          },
        ]);
      }
    };

    const handleAddService = () => {
      if (!selectedService || tempAddons.length === 0) return;

      if (editingCartIndex !== null) {
        // Update existing service
        onEditService(editingCartIndex, tempAddons, tempRequirements);
      } else {
        // Add new service
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

        {/* Available Services*/}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Prieinamos paslaugos
          </h3>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {services.filter(service => service.addons.length > 0).map((service) => (
              <button
                key={service.id}
                onClick={() => openAddServiceDialog(service)}
                className="rounded-lg border-2 border-gray-200 p-4 text-left transition-all hover:border-[--RepasBlue] hover:bg-blue-50"
              >
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                {service.description && (
                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                )}
                {service.addons.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {service.addons.length} priedai
                  </p>
                )}
              </button>
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
          onConfirm={handleAddService}
        />
      </div>
    );
  }
);

ServiceSelection.displayName = 'ServiceSelection';

export default ServiceSelection;