export function AnimalDescription({ text }: { text: string }) {
  return (
    <div className="mt-5">
      <h2 className="text-sm font-semibold mb-2">Інформація</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}
