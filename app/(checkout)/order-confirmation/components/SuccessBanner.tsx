import { Check } from 'lucide-react';

export function SuccessBanner() {
  return (
    <section className="bg-white border-b border-gray-200 px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ačiū už jūsų užsakymą!</h1>
        <p className="text-lg text-gray-600">
          Jūsų užsakymas buvo sėkmingai priimtas. Žemiau rasite užsakymo duomenis.
        </p>
      </div>
    </section>
  );
}