import Link from 'next/link';

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-700 font-medium">{message}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
        >
          Grįžti į pradžią
        </Link>
      </div>
    </main>
  );
}

export function NotFoundState() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-700 font-medium">Užsakymas nerastas</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
        >
          Grįžti į pradžią
        </Link>
      </div>
    </main>
  );
}