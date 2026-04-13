'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface TextViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text: string;
}

const TextViewDialog: React.FC<TextViewDialogProps> = ({
  open,
  onOpenChange,
  title,
  text,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-lg max-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="text-sm">{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[48vh] overflow-y-auto py-2 text-sm text-gray-700 break-words whitespace-pre-wrap">
          {text}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
          >
            Uždaryti
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TextViewDialog;