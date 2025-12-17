'use client';

import React, { useState, useEffect, useRef } from 'react';
import MapComponent from '@/components/map/map-component';
import AddressAutocomplete from '@/components/map/address-autocomplete';
import type { AddressSelectionProps } from '@/components/checkout/types';

interface Location {
  lat: number;
  lng: number;
}

interface AddressSuggestion {
  name: string;
  latitude: number;
  longitude: number;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Prevent double fetch in React Strict Mode
  const hasFetched = useRef(false);

  // Load existing address ONCE
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadAddress = async () => {
      try {
        const response = await fetch('/api/user-address', {
          method: 'GET',
        });

        const result = await response.json();

        if (result?.data) {
          onFormDataChange('street', result.data.street || '');
          onFormDataChange('apartment', result.data.apartment || '');
          onFormDataChange('floor', result.data.floor || '');
          onFormDataChange('latitude', result.data.latitude || '');
          onFormDataChange('longitude', result.data.longitude || '');

          if (result.data.latitude && result.data.longitude) {
            setLocation({
              lat: parseFloat(result.data.latitude),
              lng: parseFloat(result.data.longitude),
            });
          }
        }
      } catch (err) {
        console.error('Failed to load address:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddress();
  }, [onFormDataChange]);

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setLocation({
      lat: suggestion.latitude,
      lng: suggestion.longitude,
    });

    onFormDataChange('street', suggestion.name);
    onFormDataChange('latitude', suggestion.latitude.toString());
    onFormDataChange('longitude', suggestion.longitude.toString());
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    onFormDataChange('latitude', lat.toString());
    onFormDataChange('longitude', lng.toString());
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Nurodykite adresą
        </h2>

        <div className="rounded-lg border border-gray-200 p-6">
          <p className="text-center text-gray-600">
            Kraunami adreso duomenys...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Nurodykite adresą
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Adreso informacija
            </h3>

            {/* Address Autocomplete */}
            <AddressAutocomplete
              value={formData.street}
              onChange={(value) => onFormDataChange('street', value)}
              onSelect={handleAddressSelect}
            />

            {/* Apartment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Buto numeris
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) =>
                  onFormDataChange('apartment', e.target.value)
                }
                placeholder="pvz. 5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>

            {/* Floor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Aukštas
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => onFormDataChange('floor', e.target.value)}
                placeholder="pvz. 2"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pastabos (neprivaloma)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => onFormDataChange('notes', e.target.value)}
                placeholder="pvz. Namų durys šiaurinėje pusėje"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Žemėlapis
          </h3>

          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
            <MapComponent location={location} onMapClick={handleMapClick} />
          </div>

          {location ? (
            <>
              <p className="mb-4 text-center text-sm text-gray-600">
                Spauskite žemėlapį arba vilkite žymeklį, kad pakeistumėte vietą
              </p>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="mb-1 text-xs text-gray-600">Platuma</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {location.lat.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-600">Ilguma</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-700">
                Pradėkite rašyti adresą, kad pamatytumėte pasiūlymus ir vietą
                žemėlapyje
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;