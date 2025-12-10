'use client';

import React, { useState } from 'react';
import MapComponent from '@/components/map/map-component';
import type { AddressSelectionProps } from '@/components/checkout/types';

interface Location {
  lat: number;
  lng: number;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearchZipCode = async () => {
    if (!formData.zipCode) return;

    setSearchLoading(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
          formData.zipCode
        )}&country=lithuania&format=json&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }

      const data = await response.json();

      if (data.length === 0) {
        setSearchError('ZIP kodas nerastas. Bandykite kitą.');
        setLocation(null);
        return;
      }

      const result = data[0];
      setLocation({
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
      });
      onFormDataChange('latitude', result.lat);
      onFormDataChange('longitude', result.lon);

      const addressData = result.address || {};
      const displayName = result.display_name || '';

      const cityName =
        addressData.city ||
        addressData.town ||
        addressData.village ||
        addressData.municipality ||
        displayName
          .split(', ')
          .find((part: string) => !part.match(/\d{5}/) && part.length > 2)
        || 'Šiauliai';

      onFormDataChange('city', cityName);
    } catch (err) {
      setSearchError('Klaida gaunant vietovę. Bandykite dar kartą.');
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    onFormDataChange('latitude', lat.toString());
    onFormDataChange('longitude', lng.toString());
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Nurodykite adresą
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pašto kodas * 
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onFormDataChange('zipCode', value);
                  }}
                  maxLength={5}
                  placeholder="01000"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
                />
                <button
                  onClick={handleSearchZipCode}
                  disabled={searchLoading || !formData.zipCode}
                  className="rounded-lg bg-[--RepasBlue] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? 'Ieškoma...' : 'Rasti'}
                </button>
              </div>
              {searchError && (
                <p className="mt-2 text-sm text-red-600">{searchError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gatvė *
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) =>
                  onFormDataChange('street', e.target.value)
                }
                placeholder="pvz. Gedimino pr."
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Namo numeris *
              </label>
              <input
                type="text"
                value={formData.houseNumber}
                onChange={(e) =>
                  onFormDataChange('houseNumber', e.target.value)
                }
                placeholder="pvz. 9"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Miestas *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  onFormDataChange('city', e.target.value)
                }
                placeholder="pvz. Vilnius"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pastabos (neprivaloma)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  onFormDataChange('notes', e.target.value)
                }
                placeholder="pvz. Namų durys šiaurinėje pusėje"
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Žemėlapis</h3>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <MapComponent location={location} onMapClick={handleMapClick} />
          </div>
          {location ? (
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-600">Platuma</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {location.lat.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Ilguma</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700 font-medium">
                Prašome nustatyti vietą žemėlapyje arba pasirinkti pašto kodą norėdami gauti koordinates.
              </p>
            </div>
          )}
          <p className="mt-4 text-xs text-gray-600">
            Spauskite žemėlapį arba vilkite žymeklį, kad pakeistumėte vietą
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;