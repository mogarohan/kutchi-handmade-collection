"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import WhatsAppOrderButton from "./whatsapp-btn";

interface ProductViewProps {
  product: {
    id: string;
    slug: string;
    name: string;
    original_price: number;
    sale_price: number;
    category: string;
    description?: string;
    image_url: string | null;
    gallery_urls: string[] | null;
    stock: number;
    available_sizes?: string[];
  };
  whatsappNumberSetting: string;
}

import { X } from "lucide-react";

export default function ProductView({ product, whatsappNumberSetting }: ProductViewProps) {
  const [activeImage, setActiveImage] = useState<string | null>(product.image_url);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.available_sizes && product.available_sizes.length > 0 ? product.available_sizes[0] : undefined
  );
  const discount = Math.round(((product.original_price - product.sale_price) / product.original_price) * 100);

  // Combine main image with gallery images for the thumbnails
  const allImages = [];
  if (product.image_url) allImages.push(product.image_url);
  if (product.gallery_urls && product.gallery_urls.length > 0) {
    allImages.push(...product.gallery_urls);
  }

  return (
    <>
      {/* Lightbox / Fullscreen Zoom */}
      {isZoomed && activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={activeImage} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain select-none touch-pinch-zoom"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Main Image */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-4 md:sticky md:top-24 self-start">
          <div 
            className="w-full max-w-[400px] mx-auto bg-[#F9F6F0] rounded-full overflow-hidden relative flex items-center justify-center border-[8px] border-primary shadow-2xl aspect-square cursor-zoom-in group hover:border-primary/80 transition-colors duration-500"
            onClick={() => activeImage && setIsZoomed(true)}
          >
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground">
                {discount}% OFF
              </Badge>
            )}
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <span className="text-muted-foreground/50">Main Image Placeholder</span>
            )}
          </div>


      </div>

      {/* Right Column: Product Details & Thumbnails */}
      <div className="md:col-span-6 lg:col-span-7 flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{product.category}</span>
          {product.stock > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-600">Out of Stock</Badge>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-3 shrink-0 sm:mt-1">
            <span className="text-3xl font-bold text-primary">₹{product.sale_price}</span>
            {product.original_price > 0 && (
              <span className="text-lg text-muted-foreground line-through">₹{product.original_price}</span>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-wrap text-lg">
          {product.description || "No description provided."}
        </p>

        {product.available_sizes && product.available_sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.available_sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}



        {/* Thumbnails moved to Product Details Column */}
        {allImages.length > 1 && (
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3">Product Views</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {allImages.map((imgUrl, index) => (
                <div 
                  key={index} 
                  onMouseEnter={() => setActiveImage(imgUrl)}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 shrink-0 rounded-md cursor-pointer overflow-hidden transition-all flex items-center justify-center bg-white border-2 ${activeImage === imgUrl ? 'border-primary' : 'border-transparent hover:border-primary/50 shadow-sm'}`}
                >
                  <img src={imgUrl} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 space-y-3">
          <h3 className="font-semibold text-foreground">Highlights</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> 100% Handmade
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Authentic Design
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Premium Quality
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 bg-white p-4 rounded-xl border border-border/50 shadow-sm">
          <WhatsAppOrderButton 
            productId={product.id}
            productName={product.name} 
            originalPrice={product.original_price}
            salePrice={product.sale_price} 
            stock={product.stock}
            productSlug={product.slug}
            productImage={product.image_url || undefined}
            whatsappNumber={whatsappNumberSetting.replace(/[^0-9]/g, '')}
            selectedSize={selectedSize}
          />
        </div>

        <div className="mt-auto pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Premium Quality</p>
              <p className="text-xs text-muted-foreground">Handmade</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Secure Order</p>
              <p className="text-xs text-muted-foreground">Via WhatsApp</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Fast Shipping</p>
              <p className="text-xs text-muted-foreground">Across India</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
