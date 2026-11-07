import { CanvasTexture, LatheGeometry, RepeatWrapping, SRGBColorSpace, Vector2 } from "three";

// Everything is drawn in code: no image or model files to download.

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  draw(canvas.getContext("2d")!, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function radial(stops: [number, string][]) {
  return (ctx: CanvasRenderingContext2D, size: number) => {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([at, color]) => gradient.addColorStop(at, color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  };
}

let cache: ReturnType<typeof create> | undefined;

function create() {
  const stripes = canvasTexture(64, (ctx, size) => {
    ctx.fillStyle = "#FFF6EA";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#EFA9A6";
    ctx.lineWidth = 9;
    for (let x = -size; x < size * 2; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + size, size);
      ctx.stroke();
    }
  });
  stripes.wrapS = stripes.wrapT = RepeatWrapping;
  stripes.repeat.set(1, 2);

  return {
    stripes,
    glow: canvasTexture(64, radial([[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,255,255,0.55)"], [1, "rgba(255,255,255,0)"]])),
    smoke: canvasTexture(64, radial([[0, "rgba(235,228,224,0.9)"], [0.5, "rgba(220,212,208,0.35)"], [1, "rgba(220,212,208,0)"]])),
  };
}

export const getTextures = () => (cache ??= create());

let flameGeometry: LatheGeometry | undefined;

/** A teardrop: round at the base, pointed at the tip. Unit height, pivot at the base. */
export function getFlameGeometry() {
  if (!flameGeometry) {
    const points: Vector2[] = [];
    for (let i = 0; i <= 14; i++) {
      const y = i / 14;
      points.push(new Vector2(0.5 * Math.pow(Math.sin(Math.PI * y), 0.75) * (1 - 0.55 * y), y));
    }
    flameGeometry = new LatheGeometry(points, 14);
  }
  return flameGeometry;
}
