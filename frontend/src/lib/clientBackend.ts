export async function clientBackendJson<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const normalized = path.replace(/^\//, "");
  const response = await fetch(`/api/backend/${normalized}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function clientBackendFetch(path: string, options: RequestInit = {}) {
  const normalized = path.replace(/^\//, "");
  return fetch(`/api/backend/${normalized}`, options);
}
