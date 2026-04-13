'use client';

import React from 'react';
import { Check, XCircle } from 'lucide-react';

interface ContactsCardProps {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

const ContactsCard: React.FC<ContactsCardProps> = ({
  firstName,
  lastName,
  phone,
  email,
}) => {
  const isComplete = !!firstName && !!lastName && !!phone;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center gap-2">
        {isComplete ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <h3 className="text-sm font-medium text-gray-900">Kontaktai</h3>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Vardas</span>
          <span className="font-medium text-gray-900">{firstName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Pavardė</span>
          <span className="font-medium text-gray-900">{lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Telefonas</span>
          <span className="font-medium text-gray-900">+370 {phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">El. paštas</span>
          <span className="font-medium text-gray-900">{email}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactsCard;