'use client';

import React from 'react';
import type { Addon } from '@/components/checkout/types';

const ADDON_TYPE_LABELS: Record<string, string> = {
  PAPILDOMA_PASLAUGA: 'Papildomos paslaugos',
  PRIEDAI: 'Priedai',
};

interface AddonTypeGroupProps {
  addonType: string;
  addons: Addon[];
  selectedAddonIds: string[];
  onAddonToggle: (addon: Addon) => void;
}

const AddonTypeGroup: React.FC<AddonTypeGroupProps> = ({
  addonType,
  addons,
  selectedAddonIds,
  onAddonToggle,
}) => {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-gray-900">
        {ADDON_TYPE_LABELS[addonType] ?? addonType}
      </h3>
      <div className="space-y-2 ml-2">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <label
              key={addon.id}
              className="flex items-center gap-3 rounded p-3 border border-gray-200 cursor-pointer hover:bg-blue-50"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onAddonToggle(addon)}
                className="h-4 w-4 rounded border-gray-300 text-[--RepasBlue]"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{addon.name}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                €{addon.price.toFixed(2)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AddonTypeGroup;