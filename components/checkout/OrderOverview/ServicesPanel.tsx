'use client';

import React, { useState } from 'react';
import ServiceCard from '@/components/checkout/OrderOverview/ServiceCard';
import type { LocalCartItem } from '@/components/checkout/OrderOverview/overview-utils';

interface ServicesPanelProps {
  cart: LocalCartItem[];
  totalPrice: number;
}

const ServicesPanel: React.FC<ServicesPanelProps> = ({ cart, totalPrice }) => {
  const [showAllServices, setShowAllServices] = useState(false);

  const displayedServices = showAllServices ? cart : cart.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Services list */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">Paslaugos</h3>
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-600">Jūs dar nepridėjote paslaugų</p>
        ) : (
          <div className="space-y-3">
            {displayedServices.map((item, index) => (
              <ServiceCard key={index} item={item} index={index} />
            ))}

            {cart.length > 3 && (
              <div className="pt-1">
                <button
                  onClick={() => setShowAllServices((s) => !s)}
                  className="text-sm text-[--RepasBlue] hover:underline"
                >
                  {showAllServices
                    ? 'Rodyti mažiau'
                    : `Rodyti viską (${cart.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total price */}
      <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-900">Bendras kainą:</span>
          <span className="text-2xl font-extrabold text-[--RepasBlue]">
            €{(totalPrice ?? 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServicesPanel;