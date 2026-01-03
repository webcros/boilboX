import type { Metadata } from "next";
import { Manrope, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/context/ThemeContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
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
        url: "/og-image.jpg", // You should create this image
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
    images: ["/twitter-image.jpg"], // You should create this image
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body
        className={`${manrope.variable} ${notoSans.variable} antialiased bg-bg-light dark:bg-bg-dark text-[#111813] dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
