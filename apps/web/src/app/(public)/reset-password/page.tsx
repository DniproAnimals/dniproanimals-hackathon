import { ResetPasswordClient } from "./ResetPasswordClient";

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const sp = await searchParams;
  const token = sp.token;

  if (!token || typeof token !== "string") {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Помилка доступу</h1>
        <p className="text-sm text-gray-medium">
          Відсутнє або недійсне посилання для відновлення.
        </p>
      </div>
    );
  }

  return <ResetPasswordClient token={token} />;
}
