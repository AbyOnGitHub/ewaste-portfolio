import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Abedan Biswal | E-Waste Awareness & Sustainability Portfolio",
  description: "Abedan Biswal's interactive portfolio exploring e-waste solutions, sustainable tech prototypes, research posters, and environmental advocacy campaigns.",
  keywords: ["Abedan Biswal", "e-waste", "sustainability", "environmental tech", "green computing", "portfolio", "3D Earth", "circular economy", "Vidyalankar Institute of Technology"],
  openGraph: {
    title: "Abedan Biswal | E-Waste Awareness Portfolio",
    description: "Abedan Biswal's interactive portfolio advocating for e-waste awareness, featuring 3D global project mapping, research posters, prototypes, and environmental media.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable} dark scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#071c15] text-[#F5F3EA] antialiased selection:bg-[#4C7C59] selection:text-[#A7F3D0]">
        {children}
      </body>
    </html>


  );
}

