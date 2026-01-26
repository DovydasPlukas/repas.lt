import { Suspense, ReactNode } from "react";

interface AuthSuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

const DefaultLoader = ({ message = "Kraunasi..." }: { message?: string }) => (
  <main className="flex items-center justify-center">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
        <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  </main>
);

export const AuthSuspenseBoundary = ({
  children,
  fallback,
  message = "Kraunasi...",
}: AuthSuspenseBoundaryProps) => {
  return (
    <Suspense fallback={fallback || <DefaultLoader message={message} />}>
      {children}
    </Suspense>
  );
};