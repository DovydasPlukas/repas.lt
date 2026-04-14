export function LoadingState() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-600">Kraunami užsakymo duomenys...</p>
      </div>
    </main>
  );
}