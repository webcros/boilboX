import type { Metadata } from "next";

interface PageMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
}

export const generatePageMetadata = ({
  title,
  description,
  image,
  url,
  type = "website"
}: PageMetadata): Metadata => {
  const siteTitle = "BoilboX - Eat Clean. Live Light.";
  const siteDescription = "100% Boiled, 0% Oil. Redefining fast food with transparency, nutrient retention, and meals that heal from the inside out.";
  const siteUrl = url || "https://boilox.com";
  const defaultImage = "/og-image.jpg";

  return {
    title: title ? `${title} | BoilboX` : siteTitle,
    description: description || siteDescription,
    keywords: ["healthy food", "oil-free cooking", "boiled meals", "clean eating", "fast food alternative", "nutrition", "meal delivery"],
    authors: [{ name: "BoilboX", url: "https://boilox.com" }],
    creator: "BoilboX",
    publisher: "BoilboX",
    openGraph: {
      type: type,
      locale: "en_US",
      url: siteUrl,
      title: title || siteTitle,
      description: description || siteDescription,
      siteName: "BoilboX",
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || "BoilboX - Eat Clean. Live Light.",
        }
      ] : [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: title || "BoilboX - Eat Clean. Live Light.",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteTitle,
      description: description || siteDescription,
      images: image || defaultImage,
      creator: "@boilox",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
  };
};

// Default metadata for the site
export const defaultMetadata: Metadata = {
  title: {
    default: "BoilboX - Eat Clean. Live Light.",
    template: "%s | BoilboX"
  },
  description: "100% Boiled, 0% Oil. Redefining fast food with transparency, nutrient retention, and meals that heal from the inside out.",
  keywords: ["healthy food", "oil-free cooking", "boiled meals", "clean eating", "fast food alternative", "nutrition", "meal delivery"],
  authors: [{ name: "BoilboX", url: "https://boilox.com" }],
  creator: "BoilboX",
  publisher: "BoilboX",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boilox.com",
    title: "BoilboX - Eat Clean. Live Light.",
    description: "100% Boiled, 0% Oil. Redefining fast food with transparency, nutrient retention, and meals that heal from the inside out.",
    siteName: "BoilboX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BoilboX - Eat Clean. Live Light.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoilboX - Eat Clean. Live Light.",
    description: "100% Boiled, 0% Oil. Redefining fast food with transparency, nutrient retention, and meals that heal from the inside out.",
    images: ["/twitter-image.jpg"],
    creator: "@boilox",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://boilox.com",
  },
  verification: {
    google: 'google-site-verification-code', // Add your Google verification code
    yandex: 'yandex-verification-code', // Add your Yandex verification code
  },
};