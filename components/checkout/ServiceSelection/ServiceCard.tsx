'use client';

import React from 'react';
import type { Service } from '@/components/checkout/types';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <button
      onClick={() => onClick(service)}
      className="rounded-lg border-2 border-gray-200 p-4 text-left transition-all hover:border-[--RepasBlue] hover:bg-blue-50"
    >
      <h4 className="font-semibold text-gray-900">{service.name}</h4>
      {service.description && (
        <p className="text-xs text-gray-600 mt-1">{service.description}</p>
      )}
      {service.addons.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {service.addons.length} priedai
        </p>
      )}
    </button>
  );
};

export default ServiceCard;