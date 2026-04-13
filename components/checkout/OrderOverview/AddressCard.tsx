'use client';

import React, { useState } from 'react';
import { Check, XCircle } from 'lucide-react';
import TextViewDialog from '@/components/checkout/OrderOverview/TextViewDialog';

interface AddressCardProps {
  street?: string;
  apartment?: string;
  floor?: string;
  notes?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  street,
  apartment,
  floor,
  notes,
}) => {
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="mb-2 flex items-center gap-2">
          {street ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <h3 className="text-sm font-medium text-gray-900">Adresas</h3>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Gatvė</span>
            <span className="font-medium text-gray-900">{street}</span>
          </div>
          {apartment && (
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Butas</span>
              <span className="font-medium text-gray-900">{apartment}</span>
            </div>
          )}
          {floor && (
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Aukštas</span>
              <span className="font-medium text-gray-900">{floor}</span>
            </div>
          )}
          {notes && (
            <div className="mt-1 flex items-start justify-between gap-2">
              <p className="text-xs text-gray-600">Pastabos</p>
              <button
                onClick={() => setNotesDialogOpen(true)}
                className="text-xs text-[--RepasBlue] hover:underline rounded"
              >
                Peržiūrėti
              </button>
            </div>
          )}
        </div>
      </div>

      <TextViewDialog
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        title="Pastabos — adresas"
        text={notes || 'Nėra pastabų'}
      />
    </>
  );
};

export default AddressCard;