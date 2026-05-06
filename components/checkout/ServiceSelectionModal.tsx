'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Loader2 } from 'lucide-react';
import ServiceConfigDialog from '@/components/checkout/ServiceConfigDialog';
import type { Service, Addon } from '@/components/checkout/types';
import { toast } from 'sonner';

interface ServiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedServiceId?: string | null;
}

export const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  open,
  onOpenChange,
  selectedServiceId = null,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [tempAddons, setTempAddons] = useState<
    Array<{ addonId: string; addonName: string; addonPrice: number }>
  >([]);
  const [tempRequirements, setTempRequirements] = useState('');

  useEffect(() => {
    if (open && selectedServiceId) {
      setLoading(true);
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          if (response.ok) {
            const data = await response.json();
            const service = data.find((s: Service) => s.id === selectedServiceId);
            if (service) {
              setSelectedService(service);
              setTempAddons([]);
              setTempRequirements('');
            }
          }
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [open, selectedServiceId]);

  const handleAddonToggle = (
    addon: Addon,
    action: 'toggle' | 'update' | 'remove' = 'toggle',
    qty?: number,
    unit?: string
  ) => {
    setTempAddons((prev) => {
      if (action === 'remove') {
        return prev.filter((a) => a.addonId !== addon.id);
      }
      if (action === 'update') {
        const exists = prev.some((a) => a.addonId === addon.id);

        if (exists) {
          return prev.map((a) =>
            a.addonId === addon.id
              ? {
                  ...a,
                  addonPrice: addon.price,
                  addonQty: qty,
                  addonUnit: unit,
                }
              : a
          );
        }

        return [
          ...prev,
          {
            addonId: addon.id,
            addonName: addon.name,
            addonPrice: addon.price,
            addonQty: qty,
            addonUnit: unit,
          },
        ];
      }
      const isSelected = prev.some((a) => a.addonId === addon.id);
      if (isSelected) {
        return prev.filter((a) => a.addonId !== addon.id);
      }
      return [
        ...prev,
        {
          addonId: addon.id,
          addonName: addon.name,
          addonPrice: addon.price,
        },
      ];
    });
  };

  const resetState = () => {
    setSelectedService(null);
    setTempAddons([]);
    setTempRequirements('');
  };

  const handleAddService = async () => {

    // Validation: if service has OPTION addons, ensure at least one is selected
    if (!selectedService) return;
    const optionAddons = selectedService.addons.filter(
      (addon) => addon.type === 'OPTION'
    );
    // Only enforce rule if OPTION addons exist
    if (optionAddons.length > 0) {
      const hasOptionSelected = tempAddons.some((a) => {
        const match = optionAddons.find((opt) => opt.id === a.addonId);
        if (!match) return false;
        return true;
      });

      if (!hasOptionSelected) {
        toast.error('Pasirinkite bent vieną pasirinkimą');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const cartItem = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        addons: tempAddons,
        specialRequirements: tempRequirements,
      };

      let cart = [];
      try {
        const saved = localStorage.getItem('checkout_cart');
        if (saved) cart = JSON.parse(saved);
      } catch (error) {
        console.error('Error reading cart:', error);
      }

      cart.push(cartItem);
      localStorage.setItem('checkout_cart', JSON.stringify(cart));

      const isOnPaslaugos = pathname.includes('/paslaugos');
      onOpenChange(false);
      resetState();

      if (!isOnPaslaugos) {
        const encodedItem = encodeURIComponent(JSON.stringify(cartItem));
        setTimeout(() => {
          router.push(`/paslaugos?newItem=${encodedItem}`);
          setIsProcessing(false);
        }, 50);
      } else {
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
          setIsProcessing(false);
        }, 50);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      resetState();
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center">
          <VisuallyHidden>
            <DialogTitle>Kraunama paslauga</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[--RepasBlue]" />
            <p className="text-center text-gray-600">Kraunama paslauga...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ServiceConfigDialog
      open={open && !isProcessing}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleModalClose();
      }}
      selectedService={selectedService}
      tempAddons={tempAddons}
      tempRequirements={tempRequirements}
      editingCartIndex={null}
      onAddonToggle={handleAddonToggle}
      onRequirementsChange={setTempRequirements}
      onConfirm={handleAddService}
    />
  );
};