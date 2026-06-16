export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-border shadow-sm">
        {children}
      </div>
    </div>
  );
}
