import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import "./nav-link.css";
import { cn } from "@/lib/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Trivya Care",
  description: "Natural Care Products from Trivya Care.",
  icons: {
    icon: "/product/triviya-oil.png",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", urbanist.variable,)}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}