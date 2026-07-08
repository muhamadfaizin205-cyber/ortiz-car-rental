import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORTIZ - Bali Car Rental",
  description: "ORTIZ is a Bali car rental that offers the best car rental solutions for your vacation in Bali.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-gray-800 bg-white">{children}</body>
    </html>
  );
}
