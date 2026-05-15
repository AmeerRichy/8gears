"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";
import { cn } from "@/lib/utils";

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
  const currencySymbol = (product as any)?.currencySymbol || "$";
  const reviewCount = (product as any)?.reviews?.reviewCount || 100;
  const rating = Number((product as any)?.reviews?.rating || 5);
  const isOutOfStock = mainVariant.stockQuantity === 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block w-full max-w-[420px]"
    >
      <article className="relative h-[705px] w-full max-w-[420px] overflow-hidden bg-white">
        {isOutOfStock && (
          <div className="absolute left-[14px] top-[14px] z-20 rounded-full bg-black px-4 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
            Out of Stock
          </div>
        )}

        <div className="relative h-[562px] w-full overflow-hidden rounded-[14px] bg-[#eeeeee]">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-[1.035]",
              isOutOfStock && "grayscale opacity-80"
            )}
            sizes="(max-width: 640px) 100vw, 423px"
            priority={false}
          />
        </div>

        <div className="pt-[20px]">
          <div className="flex items-start justify-between gap-[14px]">
            <h3 className="line-clamp-1 max-w-[280px] font-[var(--font-sf-pro)] text-[20px] font-[510] leading-[1.15] tracking-[-0.35px] text-black">
              {product.title}
            </h3>

            <p className="shrink-0 font-[var(--font-sf-pro)] text-[20px] font-semibold leading-[1.15] tracking-[-0.25px] text-black">
              {currencySymbol}
              {price.toFixed(2)}
            </p>
          </div>

          <div className="mt-[8px] flex items-center gap-[4px]">
            <div className="flex items-center gap-[1px] text-[#f5b400]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  strokeWidth={1.3}
                  fill={star <= Math.round(rating) ? "currentColor" : "none"}
                />
              ))}
            </div>

            <span className="font-[var(--font-sf-pro)] text-[14px] font-normal leading-none text-[#5a5a5a]">
              ({reviewCount})
            </span>
          </div>

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
              "mt-[24px] flex h-[53px] w-full items-center justify-center rounded-[50px] px-[99px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-none transition-all duration-300 active:scale-[0.985]",
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