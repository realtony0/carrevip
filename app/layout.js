import { Bebas_Neue, Inter, Syne } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});
const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const syne = Syne({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://carre-vip.vercel.app"
  ),
  title: "Carré VIP — Ngor · Dakar | Restaurant · Piscine · Lounge · Club",
  description:
    "Carré VIP, Ngor — un jardin tropical au cœur de Dakar. Restaurant et piscine ouverts à toute heure, lounge chicha et grand club. Route de l'Aéroport, Ngor.",
  openGraph: {
    title: "Carré VIP — Ngor · Dakar",
    description:
      "Un jardin tropical au cœur de Dakar. Restaurant · Piscine · Lounge · Club VIP.",
    images: ["/assets/img/club-sofas-logo.jpeg"],
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${bebas.variable} ${inter.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
