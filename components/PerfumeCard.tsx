// components/PerfumeCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Product as Perfume } from '@/types';

// Marka adını URL dostu bir slug'a çevirmek için yardımcı fonksiyon
const createBrandSlug = (brandName?: string) => {
    if (!brandName) return "";
    return brandName
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
};

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const imageUrl = perfume.images && perfume.images.length > 0 ? perfume.images[0] : undefined;

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-amber-300 flex flex-col">
      <Link href={`/perfumes/${perfume.id}`} className="block aspect-[3/4] relative overflow-hidden"> {/* aspect ratio ve relative pozisyon */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={perfume.name || 'Parfüm görseli'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Görsel Yok</span>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow"> {/* flex-grow içeriği aşağı iter */}
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700 truncate font-serif mb-1">
          <Link href={`/perfumes/${perfume.id}`} className="hover:underline">
            {perfume.name}
          </Link>
        </h3>
        {perfume.brand && (
          <Link href={`/brands/${createBrandSlug(perfume.brand)}`} className="inline-block self-start"> {/* self-start sola yaslar */}
            <p className="text-sm text-gray-500 hover:text-amber-600 hover:underline font-sans transition-colors">
              {perfume.brand}
            </p>
          </Link>
        )}
        {/* İleride fiyat veya kısa bir bilgi eklenebilir */}
        {/* <div className="mt-auto pt-2">
          <p className="text-lg font-semibold text-gray-900">$ {perfume.price?.toFixed(2)}</p>
        </div> */}
      </div>
    </div>
  );
}