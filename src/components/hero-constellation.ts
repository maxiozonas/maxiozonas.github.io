type Star = { x: number; y: number; z: number };
export type ProjectedStar = { x: number; y: number; depth: number };

// A fixed seed keeps the server-rendered fallback identical during hydration.
export function createConstellation(count: number) {
  let seed = 219;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const stars: Star[] = Array.from({ length: count }, () => {
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    return { x: ring * Math.cos(angle), y: ring * Math.sin(angle), z };
  });
  const links: [number, number][] = [];
  const seen = new Set<string>();
  for (let index = 0; index < stars.length; index++) {
    const star = stars[index];
    const neighbours = stars.map((other, next) => ({
      next, distance: Math.hypot(star.x - other.x, star.y - other.y, star.z - other.z),
    })).filter(other => other.next !== index && other.distance < 0.32)
      .sort((a, b) => a.distance - b.distance).slice(0, 4);
    for (const { next } of neighbours) {
      const key = `${Math.min(index, next)}:${Math.max(index, next)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push([index, next]);
    }
  }
  return { stars, links };
}

export function projectConstellation(stars: Star[], rotation: number, tilt: number): ProjectedStar[] {
  const turnCos = Math.cos(rotation);
  const turnSin = Math.sin(rotation);
  const tiltCos = Math.cos(tilt);
  const tiltSin = Math.sin(tilt);
  return stars.map(star => {
    const x = star.x * turnCos + star.z * turnSin;
    const z = star.z * turnCos - star.x * turnSin;
    const y = star.y * tiltCos - z * tiltSin;
    const depth = star.y * tiltSin + z * tiltCos;
    const perspective = 1 / (1 - depth * 0.1);
    return { x: 250 + x * 207 * perspective, y: 250 + y * 207 * perspective, depth };
  });
}
