'use client';

import React from 'react';
import RequiredFieldLabel from '@/components/checkout/RequiredFieldLabel';

interface TimeSlotSelectProps {
  label: string;
  date: string;
  time: string;
  minDate: string;
  dateHint: string;
  timeRanges: string[];
  isTimeDisabled: (time: string) => boolean;
  isTimeEmpty: boolean;
  timeEmptyMessage: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

const TimeSlotSelect: React.FC<TimeSlotSelectProps> = ({
  label,
  date,
  time,
  minDate,
  dateHint,
  timeRanges,
  isTimeDisabled,
  isTimeEmpty,
  timeEmptyMessage,
  onDateChange,
  onTimeChange,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{label}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <RequiredFieldLabel>Data</RequiredFieldLabel>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={minDate}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">{dateHint}</p>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <RequiredFieldLabel>Laikas</RequiredFieldLabel>
          </label>
          <select
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
          >
            <option value="">Pasirinkite laiko sritį</option>
            {timeRanges.map((range) => (
              <option
                key={range}
                value={range}
                disabled={isTimeDisabled(range)}
              >
                {range} {isTimeDisabled(range) ? '— užimta' : ''}
              </option>
            ))}
          </select>
          {isTimeEmpty && (
            <p className="mt-2 text-sm text-red-600">{timeEmptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelect;
