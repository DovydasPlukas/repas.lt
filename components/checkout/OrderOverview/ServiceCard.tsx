'use client';

import React, { useState } from 'react';
import { NotepadText } from 'lucide-react';
import {
  getAddonName,
  getAddonPrice,
  getServiceName,
  serviceTotal,
  type LocalCartItem,
} from '@/components/checkout/OrderOverview/overview-utils';
import TextViewDialog from '@/components/checkout/OrderOverview/TextViewDialog';

interface ServiceCardProps {
  item: LocalCartItem;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reqDialogOpen, setReqDialogOpen] = useState(false);

  const addons = Array.isArray(item.addons) ? item.addons : [];
  const showCount = isExpanded ? addons.length : Math.min(2, addons.length);

  return (
    <>
      <div
        key={index}
        className="rounded border-l-4 border-[--RepasBlue] bg-blue-50 p-3"
      >
        <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
          {/* Left: title + addon names + requirements */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {getServiceName(item)}
            </h4>

            {addons.length > 0 && (
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {addons.slice(0, showCount).map((addon, aIdx) => (
                  <div
                    key={addon.addonId ?? addon.id ?? aIdx}
                    className="truncate"
                  >
                    • {getAddonName(addon)}
                  </div>
                ))}

                {addons.length > 2 && (
                  <button
                    onClick={() => setIsExpanded((v) => !v)}
                    className="mt-1 inline-flex items-center text-xs text-[--RepasBlue] hover:underline"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Mažiau' : `+${addons.length - 2} daugiau`}
                  </button>
                )}
              </div>
            )}

            {item.specialRequirements && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setReqDialogOpen(true)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Peržiūrėti specialius reikalavimus"
                >
                  <NotepadText className="h-4 w-4 text-[--RepasBlue]" />
                </button>
              </div>
            )}
          </div>

          {/* Right: total + addon prices */}
          <div className="flex flex-col items-end">
            <div className="text-lg font-bold text-gray-900">
              €{serviceTotal(item).toFixed(2)}
            </div>

            {addons.length > 0 && (
              <div className="mt-2 flex flex-col items-end gap-1">
                {addons
                  .slice(0, isExpanded ? addons.length : Math.min(2, addons.length))
                  .map((addon, aIdx) => (
                    <div
                      key={addon.addonId ?? addon.id ?? aIdx}
                      className="text-xs font-medium text-gray-700"
                    >
                      €{getAddonPrice(addon).toFixed(2)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TextViewDialog
        open={reqDialogOpen}
        onOpenChange={setReqDialogOpen}
        title={`Specialūs reikalavimai — ${getServiceName(item)}`}
        text={item.specialRequirements || 'Nėra specialių reikalavimų'}
      />
    </>
  );
};

export default ServiceCard;