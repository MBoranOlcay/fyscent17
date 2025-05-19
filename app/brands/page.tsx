// parfum-vitrini/app/brands/page.tsx
"use client"; // useState, useMemo, useEffect kullanıldığı için bu gerekli

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { perfumesData } from '@/data/perfumes';
import type { Product as Perfume } from '@/types';
import { Search } from 'lucide-react';

// Marka adını URL dostu bir slug'a çevirmek için
const createBrandSlug = (brandName: string): string => {
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

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "Tüm Markalar - FindYourScent";
  }, []);

  const allBrands = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    (perfumesData as Perfume[]).forEach(perfume => {
      // Marka adının var olup olmadığını kontrol et
      if (perfume.brand && typeof perfume.brand === 'string') {
        brandCounts[perfume.brand] = (brandCounts[perfume.brand] || 0) + 1;
      }
    });
    return Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) {
      return allBrands;
    }
    return allBrands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allBrands]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800">
          Parfüm Markaları
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-sans max-w-xl mx-auto">
          Koleksiyonumuzdaki tüm seçkin markaları keşfedin ve favori tasarımcılarınızı bulun.
        </p>
      </header>

      <div className="mb-10 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Marka ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-sans text-md"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"> {/* gap-y artırıldı */}
          {filteredBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/brands/${createBrandSlug(brand.name)}`}
              className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-400 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              // Daha belirgin hover ve focus stilleri
            >
              <h2 className="text-xl font-serif font-semibold text-amber-700 group-hover:text-amber-800 truncate">
                {/* truncate eklendi */}
                {brand.name}
              </h2>
              <p className="text-sm text-gray-500 font-sans mt-1.5">
                {brand.count} ürün
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <Search size={48} className="text-gray-300 mx-auto mb-4" /> {/* İkon değiştirildi */}
            <p className="text-xl text-gray-500 font-sans mb-2">
              Marka Bulunamadı
            </p>
            <p className="text-gray-400 font-sans">
              Arama teriminizi kontrol edin veya tüm markalara göz atın.
            </p>
        </div>
      )}
    </div>
  );
}