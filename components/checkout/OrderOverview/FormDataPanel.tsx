'use client';

import React from 'react';
import DateTimeCard from '@/components/checkout/OrderOverview/DateTimeCard';
import AddressCard from '@/components/checkout/OrderOverview/AddressCard';
import ContactsCard from '@/components/checkout/OrderOverview/ContactsCard';
import PaymentCard from '@/components/checkout/OrderOverview/PaymentCard';
import type { OrderOverviewProps } from '@/components/checkout/types';

interface FormDataPanelProps {
  formData: OrderOverviewProps['formData'];
  onFormDataChange?: (field: string, value: string) => void;
}

const FormDataPanel: React.FC<FormDataPanelProps> = ({
  formData,
  onFormDataChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Pickup & Delivery side by side */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <DateTimeCard
          label="Paėmimas"
          date={formData?.pickupDate}
          time={formData?.pickupTime}
        />
        <DateTimeCard
          label="Pristatymas"
          date={formData?.deliveryDate}
          time={formData?.deliveryTime}
        />
      </div>

      <AddressCard
        street={formData?.street}
        apartment={formData?.apartment}
        floor={formData?.floor}
        notes={formData?.notes}
      />

      <ContactsCard
        firstName={formData?.firstName}
        lastName={formData?.lastName}
        phone={formData?.phone}
        email={formData?.email}
      />

      <PaymentCard
        paymentMethod={formData?.paymentMethod}
        onPaymentMethodChange={(method) =>
          onFormDataChange?.('paymentMethod', method)
        }
      />
    </div>
  );
};

export default FormDataPanel;