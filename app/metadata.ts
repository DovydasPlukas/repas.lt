import type { Metadata } from "next";

const SITE_NAME = "Repas.lt";
const BASE_URL = "https://repas.lt";
const BASE_DESCRIPTION =
  "Repas.lt – profesionalios skalbimo, lyginimo ir valymo paslaugos Šiauliuose. Greitas aptarnavimas ir patogus užsakymas internetu.";
const SERVICES =
  "Skalbimas • Lyginimas • Kostiumų valymas • Patalynės valymas • Skalbimo mašinų tvarkymas";

/**
 * Pages allowed to be indexed by search engines (ONLY these 4)
 */
export const INDEXED_PAGES = ["/", "/paslaugos", "/kontaktai", "/apie-mus"] as const;

/**
 * Default site metadata (DEFAULT = NOINDEX for safety)
 */
export const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Repas.lt",
  },
  description: `${BASE_DESCRIPTION} Teikiame: ${SERVICES}.`,
  openGraph: {
    title: `${SITE_NAME} — Skalbimo paslaugos Šiauliuose`,
    description: `${BASE_DESCRIPTION} ${SERVICES}.`,
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "lt_LT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Skalbimo paslaugos Šiauliuose`,
    description: BASE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
  },
  // IMPORTANT: default = NOINDEX (everything is not indexed unless explicitly allowed)
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * Small per-page SEO snippets for the 4 public pages.
 * getPageMetadata(path) returns Metadata with robots.index = true only for allowed pages.
 */
const PAGE_SEO: Record<string, { title: string; description: string; url: string }> = {
  "/": {
    title: "Repas.lt",
    description: `${BASE_DESCRIPTION} Teikiame: ${SERVICES}. Užsisakykite internetu ir gaukite greitą aptarnavimą Šiauliuose.`,
    url: `${BASE_URL}/`,
  },
  "/paslaugos": {
    title: "Paslaugos",
    description: `Mūsų paslaugos: ${SERVICES}. Išsami informacija apie kiekvieną paslaugą ir kainas.`,
    url: `${BASE_URL}/paslaugos`,
  },
  "/kontaktai": {
    title: "Kontaktai",
    description: "Kontaktai, darbo laikas ir adresas Šiauliuose. Susisiekite dėl skalbimo paslaugų ir užsakymų.",
    url: `${BASE_URL}/kontaktai`,
  },
  "/apie-mus": {
    title: "Apie mus",
    description: "Sužinokite apie Repas.lt istoriją, komandą ir mūsų įsipareigojimą kokybei Šiauliuose.",
    url: `${BASE_URL}/apie-mus`,
  },
};

/**
 * getPageMetadata(path)
 * - If path is in INDEXED_PAGES returns Metadata with robots.index = true
 * - Otherwise returns a minimal Metadata (inherits site default NOINDEX)
 */
export function getPageMetadata(path: string): Metadata {
  const seo = PAGE_SEO[path];

  if (!seo) {
    // Non-public pages: keep minimal metadata (will inherit siteMetadata's noindex)
    return {
      title: siteMetadata.title,
      description: siteMetadata.description,
      // Explicitly reinforce noindex for clarity
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Public page — allow indexing
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      ...siteMetadata.openGraph,
      title: seo.title,
      description: seo.description,
      url: seo.url,
    },
    twitter: {
      ...siteMetadata.twitter,
      title: seo.title,
      description: seo.description,
    },
    // Only these pages are indexed
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}