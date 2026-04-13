'use client';

import React from 'react';
import { Check, XCircle } from 'lucide-react';
import ServicesPanel from '@/components/checkout/OrderOverview/ServicesPanel';
import FormDataPanel from '@/components/checkout/OrderOverview/FormDataPanel';
import { checkIsFormComplete, type LocalCartItem } from '@/components/checkout/OrderOverview/overview-utils';
import type { OrderOverviewProps } from '@/components/checkout/types';

const OrderOverview: React.FC<OrderOverviewProps> = ({
  cart,
  formData,
  totalPrice,
  onFormDataChange,
}) => {
  const typedCart = (cart as unknown as LocalCartItem[]) ?? [];
  const isFormComplete = checkIsFormComplete(formData, cart);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isFormComplete ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <h2 className="text-2xl font-semibold text-gray-900">
            Peržiūrėkite užsakymą
          </h2>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ServicesPanel cart={typedCart} totalPrice={totalPrice} />
        <FormDataPanel formData={formData} onFormDataChange={onFormDataChange} />
      </div>
    </div>
  );
};

export default OrderOverview;