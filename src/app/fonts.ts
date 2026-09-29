import { Inter, Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";

// Typography follows the brand guide: Tusker Grotesk for headings, Libre Baskerville
// and Inter Regular for body copy, Brilliant Signature for accents.
export const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter",
  display: "swap",
});

export const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-baskerville",
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
