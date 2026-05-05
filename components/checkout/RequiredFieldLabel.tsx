'use client';

import React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';

interface RequiredFieldLabelProps {
  children: React.ReactNode;
  tooltipText?: string;
}

const RequiredFieldLabel: React.FC<RequiredFieldLabelProps> = ({
  children,
  tooltipText = 'Privalomas laukas',
}) => {
  return (
    <span>
      {children}{' '}
      <HoverCard openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <span className="text-red-500">*</span>
        </HoverCardTrigger>
        <HoverCardContent side='right' className="w-auto p-2 text-xs font-medium">
          {tooltipText}
        </HoverCardContent>
      </HoverCard>
    </span>
  );
};

export default RequiredFieldLabel;
