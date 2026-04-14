import Link from 'next/link';

type Props = {
  message: string;
};

export function ErrorState({ message }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-700 font-medium">{message}</p>
        </div>
        <Link
          href="/prisijungimas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
        >
          Prisijungti
        </Link>
      </div>
    </main>
  );
}
