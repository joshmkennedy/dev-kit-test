export async function fetchCopyMap(locale: string): Promise<Record<string, string>> {
  const res = await fetch(`/api/copy?locale=${locale}`);
  return res.json();
}
