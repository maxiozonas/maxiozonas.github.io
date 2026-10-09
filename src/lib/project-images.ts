export function projectSrcset(slug: string) {
  return [480, 768, 1080].map(width => `/projects/${slug}-${width}.webp ${width}w`).concat(`/projects/${slug}.webp 1440w`).join(", ");
}
export const previewSizes = "(max-width: 767px) 90vw, (min-width: 1440px) 620px, 45vw";
