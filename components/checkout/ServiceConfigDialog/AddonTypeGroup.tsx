'use client';

import React, { useState } from 'react';
import type { Addon } from '@/components/checkout/types';

const ADDON_TYPE_LABELS: Record<string, string> = {
  OPTION: 'Pasirinkimas',
  PAPILDOMA_PASLAUGA: 'Papildomos paslaugos',
  PRIEDAI: 'Priedai',
};

interface AddonTypeGroupProps {
  addonType: string;
  addons: Addon[];
  selectedAddonIds: string[];
  selectedAddonData?: Array<{ addonId: string; addonQty?: number; addonUnit?: string; addonPrice?: number }>;
  onAddonToggle: (addon: Addon, action?: 'toggle' | 'update' | 'remove', qty?: number, unit?: string) => void;
}

// Helpers 
function resolvePrice(addon: Addon, inputValue: number): number {
  if (!addon.optionPricingType || addon.optionPricingType === 'FIXED') return addon.price;
  if (addon.optionPricingType === 'QUANTITY') return Math.max(0, inputValue) * addon.price;
  if (addon.optionPricingType === 'RANGE' && addon.ranges) {
    const match = addon.ranges.find(
      (r) => inputValue >= r.minQty && inputValue <= r.maxQty
    );
    return match ? Number(match.price) : 0;
  }
  return addon.price;
}

function rangeHint(addon: Addon): string {
  if (addon.optionPricingType !== 'RANGE' || !addon.ranges?.length) return '';
  return addon.ranges
    .map((r) => `${r.minQty}–${r.maxQty}: ${Number(r.price).toFixed(2)}€`)
    .join(' · ');
}

// Sub-components 

function FixedAddonRow({
  addon,
  isSelected,
  onToggle,
}: {
  addon: Addon;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded p-3 border border-gray-200 cursor-pointer hover:bg-blue-50">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="h-4 w-4 rounded border-gray-300 text-[--RepasBlue]"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{addon.name}</p>
      </div>
      <span className="text-sm font-semibold text-gray-900">{addon.price.toFixed(2)}€</span>
    </label>
  );
}

function QuantityAddonRow({
  addon,
  isSelected,
  initialQty = 0,
  onAddonToggle,
}: {
  addon: Addon;
  isSelected: boolean;
  initialQty?: number;
  onAddonToggle: (addon: Addon, action?: 'toggle' | 'update' | 'remove', qty?: number, unit?: string) => void;
}) {
  const MAX_QTY = 100;
  const [qty, setQty] = useState<number>(isSelected ? (initialQty || 1) : 0);

  const calculatedPrice = qty > 0 ? qty * addon.price : 0;

  const handleChange = (newQty: number) => {
    const clamped = Math.min(MAX_QTY, Math.max(0, newQty));
    setQty(clamped);
    const modified: Addon = { ...addon, price: clamped > 0 ? clamped * addon.price : 0 };
    if (clamped === 0) {
      onAddonToggle(modified, 'remove');
    } else {
      onAddonToggle(modified, 'update', clamped, 'vnt.');
    }
  };

  return (
    <div className="rounded p-3 border border-gray-200">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-gray-900">{addon.name}</p>
        <span className="text-sm font-semibold text-gray-900 shrink-0">
          {qty > 0 ? `€${calculatedPrice.toFixed(2)}` : `${addon.price.toFixed(2)}€ / vnt.`}
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center">
        <button
          type="button"
          className="w-7 h-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg leading-none rounded-r-none border-r-0"
          onClick={() => handleChange(qty - 1)}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          max={MAX_QTY}
          value={qty}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-14 h-7 text-center text-sm border border-gray-300 rounded px-1 py-0.5"
        />
        <button
          type="button"
          className="w-7 h-7 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg leading-none rounded-l-none border-l-0"
          onClick={() => handleChange(qty + 1)}
        >
          +
        </button>
        </div>
        <span className="text-xs text-gray-500 ml-1">vnt.</span>
      </div>
    </div>
  );
}

function RangeAddonRow({
  addon,
  isSelected,
  initialValue = 0,
  onAddonToggle,
}: {
  addon: Addon;
  isSelected: boolean;
  initialValue?: number;
  onAddonToggle: (addon: Addon, action?: 'toggle' | 'update' | 'remove', qty?: number, unit?: string) => void;
}) {
  const MAX_KG = addon.ranges?.length
    ? Math.max(...addon.ranges.map((r) => r.maxQty))
    : 200;

  const [value, setValue] = useState<number>(isSelected ? (initialValue || 0) : 0);

  const matchedPrice = resolvePrice(addon, value);
  const hasMatch = value > 0 && matchedPrice > 0;
  const noMatch = value > 0 && matchedPrice === 0;

  const handleChange = (newVal: number) => {
    const clamped = Math.min(MAX_KG, Math.max(0, newVal));
    setValue(clamped);
    const price = resolvePrice(addon, clamped);
    const modified: Addon = { ...addon, price };
    if (clamped === 0) {
      onAddonToggle(modified, 'remove');
    } else if (price > 0) {
      onAddonToggle(modified, 'update', clamped, 'kg');
    }
    // noMatch: leave cart untouched
  };

  return (
    <div className="rounded p-3 border border-gray-200">
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="text-sm font-medium text-gray-900">{addon.name}</p>
        <span
          className={`text-sm font-semibold shrink-0 ${
            hasMatch ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {hasMatch ? `€${matchedPrice.toFixed(2)}` : '—'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{rangeHint(addon)}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={MAX_KG}
          value={value || ''}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder="0"
          className="w-20 text-center text-sm border border-gray-300 rounded px-2 py-0.5"
        />
        <span className="text-xs text-gray-500">kg</span>
        {noMatch && (
          <span className="text-xs text-red-500 ml-1">Intervalas nerastas</span>
        )}
      </div>
    </div>
  );
}

// Main component 

const AddonTypeGroup: React.FC<AddonTypeGroupProps> = ({
  addonType,
  addons,
  selectedAddonIds,
  selectedAddonData = [],
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
          const savedData = selectedAddonData.find((a) => a.addonId === addon.id);

          // Dynamic OPTION addons get specialised rows
          if (addonType === 'OPTION') {
            if (addon.optionPricingType === 'QUANTITY') {
              return (
                <QuantityAddonRow
                  key={addon.id}
                  addon={addon}
                  isSelected={isSelected}
                  initialQty={savedData?.addonQty}
                  onAddonToggle={onAddonToggle}
                />
              );
            }
            if (addon.optionPricingType === 'RANGE') {
              return (
                <RangeAddonRow
                  key={addon.id}
                  addon={addon}
                  isSelected={isSelected}
                  initialValue={savedData?.addonQty}
                  onAddonToggle={onAddonToggle}
                />
              );
            }
          }

          // FIXED / PAPILDOMA_PASLAUGA / PRIEDAI — checkbox
          return (
            <FixedAddonRow
              key={addon.id}
              addon={addon}
              isSelected={isSelected}
              onToggle={() => onAddonToggle(addon, 'toggle')}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddonTypeGroup;