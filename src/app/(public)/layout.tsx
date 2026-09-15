import { Metadata, Viewport } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { VisitorTracker } from "@/components/VisitorTracker";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { SmoothScroll } from "@/components/SmoothScroll";

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

export const viewport: Viewport = {
  themeColor: "#FFB81C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FabFit Performance - Premium Gym & Elite Fitness Coaching in Gurgaon",
    template: "%s | FabFit Performance",
  },
  description: "Join FabFit Performance, Gurgaon's premium destination for elite fitness, personalized coaching, and transformative workout programs. Start your journey today.",
  keywords: [
    "FabFit Performance",
    "Gym in Gurgaon",
    "Fitness Coaching Gurgaon",
    "Personal Trainer Gurgaon",
    "Online Fitness Coach",
    "Ankit Baliyan Coach",
    "Weight Loss Gym Gurgaon",
    "Body Transformation Gurgaon",
    "Best Gym DLF Phase 4",
  ],
  authors: [{ name: "Ankit Baliyan", url: siteUrl }],
  publisher: "FabFit Performance",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: siteUrl,
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
        alt: "Coach Ankit Baliyan - FabFit Performance",
      },
      {
        url: "/ankit-baliyan.png",
        width: 800,
        height: 800,
        alt: "Coach Ankit Baliyan",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FabFit Performance - Premium Gym & Elite Fitness Coaching",
    description: "Join FabFit Performance, Gurgaon's premium destination for elite fitness, personalized coaching, and transformative workout programs.",
    images: ["/og-image.jpg"],
    creator: "@fabfitperformance",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": ["ExerciseGym", "SportsActivityLocation", "HealthAndBeautyBusiness"],
  "name": "FabFit Performance",
  "image": `${siteUrl}/og-image.jpg`,
  "logo": `${siteUrl}/logo.png`,
  "description": "Premium destination for elite fitness, personal training, and physique transformation coaching in Gurgaon.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "62C, 6th Floor, Supermart 1, DLF Phase-4",
    "addressLocality": "Gurgaon",
    "addressRegion": "Haryana",
    "postalCode": "122002",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "28.4632",
    "longitude": "77.0858"
  },
  "telephone": "+919220393004",
  "url": siteUrl,
  "priceRange": "₹₹₹",
  "founder": {
    "@type": "Person",
    "name": "Ankit Baliyan",
    "jobTitle": "Head Performance Coach"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "06:00",
      "closes": "22:00"
    }
  ]
};

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
