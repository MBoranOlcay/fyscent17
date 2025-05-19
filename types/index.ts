export interface Review {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
  }
  
  export interface FragranceNote {
    name: string;
    type: 'top' | 'heart' | 'base';
    description: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    longDescription: string;
    price: number;
    discountPrice?: number;
    ratings: {
      average: number;
      count: number;
    };
    sizes: {
      value: string;
      price: number;
      isAvailable: boolean;
    }[];
    images: string[];
    fragranceNotes: FragranceNote[];
    details: {
      gender: string;
      family: string;
      concentration: string;
      releaseYear: number;
      recommendedUse: string[];
      longevity: string;
      sillage: string;
    };
    reviews: Review[];
    relatedProducts: string[];
}

// YENİ EKLENEN BLOGPOST TİPİ
export interface BlogPost {
  slug: string;
  title: string;
  date: string; // Veya Date tipi olarak da düşünebilirsin, string daha basit
  summary: string;
  content: string; // HTML içeriği
  metaTitle: string;
  metaDescription: string;
  coverImage: string; // Resim yolu
}