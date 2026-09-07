import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import ScrollAnimator from "@/components/layout/ScrollAnimator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CropSakha AI | Crop Health Intelligence",
  description: "State-of-the-art crop disease detection powered by LeafVision DINO ResNet-50. 99.7% accuracy across 38 crop-disease classes with Grad-CAM explainability.",
};

// Define LayoutProps locally since Next.js 14+ app dir types might differ slightly
interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <I18nProvider>
          <main className="app-container">
            {children}
          </main>
          <ScrollAnimator />
        </I18nProvider>
      </body>
    </html>
  );
}
