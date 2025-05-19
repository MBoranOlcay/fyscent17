// components/ProductGallery.tsx
"use client";

import React, { useState, MouseEvent } from 'react'; // MouseEvent eklendi
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'; // ZoomOut eklendi

interface ProductGalleryProps {
  images?: string[]; // Birden fazla resim yolu alacak
  productName: string;
}

export default function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  if (!images || images.length === 0) {
    return (
      <div className="sticky top-24 md:top-28">
        <div className="relative w-full aspect-[3/4] rounded-lg bg-gray-100 flex items-center justify-center shadow-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p className="absolute bottom-4 text-xs text-gray-500">Görsel bulunmuyor</p>
        </div>
      </div>
    );
  }

  const mainImageUrl = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false); // Resim değiştiğinde zoom'u kapat
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false); // Resim değiştiğinde zoom'u kapat
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsZoomed(false); // Resim değiştiğinde zoom'u kapat
  };

  const toggleZoom = (event?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (event) event.stopPropagation(); // Buton tıklamasının ana resim tıklamasını tetiklemesini engelle
    setIsZoomed(!isZoomed);
    if (isZoomed) { // Eğer zoom'dan çıkılıyorsa, pozisyonu sıfırla (opsiyonel)
        setZoomPosition({ x: 50, y: 50 }); // Ortaya dönsün
    }
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => {
    // Zoom'dayken imleç dışarı çıkarsa zoom'u kapatmak yerine pozisyonu ortada tutabiliriz
    // veya istersen kapatabilirsin:
    // if (isZoomed) {
    //   setIsZoomed(false);
    // }
  };

  return (
    <div className="sticky top-24 md:top-28 flex flex-col"> {/* Ana sarmalayıcıya flex-col eklendi */}
      {/* Ana Resim Alanı */}
      <div 
        className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl border border-gray-200 mb-4 
                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => toggleZoom()} // Ana resme tıklayınca zoom'u toggle et
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: isZoomed ? 'scale(1.75)' : 'scale(1)', // Zoom ölçeği
            transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center center'
          }}
        >
          {mainImageUrl && ( // mainImageUrl var mı diye kontrol et
            <Image
              src={mainImageUrl}
              alt={`${productName} - Resim ${currentImageIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }} // Zoom'da kenarların kaybolmaması için 'contain' daha iyi olabilir
              priority={currentImageIndex === 0} // Sadece ilk resim öncelikli
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={isZoomed ? '' : 'hover:scale-105 transition-transform duration-300'} // Zoom değilken hover efekti
            />
          )}
        </div>
        
        {/* Zoom Butonu */}
        <button
          className="absolute top-3 right-3 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all z-10"
          onClick={(e) => toggleZoom(e)}
          aria-label={isZoomed ? "Zoom'u kapat" : "Yakınlaştır"}
        >
          {isZoomed ? <ZoomOut size={18} className="text-gray-700" /> : <ZoomIn size={18} className="text-gray-700" />}
        </button>

        {/* Navigasyon Okları (Ana Resim Üzerinde) */}
        {images.length > 1 && !isZoomed && ( // Sadece birden fazla resim varsa ve zoom'da değilse göster
          <>
            <button 
              className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              aria-label="Önceki resim"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button 
              className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              aria-label="Sonraki resim"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Galerisi */}
      {images.length > 1 && ( // Sadece birden fazla resim varsa thumbnail'leri göster
        <div className="flex justify-center space-x-2 overflow-x-auto py-2"> {/* Yatay scroll için */}
          {images.map((imgSrc, index) => (
            <button
              key={index}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all duration-200
                ${index === currentImageIndex 
                  ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-1' 
                  : 'border-gray-200 hover:border-amber-400 opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Resim ${index + 1}'e geç`}
            >
              <Image 
                src={imgSrc} 
                alt={`Thumbnail ${productName} ${index + 1}`} 
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}