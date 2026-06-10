import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PWA Study",
    short_name: "PWA Study",
    description: "Um PWA simples para testar recursos do celular.",
    start_url: "/aplication",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#111827",
    icons: [
      {
        src: "/penguin-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],

  }
}
