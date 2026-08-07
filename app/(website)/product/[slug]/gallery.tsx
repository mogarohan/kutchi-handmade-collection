"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ProductGalleryProps {
  mainImage: string | null;
  galleryUrls: string[] | null;
  productName: string;
  discount: number;
}

export default function ProductGallery({ mainImage, galleryUrls, productName, discount }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(mainImage);
  
  // Combine main image with gallery images for the thumbnails
  const allImages = [];
  if (mainImage) allImages.push(mainImage);
  if (galleryUrls && galleryUrls.length > 0) {
    allImages.push(...galleryUrls);
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Thumbnails (Above Main Image) */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {allImages.map((imgUrl, index) => (
            <div 
              key={index} 
              onMouseEnter={() => setActiveImage(imgUrl)}
              onClick={() => setActiveImage(imgUrl)}
              className={`w-20 h-20 shrink-0 rounded-md cursor-pointer overflow-hidden transition-all flex items-center justify-center bg-white border-2 ${activeImage === imgUrl ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
            >
              <img src={imgUrl} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-contain p-1" />
            </div>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="w-full bg-white rounded-xl overflow-hidden relative flex items-center justify-center border border-border/50 max-h-[500px]">
        {discount > 0 && (
          <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground">
            {discount}% OFF
          </Badge>
        )}
        {activeImage ? (
          <img src={activeImage} alt={productName} className="w-full h-full object-contain p-4 transition-opacity duration-300 cursor-zoom-in" />
        ) : (
          <span className="text-muted-foreground/50">Main Image Placeholder</span>
        )}
      </div>
    </div>
  );
}
