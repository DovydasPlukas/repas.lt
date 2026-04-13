'use client';

import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import type { OrderSummaryProps } from '@/components/checkout/types';

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('lt-LT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  totalPrice,
  formData,
  onEditService,
  onRemoveService,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-6">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        Užsakymo santrauka
      </h3>

      {cart.length === 0 ? (
        <div className="rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800">
          Jūsų krepšelis tuščias
        </div>
      ) : (
        <>
          {/* Services */}
          <div className="mb-6 space-y-3 border-b border-gray-200 pb-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border-l-4 border-[--RepasBlue] bg-blue-50 p-3 rounded"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.serviceName}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditService?.(index)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Redaguoti"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemoveService?.(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Ištrinti"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {item.addons.length > 0 && (
                  <div className="mt-2 ml-2 space-y-1 border-l border-gray-200 pl-3">
                    {item.addons.map((addon, addonIndex) => (
                      <div
                        key={addonIndex}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span>+ {addon.addonName}</span>
                        <span>€{addon.addonPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Priedai:</span>
              <span className="font-medium">€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Pristatymas:</span>
              <span className="font-medium">Nemokamai</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
              <span>Iš viso:</span>
              <span className="text-[--RepasBlue]">€{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Tracking info */}
          {formData && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              {formData.pickupDate && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Paėmimas
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(formData.pickupDate)} {formData.pickupTime}
                  </p>
                </div>
              )}
              {formData.deliveryDate && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Pristatymas
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(formData.deliveryDate)} {formData.deliveryTime}
                  </p>
                </div>
              )}
              {formData.street && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Adresas
                  </p>
                  <p className="text-sm text-gray-900">
                    {formData.street}
                    <br />
                    {formData.apartment} {formData.floor}
                  </p>
                </div>
              )}
              {formData.firstName && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Kontaktai
                  </p>
                  <p className="text-sm text-gray-900">
                    {formData.firstName} {formData.lastName}
                    <br />
                    +370{formData.phone}
                    <br />
                    {formData.email}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderSummary;