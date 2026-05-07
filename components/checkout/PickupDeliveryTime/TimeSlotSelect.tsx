'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getUpcomingDates } from './time-utils';
import RequiredFieldLabel from '@/components/checkout/RequiredFieldLabel';

const Chevron = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}>
    <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckWhite = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Ring = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" stroke="#D1D5DB" strokeWidth="1.5" />
  </svg>
);

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return { open, toggle: () => setOpen(o => !o), close: () => setOpen(false), ref };
}

interface TimeSlotSelectProps {
  label: string;
  date: string;
  time: string;
  /** YYYY-MM-DD — earliest selectable date */
  minDate: string;
  dateHint?: string;
  timeRanges: string[];
  isTimeDisabled: (time: string) => boolean;
  isTimeEmpty: boolean;
  timeEmptyMessage: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  /** If true, auto-selects first available date+time on mount*/
  autoSelectDefault?: boolean;
}

export default function TimeSlotSelect({
  label, date, time, minDate, dateHint,
  timeRanges, isTimeDisabled, isTimeEmpty, timeEmptyMessage,
  onDateChange, onTimeChange, autoSelectDefault,
}: TimeSlotSelectProps) {
  const dayDd = useDropdown();
  const timeDd = useDropdown();

  const dateOptions = getUpcomingDates(minDate, 14);
  const availableTimes = timeRanges.filter(r => !isTimeDisabled(r));
  const noTimesAvailable = timeRanges.length > 0 && availableTimes.length === 0;

  // Auto-select first date + first available time on mount
  useEffect(() => {
    if (!autoSelectDefault) return;
    if (!date && dateOptions.length > 0) onDateChange(dateOptions[0].value);
    if (!time && availableTimes.length > 0) onTimeChange(availableTimes[0]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedDateLabel = dateOptions.find(o => o.value === date)?.label ?? '';

  const triggerCls = (open: boolean) =>
    `w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white text-sm border rounded-lg cursor-pointer transition-all ${
      open ? 'border-[--RepasBlue] ring-2 ring-[--RepasBlue]/10 outline-none' : 'border-gray-200 hover:border-gray-400'
    }`;

  const menuCls = (open: boolean) =>
    `absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg z-10 shadow-md transition-all duration-200 ${
      open ? 'max-h-60 opacity-100 pointer-events-auto overflow-y-auto' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
    }`;

  const itemCls = (selected: boolean, disabled?: boolean) =>
    `flex items-center justify-between px-3 py-2.5 text-sm border-b border-gray-50 last:border-0 transition-colors ${
      selected ? 'bg-[--RepasBlue] text-white font-medium'
        : disabled ? 'text-gray-300 cursor-not-allowed'
        : 'cursor-pointer text-gray-800 hover:bg-gray-50'
    }`;

  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">{label}</h3>
      <div className="grid gap-3 md:grid-cols-2">

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            <RequiredFieldLabel>Data</RequiredFieldLabel>
          </label>
          <div className="relative" ref={dayDd.ref}>
            <button type="button" className={triggerCls(dayDd.open)} onClick={dayDd.toggle}>
              <span className={`truncate ${selectedDateLabel ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedDateLabel || 'Pasirinkite dieną'}
              </span>
              <Chevron open={dayDd.open} />
            </button>
            <div className={menuCls(dayDd.open)}>
              {dateOptions.map(opt => (
                <div key={opt.value} role="option" aria-selected={opt.value === date}
                  className={itemCls(opt.value === date)}
                  onClick={() => { onDateChange(opt.value); onTimeChange(''); dayDd.close(); }}>
                  {opt.label}
                  {opt.value === date ? <CheckWhite /> : <Ring />}
                </div>
              ))}
            </div>
          </div>
          {dateHint && <p className="mt-1 text-xs text-gray-400">{dateHint}</p>}
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            <RequiredFieldLabel>Laikas</RequiredFieldLabel>
          </label>
          {noTimesAvailable ? (
            <p className="mt-2 text-sm text-gray-400 italic">Nėra laisvų laikų</p>
          ) : (
            <div className="relative" ref={timeDd.ref}>
              <button type="button" className={triggerCls(timeDd.open)} onClick={timeDd.toggle}>
                <span className={`truncate ${time ? 'text-gray-900' : 'text-gray-400'}`}>
                  {time || 'Pasirinkite laiką'}
                </span>
                <Chevron open={timeDd.open} />
              </button>
              <div className={menuCls(timeDd.open)}>
                {timeRanges.map(range => {
                  const disabled = isTimeDisabled(range);
                  return (
                    <div key={range} role="option" aria-selected={range === time} aria-disabled={disabled}
                      className={itemCls(range === time, disabled)}
                      onClick={() => { if (!disabled) { onTimeChange(range); timeDd.close(); } }}>
                      <span className="flex items-center gap-2">
                        {range}
                        {disabled && (
                          <span className="text-xs font-medium text-red-400 bg-red-50 border border-red-100 rounded px-1.5 py-0.5">
                            Užimta
                          </span>
                        )}
                      </span>
                      {range === time ? <CheckWhite /> : !disabled ? <Ring /> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isTimeEmpty && <p className="mt-1.5 text-xs text-red-500">{timeEmptyMessage}</p>}
        </div>
      </div>
    </div>
  );
}