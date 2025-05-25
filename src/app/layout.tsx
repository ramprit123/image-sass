import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust weights as needed
});

export const metadata: Metadata = {
  title: "Imaginary Sass - AI-Powered Image Generation & Editing",
  description:
    "Transform your creative vision into stunning visuals with our advanced AI image generation and editing platform. Create, edit, and enhance images with cutting-edge artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
