"use client";

import { useState } from "react";
import { ShoppingCart, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { InquiryModal } from "@/components/ui/inquiry-modal";

interface Props {
  productName: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  productSlug: string;
  productImage?: string;
  whatsappNumber?: string;
}

export default function WhatsAppOrderButton({ productName, originalPrice, salePrice, stock, productSlug, productImage, whatsappNumber }: Props) {
  const { items, addToCart, updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const adminPhone = whatsappNumber || "919313225740";
  
  const cartItem = items.find(item => item.id === productSlug);
  const currentQuantity = cartItem ? cartItem.quantity : 1;

  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Check out this ${productName} from Kutchi Handmade!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleContinueToWhatsApp = (customerName: string, customerPhone: string) => {
    const message = `Hello Kutchi Handmade Collection%0A%0AI would like to inquire/order:%0A*${productName}*%0AQuantity: ${currentQuantity}%0APrice: ₹${salePrice}%0ATotal: ₹${salePrice * currentQuantity}%0A%0AMy Name: ${customerName}%0AMy Phone: ${customerPhone}%0A%0APlease confirm.`;
    window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");
  };

  return (
    <>
      <InquiryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        quantity={currentQuantity}
        price={salePrice}
        onContinue={handleContinueToWhatsApp}
      />
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex gap-2 sm:gap-3">
          {!cartItem ? (
            <Button 
              className="flex-1 gap-2 order-1" 
              size="lg" 
              disabled={stock === 0}
              onClick={() => {
                addToCart({
                  id: productSlug,
                  name: productName,
                  price: salePrice,
                  originalPrice: originalPrice,
                  quantity: 1, // Default 1 piece
                  image: productImage,
                  slug: productSlug,
                });
              }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </Button>
          ) : (
            <div className="flex-1 flex items-center gap-2 order-1">
              <div className="flex items-center border-2 border-primary/20 rounded-md bg-primary/5 h-11 sm:h-12 flex-1">
                <button 
                  onClick={() => {
                    if (cartItem.quantity === 1) {
                      removeFromCart(cartItem.id);
                    } else {
                      updateQuantity(cartItem.id, cartItem.quantity - 1);
                    }
                  }}
                  className="w-10 h-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-primary">{cartItem.quantity}</span>
                <button 
                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                  disabled={cartItem.quantity >= stock && stock > 0}
                >
                  +
                </button>
              </div>
              <Button 
                variant="default"
                className="h-11 sm:h-12 px-3 sm:px-4"
                onClick={() => setIsCartOpen(true)}
              >
                View Cart
              </Button>
            </div>
          )}

          <Button 
            variant="outline" 
            size="icon" 
            className={`h-11 w-11 sm:h-12 sm:w-12 shrink-0 order-2 sm:order-3 transition-colors ${isLiked ? 'border-red-500 bg-red-50' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart size={20} className={isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground"} />
          </Button>
          
          {/* Small WhatsApp Button */}
          <button 
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-md border bg-transparent hover:bg-[#25D366]/10 transition-colors shadow-sm order-3 sm:order-2"
            style={{ color: '#25D366', borderColor: '#25D366' }}
            title="Inquire on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z"/></svg>
          </button>

          <Button 
            variant="outline" 
            size="icon" 
            className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 order-4"
            onClick={handleShare}
          >
            {isCopied ? <span className="text-xs font-bold text-primary">Copied!</span> : <Share2 size={20} className="text-muted-foreground" />}
          </Button>
        </div>
      </div>
    </>
  );
}
