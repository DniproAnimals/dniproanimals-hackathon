import Link from "next/link";

export function OrganizationNotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <p className="text-lg font-semibold mb-2">Організацію не знайдено</p>
      <Link
        href="/organizations"
        className="text-sm text-green-secondary hover:underline"
      >
        ← Повернутися до списку
      </Link>
    </div>
  );
}
