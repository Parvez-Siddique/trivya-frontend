import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/app/globals.css";
import "@/app/nav-link.css"
import { Toaster } from "@/components/ui/sonner";

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trivya Care",
  description: "Natural Care Products from Trivya Care.",
  icons: {
    icon: "/product/triviya-oil.png",
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
   <>
    {children}
    <Toaster />
   </>
  );
}
