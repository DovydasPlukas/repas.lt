'use client';

import React from 'react';
import { Check, XCircle } from 'lucide-react';
import { formatDate } from '@/components/checkout/OrderOverview/overview-utils';

interface DateTimeCardProps {
  label: string;
  date?: string;
  time?: string;
}

const DateTimeCard: React.FC<DateTimeCardProps> = ({ label, date, time }) => {
  const isComplete = !!date && !!time;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
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
      </div>
    </div>
  );
};

export default DateTimeCard;