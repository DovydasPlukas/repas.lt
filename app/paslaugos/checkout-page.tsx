'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import ServiceSelection, { ServiceSelectionHandle } from '@/components/checkout/ServiceSelection';
import PickupDeliveryTime from '@/components/checkout/PickupDeliveryTime';
import AddressSelection from '@/components/checkout/AddressSelection';
import ContactsInfo from '@/components/checkout/ContactsInfo';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderOverview from '@/components/checkout/OrderOverview';

import { CheckoutStepper } from '@/app/paslaugos/checkout/CheckoutStepper';
import { CheckoutNavigation } from '@/app/paslaugos/checkout/CheckoutNavigation';
import { useCheckoutCart } from '@/app/paslaugos/checkout/useCheckoutCart';
import { useCheckoutForm } from '@/app/paslaugos/checkout/useCheckoutForm';
import { canProceedToNextStep } from '@/app/paslaugos/checkout/checkoutValidation';

const STEPS = [
  { id: 1, label: 'Paslaugos' },
  { id: 2, label: 'Paėmimo ir pristatymo laikas' },
  { id: 3, label: 'Adresas' },
  { id: 4, label: 'Kontaktai' },
  { id: 5, label: 'Peržiūra' },
];

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const serviceSelectionRef = useRef<ServiceSelectionHandle>(null);

  const { cart, currentStep, setCurrentStep, addService, editService, removeService, clearCart } = useCheckoutCart();
  const { formData, handleFormDataChange, clearForm, isProcessing, setIsProcessing } = useCheckoutForm();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.addons.reduce((s, a) => s + a.addonPrice, 0), 0
  );
  const canProceed = canProceedToNextStep(currentStep, cart, formData);

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: cart, ...formData }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        clearCart();
        clearForm();
        router.push(`/order-confirmation?order=${data.orderId}`);
      } else {
        console.error('Failed to create order', data);
      }
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ServiceSelection stays mounted on every step so the edit dialog ref is always reachable
  const serviceSelectionProps = {
    ref: serviceSelectionRef,
    onAddService: addService,
    onEditService: editService,
    onRemoveService: removeService,
    cart,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CheckoutStepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />

      <section className="px-6 py-16 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className={`grid gap-8 ${currentStep === 5 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>

            {/* Form area */}
            <div className="lg:col-span-2">
              {/* Always mounted; hidden on other steps so the edit-dialog ref stays alive */}
              <div className={currentStep !== 1 ? 'hidden' : ''}>
                <ServiceSelection {...serviceSelectionProps} />
              </div>
              {currentStep !== 1 && (
                <div className="hidden">
                  <ServiceSelection {...serviceSelectionProps} />
                </div>
              )}

              {currentStep === 2 && <PickupDeliveryTime formData={formData} onFormDataChange={handleFormDataChange} />}
              {currentStep === 3 && <AddressSelection formData={formData} onFormDataChange={handleFormDataChange} />}
              {currentStep === 4 && <ContactsInfo formData={formData} onFormDataChange={handleFormDataChange} />}
              {currentStep === 5 && <OrderOverview cart={cart} formData={formData} totalPrice={totalPrice} onFormDataChange={handleFormDataChange} />}

              <CheckoutNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
                canProceed={canProceed}
                isProcessing={isProcessing}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Sticky order summary (hidden on final overview step) */}
            <div> {/* div to contain the order summary */ }
            {currentStep !== 5 && (
              <OrderSummary
                cart={cart}
                totalPrice={totalPrice}
                formData={formData}
                onEditService={(i) => setTimeout(() => serviceSelectionRef.current?.openEditDialog(i), 0)}
                onRemoveService={removeService}
              />
            )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;