import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketPlace - Kisaan.com Multi-Tenancy E-Commerce Ecommerce Platform",
  description:
    "Connect with sellers worldwide. Buy and sell products on our trusted Kisaan.com Multi-Tenancy E-Commerce marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
