'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { ServiceConfigDialogProps } from '@/components/checkout/types';

const ServiceConfigDialog: React.FC<ServiceConfigDialogProps> = ({
  open,
  onOpenChange,
  selectedService,
  tempAddons,
  tempRequirements,
  editingCartIndex,
  onAddonToggle,
  onRequirementsChange,
  onConfirm,
}) => {
  // Map addon type codes to display names
  const addonTypeLabels: Record<string, string> = {
    'PAPILDOMA_PASLAUGA': 'Papildomos paslaugos',
    'PRIEDAI': 'Priedai',
  };

  // Group addons by type
  const groupedAddons = selectedService
    ? Object.groupBy(selectedService.addons, (addon) => addon.type)
    : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedService?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Addons grouped by type */}
          {selectedService?.addons.length === 0 ? (
            <p className="text-sm text-gray-600">Šios paslaugos neturi priedų</p>
          ) : (
            Object.entries(groupedAddons).map(([addonType, addons]) => (
              <div key={addonType}>
                <h3 className="mb-3 font-semibold text-gray-900">
                  {addonTypeLabels[addonType] || addonType}
                </h3>
                <div className="space-y-2 ml-2">
                  {addons?.map((addon) => {
                    const isSelected = tempAddons.some(
                      (a) => a.addonId === addon.id
                    );
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
                          <p className="text-sm font-medium text-gray-900">
                            {addon.name}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          €{addon.price.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Special Requirements Textarea */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Specialūs reikalavimai
            </label>
            <textarea
              value={tempRequirements}
              onChange={(e) => onRequirementsChange(e.target.value)}
              placeholder="Įveskite specialius reikalavimus šiai paslaugai..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[--RepasBlue] focus:outline-none"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
          >
            Atšaukti
          </button>
          <button
            onClick={onConfirm}
            disabled={tempAddons.length === 0}
            className="px-4 py-2 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingCartIndex !== null ? 'Atnaujinti' : 'Pridėti'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceConfigDialog;