import confetti from "canvas-confetti";

const COLORS = ["#F6D3CC", "#EFB6AC", "#E4928A", "#C25B6E", "#C9A25F", "#E8D3A2"];
const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

let shapes: confetti.Shape[] | undefined;

function getShapes() {
  if (!shapes) {
    try {
      shapes = [confetti.shapeFromPath({ path: HEART_PATH }), "circle"];
    } catch {
      shapes = ["circle"]; // older browsers without Path2D support
    }
  }
  return shapes;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The big one: a centre burst, then two side cannons. */
export function celebrate() {
  if (prefersReducedMotion()) return;
  const base = { colors: COLORS, shapes: getShapes(), zIndex: 60, ticks: 280, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 140, spread: 110, startVelocity: 48, scalar: 1.25, origin: { x: 0.5, y: 0.5 } });
  setTimeout(() => {
    confetti({ ...base, particleCount: 70, angle: 60, spread: 65, startVelocity: 55, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 70, angle: 120, spread: 65, startVelocity: 55, origin: { x: 1, y: 0.75 } });
  }, 280);
}

/** A small pink-and-gold burst of hearts from the centre of an element. */
export function burstFrom(element: Element) {
  if (prefersReducedMotion()) return;
  const rect = element.getBoundingClientRect();
  confetti({
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    particleCount: 60,
    spread: 75,
    startVelocity: 30,
    gravity: 0.9,
    ticks: 170,
    scalar: 1.1,
    colors: COLORS,
    shapes: getShapes(),
    zIndex: 60,
    disableForReducedMotion: true,
  });
}
