import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Shopcart — Shopping And Department Store",
  description: "Modern department store & electronics storefront proof-of-concept.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
