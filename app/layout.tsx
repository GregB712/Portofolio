import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { profile } from "@/content/profile";
import { pageDescriptions, site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Gregory Barmpas | Data Scientist & AI Engineer",
    template: "%s | Gregory Barmpas"
  },
  description: pageDescriptions.home,
  openGraph: {
    title: "Gregory Barmpas | Data Scientist & AI Engineer",
    description: pageDescriptions.home,
    type: "website",
    url: site.url
  },
  twitter: {
    card: "summary_large_image",
    title: "Gregory Barmpas | Data Scientist & AI Engineer",
    description: pageDescriptions.home
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: profile.name,
      jobTitle: "Data Scientist and AI Engineer",
      email: profile.email,
      address: profile.location,
      url: site.url,
      sameAs: ["https://github.com/GregB712", "https://www.linkedin.com/in/gbarmpas/"],
      knowsAbout: [
        "Generative AI",
        "Retrieval-Augmented Generation",
        "Machine Learning",
        "Time-Series Forecasting",
        "NLP",
        "LLM Applications"
      ]
    },
    {
      "@type": "WebSite",
      name: "Gregory Barmpas Portfolio",
      url: site.url
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          {children}
          <Footer />
          <BackToTopButton />
        </ThemeProvider>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
