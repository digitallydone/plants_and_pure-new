// Path: app\layout.jsx
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "PLANTS and PURE",
  description:
    "Discover the essence of nature with PLANTS and PURE - your destination for premium natural spices and products derived from the purest plants. Embrace a healthier lifestyle with our eco-friendly and organic offerings.",
  keywords: [
    "plants",
    "indoor plants",
    "natural products",
    "eco-friendly",
    "garden",
  ],
  authors: [{ name: "Plants and Pure", url: "https://plantsandpure.com" }],
  openGraph: {
    title: "PLANTS and PURE - Natural Spices from Plants and Pure",
  },
};

export const viewport = {
  themeColor: "#4a7c59",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
