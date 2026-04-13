'use client';

/**
 * the navigation buttons below the form on desktop, and the fixed bottom bar on mobile.
 * Atgal/Toliau/Baigti buttons.
 */

import React from 'react';

interface CheckoutNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isProcessing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  currentStep, totalSteps, canProceed, isProcessing, onPrev, onNext, onSubmit,
}) => {
  const isLastStep = currentStep === totalSteps;
  const submitLabel = isProcessing ? 'Apdorojimas...' : 'Baigti užsakymą';

  return (
    <>
      {/* Desktop nav — inline below the form */}
      <div className="mt-8 hidden gap-4 sm:flex sm:justify-between">
        <div>
          {currentStep > 1 && (
            <button onClick={onPrev} className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100">
              Atgal
            </button>
          )}
        </div>
        {isLastStep ? (
          <button onClick={onSubmit} disabled={isProcessing || !canProceed} className="rounded-lg bg-[--RepasBlue] px-8 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {submitLabel}
          </button>
        ) : (
          <button onClick={onNext} disabled={!canProceed} className="rounded-lg bg-[--RepasBlue] px-8 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            Toliau
          </button>
        )}
      </div>

      {/* Spacer so content clears the fixed mobile bar */}
      <div className="h-24 sm:hidden" />

      {/* Mobile nav — fixed to bottom of screen */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-4 pb-[env(safe-area-inset-bottom,8px)] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:hidden">
        <div className="mx-auto mb-3 flex max-w-md gap-3">
          {currentStep > 1 && (
            <button onClick={onPrev} className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-gray-300 text-base font-medium text-gray-700 active:bg-gray-100">
              Atgal
            </button>
          )}
          {isLastStep ? (
            <button onClick={onSubmit} disabled={isProcessing || !canProceed} className="flex min-h-[48px] flex-[2] items-center justify-center rounded-xl bg-[--RepasBlue] text-base font-semibold text-white active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {submitLabel}
            </button>
          ) : (
            <button onClick={onNext} disabled={!canProceed} className={`flex min-h-[48px] items-center justify-center rounded-xl bg-[--RepasBlue] text-base font-semibold text-white active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${currentStep > 1 ? 'flex-[2]' : 'w-full flex-1'}`}>
              Toliau
            </button>
          )}
        </div>
      </div>
    </>
  );
};
