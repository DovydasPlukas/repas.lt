'use client';

/**
 * all form state:
 * localStorage persistence,
 * session-based user prefill from /api/user-contact,
 * and the clearForm reset.
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { FormData } from '@/components/checkout/types';

const EMPTY_FORM: FormData = {
  pickupDate: '', pickupTime: '',
  deliveryDate: '', deliveryTime: '',
  street: '', apartment: '', floor: '', notes: '',
  email: '', firstName: '', lastName: '', phone: '',
  paymentMethod: '', latitude: '', longitude: '',
};

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const useCheckoutForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load persisted form data on mount
  useEffect(() => {
    setFormData(loadFromStorage('checkout_formdata', EMPTY_FORM));
  }, []);

  // Pre-fill contact fields when logged in
  useEffect(() => {
    if (!session?.user?.email) return;

    const prefillUserData = async () => {
      try {
        const res = await fetch('/api/user-contact');
        const { data } = await res.json();
        if (!data) return;

        const phone = data.phoneNumber?.startsWith('+370')
          ? data.phoneNumber.substring(4)
          : (data.phoneNumber ?? '');

        setFormData((prev) => ({
          ...prev,
          email: session.user?.email ?? prev.email,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phone: phone || prev.phone,
        }));
      } catch {
        // silently ignore — user can fill manually
      }
    };

    prefillUserData();
  }, [session?.user?.email]);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('checkout_formdata', JSON.stringify(formData));
  }, [formData]);

  const handleFormDataChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const clearForm = () => {
    setFormData(EMPTY_FORM);
    localStorage.removeItem('checkout_formdata');
  };

  return { formData, handleFormDataChange, clearForm, isProcessing, setIsProcessing };
};