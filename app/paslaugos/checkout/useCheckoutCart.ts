'use client';

/**
 * all cart state:
 * loading from localStorage + the URL ?newItem param,
 * the cross-tab/modal cartUpdated/storage event listeners,
 * persistence, and the add/edit/remove/clear mutators.
 * The duplicate-check logic isSameItem helper.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CartItem, Service } from '@/components/checkout/types';

type Addons = Array<{ addonId: string; addonName: string; addonPrice: number }>;

const isSameItem = (a: CartItem, b: CartItem): boolean =>
  a.serviceId === b.serviceId &&
  a.specialRequirements === b.specialRequirements &&
  a.addons.length === b.addons.length &&
  a.addons.every(({ addonId }) => b.addons.some((x) => x.addonId === addonId));

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const useCheckoutCart = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Initial load from localStorage + URL param
  useEffect(() => {
    let parsed = loadFromStorage<CartItem[]>('checkout_cart', []);
    const savedStep = loadFromStorage<number>('checkout_step', 1);

    const newItemParam = searchParams.get('newItem');
    if (newItemParam) {
      try {
        const newItem: CartItem = JSON.parse(decodeURIComponent(newItemParam));
        if (newItem?.serviceId && !parsed.some((x) => isSameItem(x, newItem))) {
          parsed = [...parsed, newItem];
        }
      } catch {
        // ignore malformed param
      }
    }

    setCart(parsed);
    setCurrentStep(savedStep);
  }, [searchParams]);

  // Strip the URL param once the cart is hydrated
  useEffect(() => {
    if (searchParams.get('newItem') && cart.length > 0) {
      router.replace('/paslaugos');
    }
  }, [cart, searchParams, router]);

  // Cross-tab / modal cart updates 
  useEffect(() => {
    const onCartUpdated = () => {
      const updated = loadFromStorage<CartItem[]>('checkout_cart', []);
      setCart(updated);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'checkout_cart' && e.newValue) {
        try { setCart(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };

    window.addEventListener('cartUpdated', onCartUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Persist to localStorage 
  useEffect(() => { localStorage.setItem('checkout_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('checkout_step', String(currentStep)); }, [currentStep]);

  // Auto-return to step 1 when cart is emptied
  useEffect(() => {
    if (cart.length === 0 && currentStep > 1) setCurrentStep(1);
  }, [cart, currentStep]);

  // Cart mutators 
  const addService = (service: Service, addons: Addons, specialRequirements: string) =>
    setCart((prev) => [...prev, { serviceId: service.id, serviceName: service.name, addons, specialRequirements }]);

  const editService = (index: number, addons: Addons, specialRequirements: string) =>
    setCart((prev) => prev.map((item, i) => i === index ? { ...item, addons, specialRequirements } : item));

  const removeService = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const clearCart = () => {
    setCart([]);
    setCurrentStep(1);
    localStorage.removeItem('checkout_cart');
    localStorage.removeItem('checkout_step');
  };

  return { cart, currentStep, setCurrentStep, addService, editService, removeService, clearCart };
};