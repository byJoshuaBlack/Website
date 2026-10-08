import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Tusker Grotesk for headings, Inter Regular for body copy and interface text (its italic for
// quotes, its bold for buttons), Brilliant Signature for accents.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export const tusker = localFont({
  src: "../assets/fonts/TuskerGrotesk-3500Medium.otf",
  variable: "--font-tusker",
  weight: "500",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

export const signature = localFont({
  src: "../assets/fonts/BrilliantSignatureRegular.ttf",
  variable: "--font-signature",
  weight: "400",
  display: "swap",
  fallback: ["cursive"],
});
