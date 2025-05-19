// parfum-vitrini/app/layout.tsx
import type { Metadata } from "next";
// Link'i Next.js'ten import etmeye devam ediyoruz, Header içinde kullanılacak
// import Link from "next/link"; // Header bileşeni kendi Link'lerini yönetecek, burada genel Link'e gerek kalmayabilir
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Yeni Header bileşenimizi import ediyoruz
import Header from "@/components/Header"; // Bolt.new'den uyarladığımız Header

// Fontları yapılandır
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: "FindYourScent - Eşsiz Parfüm Koleksiyonu",
  description: "FindYourScent ile en özel ve popüler parfümleri keşfedin. Notalarına göre filtreleyin, favori kokunuzu bulun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans bg-brand-lightBg text-gray-800">
        {/* Eski header'ı sildik, Bolt.new'den uyarladığımız Header bileşenini kullanıyoruz */}
        <Header />
        
        {/* Bolt.new'in header'ı fixed olduğu için, ana içeriğin header'ın altına itilmesi gerekebilir.
            Bunu header'ın yüksekliği kadar bir padding-top ile veya main'e margin-top vererek yapabiliriz.
            Header bileşeninin yüksekliğine göre bu değeri ayarlaman gerekebilir.
            Örneğin, header'ın yüksekliği yaklaşık 60px-80px ise:
        */}
        <main className="pt-16 md:pt-20"> {/* Header yüksekliğine göre bir üst boşluk */}
          {children}
        </main>
        
        <footer className="bg-lavender-dark text-lavender-light text-center p-6 mt-12"> {/* Biraz daha padding ve margin */}
          <p>© {new Date().getFullYear()} FindYourScent. Tüm hakları saklıdır.</p>
        </footer>
      </body>
    </html>
  );
}