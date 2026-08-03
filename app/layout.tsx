import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gregory-barmpas.vercel.app"),
  title: {
    default: "Gregory Barmpas | Senior Data Scientist & AI Engineer",
    template: "%s | Gregory Barmpas"
  },
  description:
    "Portfolio of Gregory Barmpas, Senior Data Scientist and AI Engineer specializing in Generative AI, RAG systems, LLM applications, forecasting, NLP, and production ML systems.",
  openGraph: {
    title: "Gregory Barmpas | Senior Data Scientist & AI Engineer",
    description:
      "Production-ready ML, RAG, LLM application, forecasting, NLP, and AI engineering portfolio.",
    type: "website",
    url: "https://gregory-barmpas.vercel.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "Gregory Barmpas | Senior Data Scientist & AI Engineer",
    description:
      "Generative AI, RAG systems, LLM applications, forecasting, NLP, and production ML systems."
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
      url: "https://gregory-barmpas.vercel.app",
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
      url: "https://gregory-barmpas.vercel.app"
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
