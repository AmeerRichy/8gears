"use client";

import { useFormContext } from "react-hook-form";
import type { Product } from "@/app/types/product";
import ProductSectionImage from "./ProductSectionImage";

type ProductCinematicHeroProps = {
  product: Partial<Product>;
};

export default function ProductCinematicHero({
  product,
}: ProductCinematicHeroProps) {
  const formContext = useFormContext();
  const isEditing = !!formContext;

  if (!isEditing && !product?.lifestyleImage) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full">
        <div className={`group relative w-full ${isEditing && !product?.lifestyleImage ? "aspect-video" : ""}`}>
          {isEditing && (
            <div
              className="
                absolute
                left-4
                top-4
                z-40
                rounded-full
                bg-orange-600
                px-4
                py-2
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white
                shadow-2xl
                animate-pulse

                sm:left-6
                sm:top-6
                sm:text-[9px]

                lg:left-12
                lg:top-12
                lg:px-6
                lg:text-[10px]
                lg:tracking-[0.3em]
              "
            >
              Cinematic lifestyle slot
            </div>

          )}
          <ProductSectionImage
            src={product?.lifestyleImage || ""}
            alt={product?.title ? `${product.title} lifestyle` : "Product lifestyle"}
            editablePath="lifestyleImage"
            guidelineKey="lifestyle"
            fit="natural"
            className="w-full"
          />
        </div>

        {/* Bottom decorative bar */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            z-20
            h-[2px]
            w-full
            bg-gradient-to-r
            from-transparent
            via-orange-500
            to-transparent
            opacity-30
          "
        />
      </div>
    </section>
  );
}
