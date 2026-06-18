import type { SearchHit } from "@/lib/vector";

export type Citation = {
  index: number;
  title: string;
  url: string;
  path: string;
  heading: string;
  preview: string;
};

export function hitsToCitations(hits: SearchHit[]): Citation[] {
  return hits.map((hit, i) => ({
    index: i + 1,
    title: hit.title,
    url: hit.url,
    path: hit.path,
    heading: hit.heading,
    preview: hit.preview.slice(0, 200),
  }));
}
