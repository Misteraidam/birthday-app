import { useState } from "react";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

/** A soft blush card with a small heart, shown for any photo that hasn't been added yet. */
export const PHOTO_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">` +
      `<stop offset="0" stop-color="#FDF1EC"/><stop offset="1" stop-color="#F0C7BF"/></linearGradient></defs>` +
      `<rect width="400" height="500" fill="url(#g)"/>` +
      `<path transform="translate(170 214) scale(2.5)" fill="#E3A9A0" opacity="0.75" d="${HEART_PATH}"/>` +
      `</svg>`,
  );

/**
 * The photo's src, swapped for the placeholder if it fails to load (a missing file comes
 * back as HTML, which an <img> can't decode). Resets if the src changes.
 */
export function usePhotoSrc(src: string) {
  const [failed, setFailed] = useState<string | null>(null);
  const current = !src || failed === src ? PHOTO_PLACEHOLDER : src;
  const onError = () => setFailed(src);
  return [current, onError] as const;
}
