import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./nav-link.css";
import { cn } from "@/lib/utils";

const urbanist = localFont({
  src: [
    {
      path: "../fonts/Urbanist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Urbanist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Urbanist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Urbanist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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