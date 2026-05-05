'use client';

import React from 'react';
import { Check, XCircle, CreditCard, Euro } from 'lucide-react';
import RequiredFieldLabel from '@/components/checkout/RequiredFieldLabel';

interface PaymentCardProps {
  paymentMethod?: string;
  onPaymentMethodChange?: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Stripe', Icon: CreditCard, disabled: false },
  { id: 'cash', label: 'Grynais pinigais', Icon: Euro, disabled: false },
] as const;

const PaymentCard: React.FC<PaymentCardProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center gap-2">
        {paymentMethod ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <h3 className="text-sm font-medium text-gray-900">
          <RequiredFieldLabel>Mokėjimo būdas</RequiredFieldLabel>
        </h3>
      </div>

      <div role="radiogroup" className="flex flex-col sm:flex-row gap-3">
        {PAYMENT_METHODS.map((m) => {
          const selected = paymentMethod === m.id;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={selected}
              disabled={m.disabled}
              onClick={() => !m.disabled && onPaymentMethodChange?.(m.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border focus:outline-none ${
                m.disabled
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                  : selected
                  ? 'bg-[--RepasBlue] text-white ring-2 ring-offset-2 ring-[--RepasBlue]'
                  : 'bg-white text-gray-900 border-gray-200'
              }`}
            >
              <m.Icon
                className={`h-5 w-5 ${
                  m.disabled
                    ? 'text-gray-400'
                    : selected
                    ? 'text-white'
                    : 'text-[--RepasBlue]'
                }`}
              />
              <span className="text-sm font-medium">{m.label}</span>
              {m.disabled && (
                <span className="text-xs font-medium">(Neprieinama)</span>
              )}
            </button>
          );
        })}
      </div>

      {!paymentMethod && (
        <p className="mt-3 text-sm text-red-600 font-medium">
          Prašome pasirinkti mokėjimo būdą
        </p>
      )}
    </div>
  );
};

export default PaymentCard;