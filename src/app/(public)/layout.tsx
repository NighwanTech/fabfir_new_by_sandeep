import { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { VisitorTracker } from "@/components/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fabfitperformance.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "FabFit Performance - Premium Gym & Elite Fitness Coaching in Gurgaon",
  description: "Join FabFit Performance, Gurgaon's premium destination for elite fitness, personalized coaching, and transformative workout programs. Start your journey today.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FabFit Performance - Premium Gym & Elite Fitness Coaching",
    description: "Join FabFit Performance, Gurgaon's premium destination for elite fitness, personalized coaching, and transformative workout programs.",
    url: siteUrl,
    siteName: "FabFit Performance",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FabFit Performance Gym",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "FabFit Performance",
  "image": `${siteUrl}/og-image.jpg`,
  "description": "Premium destination for elite fitness and performance coaching in Gurgaon.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "62C, 6th Floor, Supermart 1, DLF Phase-4",
    "addressLocality": "Gurgaon",
    "addressRegion": "Haryana",
    "postalCode": "122002",
    "addressCountry": "IN"
  },
  "telephone": "+919220393004",
  "url": siteUrl
};

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`ui-theme ${inter.variable} ${archivo.variable} antialiased flex flex-col min-h-screen`}>
        <VisitorTracker />
        <SmoothScroll>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </body>
    </html>
  );
}
