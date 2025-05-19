// components/FilterModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { X as XIcon, ChevronDown, ChevronUp } from 'lucide-react'; // Chevron ikonları eklendi

interface FilterModalProps {
  allBrands: string[];
  allNotes: string[];
  initialSelectedBrands: string[];
  initialSelectedNotes: string[];
  onApplyFilters: (selectedBrands: string[], selectedNotes: string[]) => void;
  onClose: () => void;
}

// Tek bir filtre bölümünün başlığı için yeni bir bileşen (opsiyonel ama daha temiz)
interface FilterSectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  itemCount?: number; // Seçili öğe sayısını göstermek için (opsiyonel)
}

const FilterSectionHeader: React.FC<FilterSectionHeaderProps> = ({ title, isOpen, onToggle, itemCount }) => (
  <button
    onClick={onToggle}
    className="flex items-center justify-between w-full py-3 text-left text-lg font-sans font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
    aria-expanded={isOpen}
  >
    <span>
      {title}
      {itemCount !== undefined && itemCount > 0 && (
        <span className="ml-2 text-xs font-normal bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">
          {itemCount}
        </span>
      )}
    </span>
    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);


export default function FilterModal({
  allBrands,
  allNotes,
  initialSelectedBrands,
  initialSelectedNotes,
  onApplyFilters,
  onClose,
}: FilterModalProps) {
  const [tempSelectedBrands, setTempSelectedBrands] = useState<string[]>(initialSelectedBrands);
  const [tempSelectedNotes, setTempSelectedNotes] = useState<string[]>(initialSelectedNotes);

  // Yeni: Hangi filtre bölümünün açık olduğunu tutacak state'ler
  const [isBrandsOpen, setIsBrandsOpen] = useState(false); // Başlangıçta markalar kapalı olsun
  const [isNotesOpen, setIsNotesOpen] = useState(false);  // Başlangıçta notalar kapalı olsun

  useEffect(() => { /* ... (useEffect içeriği aynı) ... */
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { onClose(); } };
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [onClose]);

  const handleBrandChange = (brand: string) => { /* ... aynı ... */ setTempSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]); };
  const handleNoteChange = (note: string) => { /* ... aynı ... */ setTempSelectedNotes(prev => prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]); };
  const handleApply = () => { /* ... aynı ... */ onApplyFilters(tempSelectedBrands, tempSelectedNotes); };
  const handleReset = () => { /* ... aynı ... */ setTempSelectedBrands([]); setTempSelectedNotes([]); };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-gray-800">Filtrele</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 rounded-full hover:bg-gray-100" aria-label="Filtreleri kapat">
            <XIcon size={24} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-1 divide-y divide-gray-100"> {/* space-y-6 yerine space-y-1 ve divide */}
          
          {/* Marka Filtresi */}
          <div>
            <FilterSectionHeader
              title="Markalar"
              isOpen={isBrandsOpen}
              onToggle={() => setIsBrandsOpen(!isBrandsOpen)}
              itemCount={tempSelectedBrands.length}
            />
            {isBrandsOpen && ( // Sadece açıksa göster
              <div className="pt-2 pb-3 max-h-40 sm:max-h-48 overflow-y-auto space-y-1 pr-1"> {/* Padding ve scroll ayarı */}
                {allBrands.sort().map((brand) => (
                  <label key={brand} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-amber-50 rounded transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      checked={tempSelectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="text-sm text-gray-600 select-none">{brand}</span>
                  </label>
                ))}
                {allBrands.length === 0 && <p className="text-xs text-gray-400 p-1.5">Filtrelenecek marka bulunamadı.</p>}
              </div>
            )}
          </div>

          {/* Nota Filtresi */}
          <div>
            <FilterSectionHeader
              title="Notalar"
              isOpen={isNotesOpen}
              onToggle={() => setIsNotesOpen(!isNotesOpen)}
              itemCount={tempSelectedNotes.length}
            />
            {isNotesOpen && ( // Sadece açıksa göster
              <div className="pt-2 pb-3 max-h-40 sm:max-h-48 overflow-y-auto space-y-1 pr-1"> {/* Padding ve scroll ayarı */}
                {allNotes.map((note) => (
                  <label key={note} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-amber-50 rounded transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      checked={tempSelectedNotes.includes(note)}
                      onChange={() => handleNoteChange(note)}
                    />
                    <span className="text-sm text-gray-600 select-none">{note}</span>
                  </label>
                ))}
                {allNotes.length === 0 && <p className="text-xs text-gray-400 p-1.5">Filtrelenecek nota bulunamadı.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-5 sm:p-6 border-t border-gray-200 space-x-3 mt-auto"> {/* mt-auto eklendi */}
          <button onClick={handleReset} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150">
            Sıfırla
          </button>
          <button onClick={handleApply} className="px-7 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors duration-150 shadow-sm hover:shadow-md">
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  );
}