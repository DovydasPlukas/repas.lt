import { Suspense } from 'react';
import CheckoutPage from '@/app/paslaugos/checkout-page';

import { getPageMetadata } from "@/app/metadata";
export const metadata = getPageMetadata("/paslaugos");

const PaslaugosPage = () => {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Kraunasi paslaugos...</p>
        </div>
      </main>
    }>
      <CheckoutPage />
    </Suspense>
  );
}

export default PaslaugosPage
