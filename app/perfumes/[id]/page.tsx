// parfum-vitrini/app/perfumes/[id]/page.tsx (ÜRÜN DETAY SAYFASI)

import { perfumesData } from '@/data/perfumes';
import Link from 'next/link';
import { Metadata } from "next";
import type { Product as Perfume, FragranceNote } from '@/types';

import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import FragrancePyramid from '@/components/FragrancePyramid';
import ProductTabsDisplay from '@/components/ProductTabsDisplay';

type PageProps = {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const resolvedParams = await params;
  const perfumeId = resolvedParams.id;
  const perfume = (perfumesData as Perfume[]).find((p) => p.id === perfumeId);

  if (!perfume) {
    return {
      title: 'Parfüm Bulunamadı - FindYourScent',
    };
  }

  return {
    title: `${perfume.name} by ${perfume.brand} - FindYourScent`,
    description: perfume.description?.substring(0, 160) || `${perfume.name} parfümünün detayları.`,
    openGraph: {
      title: `${perfume.name} by ${perfume.brand}`,
      description: perfume.description?.substring(0, 160) || `${perfume.name} parfümünün detayları.`,
      images: perfume.images && perfume.images.length > 0 ? [{ url: perfume.images[0] }] : [],
      type: 'article'
    },
  };
}

export default async function PerfumeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const perfumeId = resolvedParams.id;
  const perfume = (perfumesData as Perfume[]).find((p) => p.id === perfumeId);

  if (!perfume) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-serif font-bold text-red-600 mb-6">
          Parfüm Bulunamadı
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Aradığınız ID&apos;ye sahip bir parfüm koleksiyonumuzda mevcut değil.
        </p>
        <Link
          href="/perfumes"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-sans font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-colors duration-300 text-lg"
        >
          Tüm Parfümlere Göz At
        </Link>
      </div>
    );
  }

  const groupedNotesForProductInfo = (perfume.fragranceNotes && Array.isArray(perfume.fragranceNotes)) ?
    perfume.fragranceNotes.reduce((acc, note) => {
      (acc[note.type] = acc[note.type] || []).push(note.name);
      return acc;
    }, { top: [], heart: [], base: [] } as Record<FragranceNote['type'], string[]>)
    : { top: [], heart: [], base: [] };

  return (
    <div> {/* En dış sarmalayıcı */}
      {perfume.images && perfume.images.length > 0 && (
        <div
          className="h-[50vh] md:h-[60vh] lg:h-[65vh] bg-cover bg-center relative -z-10"
          style={{ backgroundImage: `url(${perfume.images[0]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        </div>
      )}

      <div 
        className={`container mx-auto px-4 sm:px-6 lg:px-8 relative ${
          perfume.images && perfume.images.length > 0 ? 'md:-mt-[35vh] lg:-mt-[30vh] -mt-[25vh]' : 'mt-12 md:mt-16'
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-gray-200">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              <ProductGallery
                images={perfume.images || []}
                productName={perfume.name || "Parfüm"}
              />
            </div>
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              <ProductInfo 
                perfume={perfume} 
                groupedNotes={groupedNotesForProductInfo} 
              />
            </div>
          </div>

          {perfume.fragranceNotes && perfume.fragranceNotes.length > 0 && (
            <div className="border-t border-gray-100">
              <FragrancePyramid notes={perfume.fragranceNotes} />
            </div>
          )}

          {(perfume.longDescription || perfume.details || (perfume.reviews && perfume.reviews.length > 0)) && (
            <div className="border-t border-gray-100 px-1 sm:px-2 md:px-4 lg:px-6">
              <ProductTabsDisplay product={perfume} />
            </div>
          )}
        </div>

        <div className="mt-12 mb-16 text-center">
          <Link
            href="/perfumes"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-sans font-medium text-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Tüm Parfümlere Göz At
          </Link>
        </div>
      </div>

      <p className="mt-3 text-lg text-gray-600 font-sans max-w-xl mx-auto">
        {perfume.name}&apos;in benzersiz kokusunu keşfedin.
      </p>
    </div>
  );
}