// parfum-vitrini/app/perfumes/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import PerfumeCard from '@/components/PerfumeCard';
import { perfumesData } from '@/data/perfumes';
import type { Product as Perfume } from '@/types';
import SearchBar from '@/components/SearchBar';
import { Filter as FilterIcon, X as XIcon, RotateCcw } from 'lucide-react'; // XIcon ve RotateCcw eklendi
import FilterModal from '@/components/FilterModal';

export default function PerfumesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const allAvailableBrands = useMemo(() => {
    const brands = new Set(
      (perfumesData as Perfume[])
        .map(p => p.brand)
        .filter((b): b is string => typeof b === "string" && b.length > 0)
    );
    return Array.from(brands).sort();
  }, []);

  const allAvailableNotes = useMemo(() => {
    const notesSet = new Set<string>();
    (perfumesData as Perfume[]).forEach(perfume => {
      if (perfume.fragranceNotes && Array.isArray(perfume.fragranceNotes)) {
        perfume.fragranceNotes.forEach(note => notesSet.add(note.name));
      }
    });
    return Array.from(notesSet).sort();
  }, []);

  const filteredPerfumes = useMemo(() => {
    let perfumesToFilter = perfumesData as Perfume[];
    if (selectedBrands.length > 0) {
      perfumesToFilter = perfumesToFilter.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedNotes.length > 0) {
      perfumesToFilter = perfumesToFilter.filter(p =>
        p.fragranceNotes && Array.isArray(p.fragranceNotes) &&
        p.fragranceNotes.some(note => selectedNotes.includes(note.name))
      );
    }
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      perfumesToFilter = perfumesToFilter.filter(p =>
        (p.name?.toLowerCase() || '').includes(lowerSearchTerm) || // name ve brand tanımsızsa diye kontrol
        (p.brand?.toLowerCase() || '').includes(lowerSearchTerm)
      );
    }
    return perfumesToFilter;
  }, [searchTerm, selectedBrands, selectedNotes]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const applyFiltersFromModal = (brands: string[], notes: string[]) => {
    setSelectedBrands(brands);
    setSelectedNotes(notes);
    setIsFilterModalOpen(false);
  };

  const removeBrandFilter = (brandToRemove: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brandToRemove));
  };

  const removeNoteFilter = (noteToRemove: string) => {
    setSelectedNotes(prev => prev.filter(n => n !== noteToRemove));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedNotes([]);
    // Arama çubuğunu da sıfırlamak için SearchBar'a bir reset prop'u veya
    // initialValue'yu searchTerm'e bağladığımız için searchTerm'ü güncellemek yeterli.
    // Eğer SearchBar kendi içinde bir değere sahipse, onu da sıfırlamanın bir yolu olmalı.
    // Bizim SearchBar'ımız initialValue'yu searchTerm'den alıyor, bu yüzden sorun yok.
  };

  useEffect(() => {
    document.title = "Tüm Parfümler - FindYourScent";
  }, []);

  const headerHeight = "5rem"; // Header yüksekliğinize göre ayarlayın

  const activeFilterCount = selectedBrands.length + selectedNotes.length + (searchTerm.trim() ? 1 : 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 mb-8 text-center">
        Tüm Parfümler
      </h1>
      
      {/* Arama ve Filtre Kontrolleri */}
      <div 
        className="sticky bg-white/90 backdrop-blur-md py-4 z-30 mb-6 shadow-sm rounded-lg"
        style={{ top: `calc(${headerHeight} + 0.5rem)` }} // Header'ın altına ve biraz boşlukla yapış
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-3xl mx-auto px-2">
          <div className="w-full sm:flex-grow">
            <SearchBar onSearchChange={handleSearchChange} initialValue={searchTerm} />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-sans font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors duration-200 whitespace-nowrap"
          >
            <FilterIcon size={18} />
            Filtrele 
            {activeFilterCount > 0 && (
              <span className="ml-1.5 bg-white text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Aktif Filtreleri Gösterme ve Temizleme Alanı */}
      {(selectedBrands.length > 0 || selectedNotes.length > 0 || searchTerm.trim()) && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg flex flex-wrap items-center gap-2">
          <span className="font-sans text-sm font-medium text-amber-800 mr-2">Aktif Filtreler:</span>
          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              Ara: &quot;{searchTerm}&quot;
              <button onClick={() => setSearchTerm("")} className="ml-1 text-gray-500 hover:text-gray-700">
                <XIcon size={12} />
              </button>
            </span>
          )}
          {selectedBrands.map(brand => (
            <span key={brand} className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {brand}
              <button onClick={() => removeBrandFilter(brand)} className="ml-1 text-purple-500 hover:text-purple-700">
                <XIcon size={12} />
              </button>
            </span>
          ))}
          {selectedNotes.map(note => (
            <span key={note} className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {note}
              <button onClick={() => removeNoteFilter(note)} className="ml-1 text-teal-500 hover:text-teal-700">
                <XIcon size={12} />
              </button>
            </span>
          ))}
          {(selectedBrands.length > 0 || selectedNotes.length > 0 || searchTerm.trim()) && (
            <button
              onClick={clearAllFilters}
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:underline pr-2"
            >
              <RotateCcw size={12} />
              Tümünü Temizle
            </button>
          )}
        </div>
      )}

      {/* Parfüm Listesi */}
      <div>
        {filteredPerfumes.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
            {filteredPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FilterIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-sans mb-2">Sonuç Bulunamadı</p>
            <p className="text-gray-400 font-sans">Filtrelerinizi değiştirmeyi veya arama teriminizi kontrol etmeyi deneyin.</p>
          </div>
        )}
      </div>

      {isFilterModalOpen && (
        <FilterModal
          allBrands={allAvailableBrands}
          allNotes={allAvailableNotes}
          initialSelectedBrands={selectedBrands}
          initialSelectedNotes={selectedNotes}
          onApplyFilters={applyFiltersFromModal} // Fonksiyon adını değiştirdim
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </div>
  );
}