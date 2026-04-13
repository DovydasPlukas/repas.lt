'use client';

import React from 'react';
import type { ContactsInfoProps } from '@/components/checkout/types';

const ContactsInfo: React.FC<ContactsInfoProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    onFormDataChange('phone', digits);
  };

  const isValidPhoneNumber = formData.phone.length === 8;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '');

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Jūsų kontaktinė informacija
      </h2>

      <div className="rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              El. paštas *
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onFormDataChange('email', e.target.value)}
              placeholder="pvz. jonas@example.com"
              className="mt-2 w-full max-w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
            />
            {formData.email && !isValidEmail && (
              <p className="mt-2 text-sm text-red-600">
                Neteisingas el. pašto formatas
              </p>
            )}
            {formData.email && isValidEmail && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {formData.email}
              </p>
            )}
          </div>

          {/* First & Last name */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vardas *
              </label>
              <input
                type="text"
                value={formData.firstName}
                maxLength={50}
                onChange={(e) => onFormDataChange('firstName', e.target.value)}
                placeholder="pvz. Jonas"
                className="mt-2 w-full max-w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pavardė *
              </label>
              <input
                type="text"
                value={formData.lastName}
                maxLength={50}
                onChange={(e) => onFormDataChange('lastName', e.target.value)}
                placeholder="pvz. Jonaitis"
                className="mt-2 w-full max-w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefonas *
            </label>
            <div className="mt-2 flex items-center rounded-lg border border-gray-300 bg-white min-w-0 overflow-hidden">
              <span className="px-4 py-2 font-medium text-gray-700 shrink-0">
                +370
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="600 00000"
                maxLength={8}
                className="flex-1 min-w-0 w-full max-w-full border-0 px-2 py-2 focus:outline-none"
              />
            </div>
            {formData.phone && !isValidPhoneNumber && (
              <p className="mt-2 text-sm text-red-600">
                Telefonas turi turėti 8 skaitmenis
              </p>
            )}
            {formData.phone && isValidPhoneNumber && (
              <p className="mt-2 text-sm text-green-600">
                ✓ +370{formData.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsInfo;
