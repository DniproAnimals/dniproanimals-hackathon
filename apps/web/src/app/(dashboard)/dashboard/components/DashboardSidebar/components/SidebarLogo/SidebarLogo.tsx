import Image from "next/image";
import Link from "next/link";

export function SidebarLogo() {
  return (
    <div className="p-5 border-b border-gray-border/60">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.jpg"
          alt="DniproAnimals"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <span className="font-bold text-foreground text-sm">DniproAnimals</span>
      </Link>
    </div>
  );
}
