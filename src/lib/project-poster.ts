import type { CollectionEntry } from 'astro:content';

type ProjectData = CollectionEntry<'portfolio'>['data'];

/** Use the first listed film when a project has no supplied cover image. */
export function projectVideoId(data: ProjectData): string | undefined {
  if (data.videos[0]) return data.videos[0].youtubeId;

  for (const link of data.externalLinks) {
    try {
      const url = new URL(link.url);
      const id = url.hostname === 'youtu.be'
        ? url.pathname.slice(1).split('/')[0]
        : /(^|\.)youtube\.com$/.test(url.hostname)
          ? url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')
            ? url.pathname.split('/')[2]
            : url.searchParams.get('v')
          : undefined;
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    } catch {
      // Invalid links are handled by the content schema.
    }
  }
}

export function projectPosterUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
