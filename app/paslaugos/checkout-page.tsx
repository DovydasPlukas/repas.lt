'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ServiceSelection, { ServiceSelectionHandle } from '@/components/checkout/ServiceSelection';
import PickupDeliveryTime from '@/components/checkout/PickupDeliveryTime';
import AddressSelection from '@/components/checkout/AddressSelection';
import ContactsInfo from '@/components/checkout/ContactsInfo';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderOverview from '@/components/checkout/OrderOverview';
import type { CartItem, Service, FormData } from '@/components/checkout/types';

interface CheckoutStep {
  id: number;
  name: string;
  label: string;
}

const STEPS: CheckoutStep[] = [
  { id: 1, name: 'services', label: 'Paslaugos' },
  { id: 2, name: 'datetime', label: 'Paėmimo ir pristatymo laikas' },
  { id: 3, name: 'address', label: 'Adresas' },
  { id: 4, name: 'contacts', label: 'Kontaktai' },
  { id: 5, name: 'overview', label: 'Peržiūra' },
];

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const serviceSelectionRef = useRef<ServiceSelectionHandle>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    street: '',
    apartment: '',
    floor: '',
    notes: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    paymentMethod: '',
    latitude: '',
    longitude: '',
  });

  // Load from localStorage on mount and check for service from modal
  useEffect(() => {
    const loadCartData = () => {
      try {
        const savedCart = localStorage.getItem('checkout_cart');
        const savedFormData = localStorage.getItem('checkout_formdata');
        const savedStep = localStorage.getItem('checkout_step');

        console.log('Loading cart from localStorage:', savedCart);

        let parsedCart: CartItem[] = [];
        if (savedCart) {
          parsedCart = JSON.parse(savedCart);
        }

        // Check if there's a newItem from URL params (fallback from modal redirect)
        const newItemParam = searchParams.get('newItem');
        if (newItemParam) {
          try {
            const newItem = JSON.parse(decodeURIComponent(newItemParam));
            console.log('Found newItem from URL params:', newItem);
            
            // Add to the cart if not already there
            if (newItem && newItem.serviceId) {
              parsedCart.push(newItem);
              console.log('Added newItem to cart, total items:', parsedCart.length);
            }
          } catch (error) {
            console.error('Error parsing newItem from URL:', error);
          }
        }

        setCart(parsedCart);

        if (savedFormData) {
          setFormData(JSON.parse(savedFormData));
        }
        if (savedStep) {
          setCurrentStep(parseInt(savedStep));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    };

    loadCartData();
  }, [searchParams]);

  // Clean up URL parameters after cart is loaded and refresh page to ensure cart displays
  useEffect(() => {
    if (searchParams.get('newItem') && cart.length > 0) {
      // Replace URL to remove the query parameter
      router.replace('/paslaugos');
      
      // Note: Using a timeout to allow the services to be accessed after selecting service from modal (other pages)
      // Refresh the page to ensure everything is properly rendered with the new cart
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [cart, searchParams, router]);

  // Listen for cart updates from modal
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('Cart updated event received');
      try {
        const savedCart = localStorage.getItem('checkout_cart');
        console.log('Reading cart from localStorage:', savedCart);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log('Cart parsed successfully:', parsedCart);
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Error reloading cart:', error);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'checkout_cart') {
        console.log('Storage event detected for checkout_cart, newValue:', e.newValue);
        if (e.newValue) {
          try {
            const parsedCart = JSON.parse(e.newValue);
            console.log('Cart updated via storage event:', parsedCart);
            setCart(parsedCart);
          } catch (error) {
            console.error('Error parsing cart from storage event:', error);
          }
        }
      }
    };

    // Listen for custom cartUpdated event
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Also listen for storage changes from other tabs/contexts
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('checkout_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('checkout_formdata', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('checkout_step', currentStep.toString());
  }, [currentStep]);

  // Auto-navigate to step 1 if cart becomes empty and user is on a later step
  useEffect(() => {
    if (cart.length === 0 && currentStep > 1) {
      setCurrentStep(1);
    }
  }, [cart, currentStep]);

  // Load user data if logged in
  useEffect(() => {
    if (session?.user?.email) {
      const loadUserData = async () => {
        try {
          const response = await fetch('/api/user-contact');
          const result = await response.json();

          if (result.data) {
            // Strip +370 prefix from phone number if present
            let phoneNumber = result.data.phoneNumber || '';
            if (phoneNumber.startsWith('+370')) {
              phoneNumber = phoneNumber.substring(4);
            }

            setFormData((prev) => ({
              ...prev,
              email: session.user.email || prev.email,
              firstName: result.data.firstName || prev.firstName,
              lastName: result.data.lastName || prev.lastName,
              phone: phoneNumber,
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      loadUserData();
    }
  }, [session?.user?.email]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    const itemTotal =
      item.addons.reduce((addonTotal, addon) => addonTotal + addon.addonPrice, 0);
    return total + itemTotal;
  }, 0);

  const handleAddService = (service: Service, addons: Array<{ addonId: string; addonName: string; addonPrice: number }>, requirements: string) => {
    // Always add a new instance of the service
    setCart([
      ...cart,
      {
        serviceId: service.id,
        serviceName: service.name,
        addons: addons,
        specialRequirements: requirements,
      },
    ]);
  };

  const handleEditService = (cartIndex: number, addons: Array<{ addonId: string; addonName: string; addonPrice: number }>, requirements: string) => {
    // Update existing service
    setCart(
      cart.map((item, index) =>
        index === cartIndex
          ? {
              ...item,
              addons: addons,
              specialRequirements: requirements,
            }
          : item
      )
    );
  };

  const handleRemoveService = (cartIndex: number) => {
    // Remove by index instead of serviceId
    setCart(cart.filter((_, i) => i !== cartIndex));
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return cart.length > 0;
      case 2:
        return (
          formData.pickupDate &&
          formData.pickupTime &&
          formData.deliveryDate &&
          formData.deliveryTime
        );
      case 3:
        return (
          formData.street &&
          formData.latitude &&
          formData.longitude
        );
      case 4:
        return (
          formData.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          formData.firstName &&
          formData.lastName &&
          formData.phone &&
          formData.phone.length === 8
        );
      case 5:
        return formData.paymentMethod; // Must have payment method before submitting
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: cart,
          street: formData.street,
          apartment: formData.apartment,
          floor: formData.floor,
          latitude: formData.latitude,
          longitude: formData.longitude,
          notes: formData.notes,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        // Clear cart and form data after successful order
        clearAllData();
        // Redirect to order confirmation
        router.push(`/order-confirmation?order=${data.orderId}`);
      } else {
        console.error('Failed to create order', data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAllData = () => {
    setCart([]);
    setFormData({
      pickupDate: '',
      pickupTime: '',
      deliveryDate: '',
      deliveryTime: '',
      street: '',
      apartment: '',
      floor: '',
      notes: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      paymentMethod: '',
      latitude: '',
      longitude: '',
    });
    setCurrentStep(1);
    localStorage.removeItem('checkout_cart');
    localStorage.removeItem('checkout_formdata');
    localStorage.removeItem('checkout_step');
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Stepper */}
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    // Only allow going back to completed steps or current step
                    if (step.id <= currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${
                    step.id === currentStep
                      ? 'border-[--RepasBlue] bg-[--RepasBlue] text-white'
                      : step.id < currentStep
                        ? 'border-green-500 bg-green-500 text-white cursor-pointer hover:bg-green-600'
                        : 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </button>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:inline ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-1 w-8 lg:w-12 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-16 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div
            className={`grid gap-8 ${
              currentStep == 5 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
            }`}
          >         
            {/* Form Section */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <ServiceSelection
                  ref={serviceSelectionRef}
                  onAddService={handleAddService}
                  onEditService={handleEditService}
                  onRemoveService={handleRemoveService}
                  cart={cart}
                />
              )}
              {/* ServiceSelection hidden on other steps but still mounted for dialog access */}
              {currentStep !== 1 && (
                <div className="hidden">
                  <ServiceSelection
                    ref={serviceSelectionRef}
                    onAddService={handleAddService}
                    onEditService={handleEditService}
                    onRemoveService={handleRemoveService}
                    cart={cart}
                  />
                </div>
              )}
              {currentStep === 2 && (
                <PickupDeliveryTime
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              )}
              {currentStep === 3 && (
                <AddressSelection
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              )}
              {currentStep === 4 && (
                <ContactsInfo
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              )}
              {currentStep === 5 && (
                <OrderOverview
                  cart={cart}
                  formData={formData}
                  totalPrice={totalPrice}
                  onFormDataChange={handleFormDataChange}
                />
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between gap-4">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrev}
                      className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
                    >
                      ← Atgal
                    </button>
                  )}
                </div>
                
                {currentStep === STEPS.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !canProceedToNextStep()}
                    className="rounded-lg bg-[--RepasBlue] px-8 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Apdorojimas...' : 'Baigti užsakymą'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedToNextStep()}
                    className="rounded-lg bg-[--RepasBlue] px-8 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Toliau →
                  </button>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {currentStep !== 5 && (
              <div>
                <OrderSummary
                  cart={cart}
                  totalPrice={totalPrice}
                  formData={formData}
                  onEditService={(cartIndex) => {
                    setTimeout(() => {
                      serviceSelectionRef.current?.openEditDialog(cartIndex);
                    }, 0);
                  }}
                  onRemoveService={handleRemoveService}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;