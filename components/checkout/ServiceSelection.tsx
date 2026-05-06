'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Loader2 } from 'lucide-react';
import ServiceConfigDialog from '@/components/checkout/ServiceConfigDialog';
import ServiceCard from '@/components/checkout/ServiceSelection/ServiceCard';
import type { Service, Addon, ServiceSelectionProps, ServiceSelectionHandle } from '@/components/checkout/types';
import { toast } from 'sonner';

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

    const handleAddonToggle = (addon: Addon, action: 'toggle' | 'update' | 'remove' = 'toggle', qty?: number, unit?: string) => {
      setTempAddons((prev) => {
        if (action === 'remove') {
          return prev.filter((a) => a.addonId !== addon.id);
        }

        if (action === 'update') {
          const exists = prev.some((a) => a.addonId === addon.id);
          if (exists) {
            return prev.map((a) =>
              a.addonId === addon.id
                ? { ...a, addonPrice: addon.price, addonQty: qty, addonUnit: unit }
                : a
            );
          }
          return [...prev, { addonId: addon.id, addonName: addon.name, addonPrice: addon.price, addonQty: qty, addonUnit: unit }];
        }
        const isSelected = prev.some((a) => a.addonId === addon.id);
        if (isSelected) {
          return prev.filter((a) => a.addonId !== addon.id);
        }
        return [...prev, { addonId: addon.id, addonName: addon.name, addonPrice: addon.price }];
      });
    };

const handleConfirm = () => {
  if (!selectedService) return;

  const optionAddonIds = selectedService.addons
    .filter((addon) => addon.type === 'OPTION')
    .map((addon) => addon.id);

  const hasOptionSelected = tempAddons.some((a) =>
    optionAddonIds.includes(a.addonId)
  );

  if (optionAddonIds.length > 0 && !hasOptionSelected) {
    toast.error('Pasirinkite bent vieną pasirinkimą');
  return;
  }

  if (editingCartIndex !== null) {
    onEditService(editingCartIndex, tempAddons, tempRequirements);
  } else {
    onAddService(selectedService, tempAddons, tempRequirements);
  }

  setDialogOpen(false);
};

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[--RepasBlue]" /></div>;

    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pasirinkite paslaugas</h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {services.filter((s) => s.addons.length > 0).map((service) => (
            <ServiceCard key={service.id} service={service} onClick={(s) => {
              setSelectedService(s);
              setEditingCartIndex(null);
              setTempAddons([]);
              setTempRequirements('');
              setDialogOpen(true);
            }} />
          ))}
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