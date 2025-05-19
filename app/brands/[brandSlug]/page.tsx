// parfum-vitrini/app/brands/[brandSlug]/page.tsx
import { perfumesData } from '@/data/perfumes';
import type { Product as Perfume } from '@/types';
import PerfumeCard from '@/components/PerfumeCard'; // PerfumeCard'ı import etmeyi unutmayalım
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ brandSlug: string }>;
}

// Bu fonksiyonu sayfanın dışında veya bir utils dosyasında tanımlamak daha iyi olabilir
// Ama şimdilik burada kalsın, generateStaticParams ve generateMetadata da kullanacak
const createBrandSlug = (brandName: string): string => {
    if (!brandName) return "";
    return brandName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const getBrandNameFromSlug = (slug: string, perfumes: Perfume[]): string | undefined => {
    // Slug'ı bilinen bir markanın slug'ıyla eşleştirmek için tüm markaların slug'larını oluştur
    for (const perfume of perfumes) {
        if (perfume.brand && createBrandSlug(perfume.brand) === slug) {
            return perfume.brand; // Eşleşen ilk markanın adını döndür
        }
    }
    return undefined; // Eşleşme bulunamazsa
};

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const resolvedParams = await params;
  const { brandSlug } = resolvedParams;
  const brandName = getBrandNameFromSlug(brandSlug, perfumesData as Perfume[]);

  if (!brandName) {
    return { title: 'Marka Bulunamadı - FindYourScent' };
  }
  return {
    title: `${brandName} Parfümleri - FindYourScent`,
    description: `${brandName} markasına ait en özel parfümleri keşfedin.`,
    openGraph: {
        title: `${brandName} Parfümleri`,
        description: `${brandName} markasına ait en özel parfümleri keşfedin.`,
        // images: [ /* Marka logosu veya temsili bir görsel eklenebilir */ ]
    }
  };
}

export async function generateStaticParams() {
  const uniqueBrands = new Set((perfumesData as Perfume[])
    .map(p => p.brand)
    .filter((brand): brand is string => Boolean(brand)));
  return Array.from(uniqueBrands).map(brandName => ({
    brandSlug: createBrandSlug(brandName),
  }));
}

export default async function BrandDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { brandSlug } = resolvedParams;
  const brandName = getBrandNameFromSlug(brandSlug, perfumesData as Perfume[]);

  if (!brandName) {
    notFound();
  }

  const brandPerfumes = (perfumesData as Perfume[]).filter(
    perfume => perfume.brand === brandName
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <header className="mb-10 md:mb-12">
        <div className="mb-6">
            <Link href="/brands" className="font-sans text-sm text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                Tüm Markalara Geri Dön
            </Link>
        </div>
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800">
            {brandName}
            </h1>
            <p className="mt-3 text-lg text-gray-600 font-sans max-w-xl mx-auto">
            {brandName} markasının en sevilen ve ikonik parfümlerini keşfedin.
            </p>
            {/* Buraya marka hakkında kısa bir bilgi veya logo eklenebilir */}
        </div>
      </header>

      {brandPerfumes.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {brandPerfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 font-sans py-10">
          Bu markaya ait parfüm bulunamadı.
        </p>
      )}
    </div>
  );
}