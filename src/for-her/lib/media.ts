import { useEffect, useState } from "react";

type MediaKind = "video" | "image" | "audio";

const checks = new Map<string, Promise<boolean>>();

/**
 * Does this URL point at a real file of this kind? A missing file doesn't 404 here: Vercel's
 * /for-her rewrite (and the dev server) answer with the page's HTML instead, so check the type.
 */
export function mediaExists(url: string, kind: MediaKind): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  const key = `${kind}:${url}`;
  let check = checks.get(key);
  if (!check) {
    check = fetch(url, { method: "HEAD" })
      .then((res) => res.ok && (res.headers.get("content-type") ?? "").startsWith(`${kind}/`))
      // Cross-origin without CORS: can't tell, so let the element try (it has its own error fallback)
      .catch(() => true);
    checks.set(key, check);
  }
  return check;
}

/** `null` while checking, then whether the file exists. */
export function useMediaExists(url: string, kind: MediaKind) {
  const [result, setResult] = useState<{ url: string; exists: boolean } | null>(null);
  useEffect(() => {
    let cancelled = false;
    mediaExists(url, kind).then((exists) => !cancelled && setResult({ url, exists }));
    return () => {
      cancelled = true;
    };
  }, [url, kind]);
  return result?.url === url ? result.exists : null;
}
