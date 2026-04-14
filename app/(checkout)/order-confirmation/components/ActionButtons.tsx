import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ActionButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/order"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium transition-all"
      >
        Peržiūrėti mano užsakymus
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="/paslaugos"
        className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
      >
        Grįžti į paslaugas
      </Link>
    </div>
  );
}