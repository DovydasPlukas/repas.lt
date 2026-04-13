'use client';

/**
 * the stepper component, with the mobile (label + segmented progress) and desktop (numbered steps with connectors) UIs.
 */

import React from 'react';

interface Step { id: number; label: string; }

interface CheckoutStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (id: number) => void;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ steps, currentStep, onStepClick }) => {
  const goTo = (id: number) => { if (id <= currentStep) onStepClick(id); };

  return (
    <>
      {/* Mobile: label + segmented progress bar */}
      <section className="border-b border-gray-200 bg-white px-4 py-4 sm:hidden">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{steps[currentStep - 1].label}</span>
            <span className="text-xs font-medium text-gray-500">{currentStep} / {steps.length}</span>
          </div>
          <div className="flex gap-1.5">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goTo(step.id)}
                disabled={step.id > currentStep}
                aria-label={`${step.label} - ${step.id < currentStep ? 'baigta' : step.id === currentStep ? 'dabartinis' : 'laukia'}`}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step.id === currentStep ? 'bg-[--RepasBlue]'
                  : step.id < currentStep ? 'cursor-pointer bg-green-500'
                  : 'cursor-not-allowed bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop: numbered circle steps with connectors */}
      <section className="hidden border-b border-gray-200 bg-white px-6 py-8 sm:block">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goTo(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${
                    step.id === currentStep ? 'border-[--RepasBlue] bg-[--RepasBlue] text-white'
                    : step.id < currentStep ? 'cursor-pointer border-green-500 bg-green-500 text-white hover:bg-green-600'
                    : 'cursor-not-allowed border-gray-300 bg-white text-gray-300'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </button>
                <span className={`ml-2 hidden text-sm font-medium sm:inline ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-2 h-1 w-8 lg:w-12 ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
