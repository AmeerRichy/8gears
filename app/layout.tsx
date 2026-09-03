import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./providers/AuthProvider";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import EngagementManager from "@/app/components/EngagementManager";
import JsonLd from "@/app/components/JsonLd";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  robotsMetadata,
  SITE_NAME,
  siteUrl,
} from "@/app/lib/seo";

export const metadata: Metadata = {
  metadataBase: siteUrl || undefined,
  title: {
    default: "Premium Motorcycle Riding Gear | 8-Gear",
    template: "%s | 8-Gear",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: robotsMetadata,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Premium Motorcycle Riding Gear | 8-Gear",
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/") || undefined,
    images: absoluteUrl(DEFAULT_OG_IMAGE_PATH)
      ? [{ url: absoluteUrl(DEFAULT_OG_IMAGE_PATH)!, alt: "8-Gear premium motorcycle riding apparel" }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Motorcycle Riding Gear | 8-Gear",
    description: DEFAULT_DESCRIPTION,
    images: absoluteUrl(DEFAULT_OG_IMAGE_PATH) ? [absoluteUrl(DEFAULT_OG_IMAGE_PATH)!] : undefined,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {siteUrl && (
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${siteUrl.toString()}#organization`,
                name: SITE_NAME,
                url: siteUrl.toString(),
                logo: absoluteUrl("/logo.png"),
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${siteUrl.toString()}#website`,
                name: SITE_NAME,
                url: siteUrl.toString(),
                publisher: { "@id": `${siteUrl.toString()}#organization` },
              },
            ]}
          />
        )}
        <AuthProvider>
          <CartProvider>
            <EngagementManager />
            <NavbarWrapper />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
