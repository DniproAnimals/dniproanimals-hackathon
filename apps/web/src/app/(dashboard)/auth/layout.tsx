import { OnlyUnauthorized } from "@/shared/components/OnlyUnauthorized";
import Image from "next/image";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <OnlyUnauthorized>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/logo.jpg"
              alt="DniproAnimals"
              width={48}
              height={48}
              className="rounded-full object-cover mb-3"
            />
          </div>
          {children}
        </div>
      </div>
    </OnlyUnauthorized>
  );
}
