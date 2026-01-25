import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kisaan - Farm to Table Marketplace | Fresh Produce from Local Farmers",
  description:
    "Connect directly with farmers worldwide. Buy fresh, organic produce and support sustainable agriculture. Empowering 10,000+ farmers across 150+ countries.",
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
