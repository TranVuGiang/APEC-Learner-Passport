import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "APEC Learner Passport",
  description: "Decentralized credential system for APEC education ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-900">
        <WalletProvider>
          <Navbar />
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
