import "./globals.css";
import { GeistSans } from "geist/font/sans";

let title = "Rastreágua - Rastreador de hidratação";
let description =
  "Rastreágua é um rastreador de hidratação para que você cuide da sua saúde e se mantenha hidratada. Um copo equivale a 300 ml. Fique hidratada!";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
