// ./src/components/ProductDetailGallery.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ProductDetailGalleryProps {
  mainImage: string;
  imagesJson?: string | null;
  productName: string;
}

export function ProductDetailGallery({ mainImage, imagesJson, productName }: ProductDetailGalleryProps) {
  const reduceMotion = useReducedMotion();
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
      {/* Vista principal 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
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

      {/* Miniaturas */}
      {imagesList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label={`Imágenes de ${productName}`}>
          {imagesList.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                aria-pressed={isSelected}
                className={`relative h-24 w-[72px] flex-shrink-0 overflow-hidden rounded-[14px] border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#452453]'
                    : 'border-[#e8e3ec] hover:border-[#caa8d3] opacity-75 hover:opacity-100'
                }`}
                aria-label={`Ver imagen ${idx + 1} de ${productName}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="72px"
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
