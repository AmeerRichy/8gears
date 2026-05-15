import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./providers/AuthProvider";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import EngagementManager from "@/app/components/EngagementManager";

export const metadata: Metadata = {
  title: "8 GEARS | Premium Motorbike Gear",
  description: "High-performance accessories and gear for the modern rider.",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <EngagementManager />
            <NavbarWrapper />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
