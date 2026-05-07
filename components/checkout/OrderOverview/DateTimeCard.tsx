'use client';

import React from 'react';
import { Check, XCircle } from 'lucide-react';
import { formatDate } from '@/components/checkout/OrderOverview/overview-utils';

interface DateTimeCardProps {
  label: string;
  date?: string;
  time?: string;
  isConflict?: boolean;
}

const DateTimeCard: React.FC<DateTimeCardProps> = ({ label, date, time, isConflict = false }) => {
  const isComplete = !!date && !!time && !isConflict;

  return (
    <div className={`rounded-lg border p-4 ${isConflict ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <div className="mb-2 flex items-center gap-2">
        {isComplete ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      </div>
      <div className="text-sm text-gray-700">
        <div>
          <p className="text-xs text-gray-600">Data</p>
          <p className="font-medium">{formatDate(date)}</p>
        </div>
        <div className="mt-1">
          <p className="text-xs text-gray-600">Laikas</p>
          <p className="font-medium">{time}</p>
        </div>
        {isConflict && (
          <p className="mt-2 text-xs text-red-600 font-medium">Laikas užimtas — pasirinkite kitą</p>
        )}
      </div>
    </div>
  );
};

export default DateTimeCard;