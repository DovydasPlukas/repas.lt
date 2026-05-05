'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import AddonTypeGroup from '@/components/checkout/ServiceConfigDialog/AddonTypeGroup';
import RequirementsInput from '@/components/checkout/ServiceConfigDialog/RequirementsInput';
import type { ServiceConfigDialogProps } from '@/components/checkout/types';

const ADDON_TYPE_ORDER = [
  'OPTION',
  'PAPILDOMA_PASLAUGA',
  'PRIEDAI',
];

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
  const groupedAddons = selectedService
    ? Object.groupBy(selectedService.addons, (addon) => addon.type)
    : {};

  const selectedAddonIds = tempAddons.map((a) => a.addonId);

  // Convert + sort groups in required order
  const sortedAddonGroups = Object.entries(groupedAddons).sort(
    ([typeA], [typeB]) => {
      return (
        ADDON_TYPE_ORDER.indexOf(typeA) -
        ADDON_TYPE_ORDER.indexOf(typeB)
      );
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedService?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {selectedService?.addons.length === 0 ? (
            <p className="text-sm text-gray-600">
              Šios paslaugos neturi priedų
            </p>
          ) : (
            sortedAddonGroups.map(([addonType, addons]) =>
              addons ? (
                <AddonTypeGroup
                  key={addonType}
                  addonType={addonType}
                  addons={addons}
                  selectedAddonIds={selectedAddonIds}
                  onAddonToggle={onAddonToggle}
                />
              ) : null
            )
          )}

          <RequirementsInput
            value={tempRequirements}
            onChange={onRequirementsChange}
          />
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