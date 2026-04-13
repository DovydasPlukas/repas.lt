'use client';

import React from 'react';

interface RequirementsInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RequirementsInput: React.FC<RequirementsInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        Specialūs reikalavimai
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Įveskite specialius reikalavimus šiai paslaugai..."
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[--RepasBlue] focus:outline-none"
      />
    </div>
  );
};

export default RequirementsInput;