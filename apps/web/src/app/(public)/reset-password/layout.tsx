import { ReactNode } from "react";

export default function ResetPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      {children}
    </div>
  );
}
