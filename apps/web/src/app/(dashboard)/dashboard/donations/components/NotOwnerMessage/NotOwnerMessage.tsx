export function NotOwnerMessage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-4">Пожертви</h1>
      <p className="text-gray-medium">
        Тільки власник організації може налаштовувати прийом пожертв.
      </p>
    </div>
  );
}
