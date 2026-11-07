import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type PreloadableComponent<T extends ComponentType> = LazyExoticComponent<T> & {
  /** Starts downloading the chunk now, so it's ready by the time it renders */
  preload: () => Promise<{ default: T }>;
};

/** React.lazy, plus a `preload()` that fetches the chunk in the background. */
export function lazyWithPreload<T extends ComponentType>(
  factory: () => Promise<{ default: T }>,
): PreloadableComponent<T> {
  let pending: Promise<{ default: T }> | undefined;
  const load = () => (pending ??= factory());
  return Object.assign(lazy(load), { preload: load });
}
