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
  const [tempAddons, setTempAddons] = useState<Array<{ addonId: string; addonName: string; addonPrice: number }>>([]);
  const [tempRequirements, setTempRequirements] = useState('');

  useEffect(() => {
    if (open && selectedServiceId) {
      setLoading(true);
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          if (response.ok) {
            const data = await response.json();

            // Find and set the selected service
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

  const handleAddService = async () => {
    if (!selectedService || tempAddons.length === 0) return;

    setIsProcessing(true);

    try {
      // Create the cart item
      const cartItem = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        addons: tempAddons,
        specialRequirements: tempRequirements,
      };

      // Get current cart from localStorage
      let cart = [];
      try {
        const savedCart = localStorage.getItem('checkout_cart');
        if (savedCart) {
          cart = JSON.parse(savedCart);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
      }

      // Add new service to cart
      cart.push(cartItem);

      // Save updated cart to localStorage
      const cartJson = JSON.stringify(cart);
      localStorage.setItem('checkout_cart', cartJson);
      console.log('Cart saved to localStorage:', cartJson);

      // If not already on paslaugos page, redirect with cart data in URL
      const isOnPaslaugos = pathname.includes('/paslaugos');
      
      if (!isOnPaslaugos) {
        console.log('Not on paslaugos, redirecting...');
        
        // Also pass the newly added item via URL as backup
        const encodedItem = encodeURIComponent(JSON.stringify(cartItem));
        
        // Redirect to paslaugos with the new item as query param
        router.push(`/paslaugos?newItem=${encodedItem}`);
        
        // Keep processing state until component unmounts
        return;
      } else {
        // If already on paslaugos, trigger a refresh of cart data
        console.log('Already on paslaugos, will dispatch cartUpdated event');
        
        // Close modal immediately
        onOpenChange(false);
        setSelectedService(null);
        setTempAddons([]);
        setTempRequirements('');
        
        // Dispatch event after a brief delay to ensure localStorage is synced
        setTimeout(() => {
          console.log('Dispatching cartUpdated event');
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
      setSelectedService(null);
      setTempAddons([]);
      setTempRequirements('');
    }
  };

  // Show loading dialog while fetching service
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
        if (!isOpen) {
          handleModalClose();
        }
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
