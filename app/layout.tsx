import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IdeaProof by Avyanco - AI-Powered UAE Business Idea Validator",
  description:
    "Validate your business idea for the UAE market in minutes. Get AI-powered market analysis, competitor intelligence, license recommendations, and a viability score — free.",
  keywords:
    "UAE business idea validator, business setup UAE, Avyanco, business license UAE, entrepreneur UAE, market analysis UAE",
  openGraph: {
    title: "IdeaProof by Avyanco - AI-Powered UAE Business Idea Validator",
    description:
      "Validate your business idea for the UAE market in minutes with AI-powered insights.",
    url: "https://ideaproof.avyanco.com",
    siteName: "IdeaProof by Avyanco",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaProof by Avyanco",
    description: "AI-powered UAE business idea validator — free instant report",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ideaproof.avyanco.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-poppins antialiased">
        {children}
      </body>
    </html>
  );
}
