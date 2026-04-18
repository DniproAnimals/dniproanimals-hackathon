export function parseJarId(url: string): string | null {
  const match = url.trim().match(/send\.monobank\.ua\/jar\/([A-Za-z0-9]+)/);
  return match ? match[1]! : null;
}
