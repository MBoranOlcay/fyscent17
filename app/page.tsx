// parfum-vitrini/app/page.tsx (ANİMASYON SINIFLARI KALDIRILDI)
import Link from 'next/link';
import { perfumesData } from '@/data/perfumes';
import type { Product as Perfume } from '@/types';
import FeaturedPerfumesCarousel from '@/components/FeaturedPerfumesCarousel';

export default function HomePage() {
  const allPerfumes = perfumesData as Perfume[];
  const featuredPerfumesForCarousel = allPerfumes.length > 0 ? allPerfumes.slice(0, 8) : [];

  return (
    <>
      {/* Hero Alanı */}
      <section 
        className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 px-4 py-16 sm:py-24"
      >
        <div className="relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-purple-700 mb-6">
          FindYourScent&apos;e Hoş Geldiniz
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-sans text-gray-600 mb-10 max-w-xl lg:max-w-2xl mx-auto">
            En nadide esansların ve unutulmaz kokuların büyüleyici dünyasını keşfedin. Size özel parfümü bulun.
          </p>
          <Link
            href="/perfumes"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-sans font-semibold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            Koleksiyonu Keşfet
          </Link>
        </div>
      </section>

      {/* Öne Çıkan Parfümler Carousel Alanı */}
      {featuredPerfumesForCarousel.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-800 text-center mb-10 md:mb-12">
              Öne Çıkan Kokularımız
            </h2>
            
            <FeaturedPerfumesCarousel perfumes={featuredPerfumesForCarousel} />

            <div className="text-center mt-12 md:mt-16">
              <Link
                href="/perfumes"
                className="inline-block border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white font-sans font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-md"
              >
                Tüm Koleksiyonu Gör
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}