"use client";

import Image from "next/image";
import { DISPLAY_CURRENCY } from "@/lib/checkout/constants";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";
import { cn } from "@/lib/utils";
import { getOptimizedCloudinaryImage } from "@/lib/cloudinaryImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const mainVariant = product.variants?.[0] || {
    price: 0,
    comparePrice: 0,
    images: ["/placeholder.png"],
    sku: "",
    stockQuantity: 0,
  };

  const mainImage = mainVariant.images?.[0] || "/placeholder.png";
  const price = Number(mainVariant.price || 0);
  const currencySymbol = `${DISPLAY_CURRENCY} `;
  const reviewCount = (product as any)?.reviews?.reviewCount || 0;
  const rating = Number((product as any)?.reviews?.rating || 0);
  const isOutOfStock = mainVariant.stockQuantity === 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block w-full"
    >
      <article
        className="
          relative
          w-full
          overflow-hidden
          bg-white

          sm:max-w-[420px]
        "
      >
        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div
            className="
              absolute
              left-2.5
              top-2.5
              z-20

              rounded-full
              bg-black

              px-3
              py-1.5

              text-[8px]
              font-medium
              uppercase
              tracking-[0.1em]
              text-white

              sm:left-[14px]
              sm:top-[14px]
              sm:px-4
              sm:py-2
              sm:text-[10px]
            "
          >
            Out of Stock
          </div>
        )}

        {/* IMAGE */}
        <div
          className="
            relative
            aspect-[0.78]
            w-full
            overflow-hidden

            rounded-[10px]
            bg-[#eeeeee]

            sm:h-[420px]
            sm:aspect-auto
            sm:rounded-[14px]

            lg:h-[562px]
          "
        >
          <Image
            src={getOptimizedCloudinaryImage(mainImage, 720)}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-[1.035]",
              isOutOfStock && "grayscale opacity-80"
            )}
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 423px"
            priority={false}
          />
        </div>

        {/* CONTENT */}
        <div className="pt-3 sm:pt-[18px] lg:pt-[20px]">
          {/* TITLE + PRICE */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="
                line-clamp-1
                min-w-0
                flex-1

                font-[var(--font-sf-pro)]

                text-[14px]
                font-[510]
                leading-[1.2]
                tracking-[-0.2px]
                text-black

                sm:text-[17px]

                lg:text-[20px]
                lg:tracking-[-0.35px]
              "
            >
              {product.title}
            </h3>

            <p
              className="
                shrink-0

                font-[var(--font-sf-pro)]

                text-[14px]
                font-semibold
                leading-[1.2]
                tracking-[-0.15px]
                text-black

                sm:text-[17px]

                lg:text-[20px]
              "
            >
              {currencySymbol}
              {price.toFixed(2)}
            </p>
          </div>

          {/* RATING */}
          <div className="mt-1.5 flex items-center gap-1 sm:mt-2">
            <div className="flex items-center gap-[1px] text-[#f5b400]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="
                    h-[12px]
                    w-[12px]

                    sm:h-[14px]
                    sm:w-[14px]

                    lg:h-[16px]
                    lg:w-[16px]
                  "
                  strokeWidth={1.3}
                  fill={star <= Math.round(rating) ? "currentColor" : "none"}
                />
              ))}
            </div>

            <span
              className="
                font-[var(--font-sf-pro)]

                text-[11px]
                font-normal
                leading-none
                text-[#5a5a5a]

                sm:text-[13px]
                lg:text-[14px]
              "
            >
              ({reviewCount})
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!mainVariant.sku || isOutOfStock) return;

              addToCart({
                id: `${product._id}-${mainVariant.sku}`,
                productId: product._id,
                variantId: mainVariant.sku,
                title: product.title,
                name: product.title,
                price,
                color: mainVariant.color,
                size: mainVariant.size,
                image: mainImage,
                quantity: 1,
              });
            }}
            disabled={isOutOfStock}
            className={cn(
              `
                mt-3
                flex
                h-[40px]
                w-full
                items-center
                justify-center

                rounded-full

                px-4

                font-[var(--font-sf-pro)]
                text-[13px]
                font-normal
                leading-none

                transition-all
                duration-300

                active:scale-[0.985]

                sm:mt-5
                sm:h-[48px]
                sm:text-[15px]

                lg:mt-[24px]
                lg:h-[53px]
                lg:text-[16px]
              `,
              isOutOfStock
                ? "cursor-not-allowed bg-[#d9d9d9] text-[#777777]"
                : "bg-black text-white hover:bg-[#222222]"
            )}
          >
            {isOutOfStock ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      </article>
    </Link>
  );
}
