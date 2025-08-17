export const getApiUrl = () => {
  if (typeof window === "undefined") {
    return process.env.API_URL_INTERNAL!;
  }
  return process.env.NEXT_PUBLIC_API_URL!;
};

export async function fetchJson<T>(
  url: string,
  errorDescription?: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(getApiUrl() + url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `${errorDescription ?? "Request failed"}: ${res.status} ${
        res.statusText
      } - ${text}`
    );
  }
  return res.json() as Promise<T>;
}
