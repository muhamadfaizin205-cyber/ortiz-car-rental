export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
  aboutUs: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  safety: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=800&auto=format&fit=crop",
  valueProps: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop",

  cars: {
    "mercedes-benz-s-class": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop",
    "bmw-7-series": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop",
    "lexus-ls-500": "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=600&auto=format&fit=crop",
    "toyota-alphard": "https://images.unsplash.com/photo-1570356528233-b442cf2de345?q=80&w=600&auto=format&fit=crop",
    "toyota-vellfire": "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=600&auto=format&fit=crop",
    "toyota-land-cruiser": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=600&auto=format&fit=crop",
    "toyota-agya": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop",
    "honda-brio": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
    "suzuki-ignis": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop",
    "toyota-avanza": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop",
    "toyota-innova-reborn": "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=600&auto=format&fit=crop",
    "mitsubishi-xpander": "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop",
  } as Record<string, string>,

  fallback: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop",
  articleFallback: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
};

export function getCarImage(car: { imagePath?: string | null; slug: string }): string {
  if (car.imagePath && car.imagePath.length > 10) return car.imagePath;
  return IMAGES.cars[car.slug] || IMAGES.fallback;
}

export function getArticleImage(article: { imagePath?: string | null }): string {
  if (article.imagePath && article.imagePath.length > 10) return article.imagePath;
  return IMAGES.articleFallback;
}
