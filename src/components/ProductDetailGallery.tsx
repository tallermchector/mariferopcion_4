// ./src/components/ProductDetailGallery.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailGalleryProps {
  mainImage: string;
  imagesJson?: string | null;
  productName: string;
}

export function ProductDetailGallery({ mainImage, imagesJson, productName }: ProductDetailGalleryProps) {
  let imagesList: string[] = [mainImage];
  if (imagesJson) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imagesList = parsed;
      }
    } catch {
      // fallback to mainImage
    }
  }

  const [selectedImage, setSelectedImage] = useState(imagesList[0] || mainImage);

  return (
    <div className="space-y-4">
      {/* Vista principal con transición suave (3:4 portrait ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-[#FAF9F7] border border-[rgba(26,22,29,0.08)] shadow-diffused">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative h-full w-full"
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Miniaturas interactivas */}
      {imagesList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imagesList.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-24 w-18 flex-shrink-0 overflow-hidden rounded-[16px] border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C84B6B] ring-2 ring-[#C84B6B]/20 scale-95'
                    : 'border-[rgba(26,22,29,0.08)] hover:border-[#C84B6B]/50 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Ver imagen ${idx + 1} de ${productName}`}
              >
                <Image
                  src={img}
                  alt={`${productName} miniatura ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductDetailGallery;

