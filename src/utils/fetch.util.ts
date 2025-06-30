export async function fetchGet<T>(url: string, headers?: Record<string, string>): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers || {},
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}