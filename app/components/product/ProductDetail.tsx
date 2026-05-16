// src/app/components/product/ProductDetail.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/app/context/CartContext";

import ProductHero from "@/app/components/product/ProductHero";
import ProductCloseUp from "@/app/components/product/ProductCloseUp";
import ProductYouMightAlsoLike from "@/app/components/product/ProductYouMightAlsoLike";
import ProductEngineered from "@/app/components/product/ProductEngineered";
import ProductCinematicHero from "@/app/components/product/ProductCinematicHero";
import ProductStyleAesthetics from "@/app/components/product/ProductStyleAesthetics";
import ProductReviewsSection from "@/app/components/product/ProductReviewsSection";
import ProductEvolutionGallery from "@/app/components/product/ProductEvolutionGallery";

export default function ProductDetail({
  product,
  relatedProducts = [],
  isCMS = false,
}: {
  product: any;
  relatedProducts?: any[];
  isCMS?: boolean;
}) {
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [reviewStats, setReviewStats] = useState({
    reviewCount: product?.reviews?.reviewCount || 0,
    rating: product?.reviews?.rating || 0,
  });

  // Sync with product prop if it changes
  useEffect(() => {
    setReviewStats({
      reviewCount: product?.reviews?.reviewCount || 0,
      rating: product?.reviews?.rating || 0,
    });
  }, [product?.reviews]);

  const variants = useMemo(() => {
    return Array.isArray(product?.variants) ? product.variants : [];
  }, [product]);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedColor(variants[0]?.color || "");
      setSelectedSize(variants[0]?.size || "");
    }
  }, [variants]);

  const uniqueColors = useMemo(() => {
    const map = new Map<string, string>();

    variants.forEach((variant: any) => {
      if (!variant?.color) return;

      if (!map.has(variant.color)) {
        map.set(variant.color, variant.colorHex || "#000000");
      }
    });

    return Array.from(map.entries()).map(([name, hex]) => ({
      name,
      hex,
    }));
  }, [variants]);

  const availableSizes = useMemo((): string[] => {
    const sizes = variants
      .filter((variant: any) => variant?.color === selectedColor)
      .map((variant: any) => variant?.size)
      .filter(Boolean);

    return Array.from(new Set(sizes)) as string[];
  }, [variants, selectedColor]);

  useEffect(() => {
    if (availableSizes.length === 0) return;

    if (!selectedSize || !availableSizes.includes(selectedSize)) {
      setSelectedSize(String(availableSizes[0]));
    }
  }, [availableSizes, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return null;

    return (
      variants.find(
        (variant: any) =>
          variant?.color === selectedColor && variant?.size === selectedSize
      ) || variants[0]
    );
  }, [variants, selectedColor, selectedSize]);

  const displayRelatedProducts = useMemo(() => {
    if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
      return relatedProducts;
    }

    const possibleRelated =
      product?.relatedProducts ||
      product?.recommendedProducts ||
      product?.youMightAlsoLike ||
      product?.similarProducts ||
      [];

    return Array.isArray(possibleRelated) ? possibleRelated : [];
  }, [product, relatedProducts]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const stockQuantity = Number(selectedVariant.stockQuantity || 0);

    if (stockQuantity === 0) return;

    addToCart({
      id: `${product._id}-${selectedVariant.sku}`,
      productId: product._id,
      variantId: selectedVariant.sku,
      title: product.title,
      name: product.title,
      color: selectedColor,
      colorHex: selectedVariant.colorHex || "#999999",
      size: selectedSize,
      price: selectedVariant.price,
      image: selectedVariant.images?.[0] || "",
      quantity: 1,
      stock: stockQuantity,
    });
  };

  if (!product || variants.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.4px] text-black">
            Product details unavailable
          </h2>
          <p className="mt-2 text-sm text-[#666666]">
            Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <ProductHero
        product={{
          ...product,
          reviews: reviewStats,
        }}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedVariant={selectedVariant}
        uniqueColors={uniqueColors}
        availableSizes={availableSizes}
        handleAddToCart={handleAddToCart}
      />

      <ProductCloseUp items={product?.closeUpSection} />

      <ProductYouMightAlsoLike products={displayRelatedProducts} />

      <ProductEngineered product={product} isCMS={isCMS} />

      <ProductCinematicHero product={product} />

      <ProductStyleAesthetics product={product} isCMS={isCMS} />

      {product._id && (
        <ProductReviewsSection
          productId={product._id}
          onReviewSubmitted={(stats) => {
            setReviewStats({
              reviewCount: stats.count,
              rating: stats.avg,
            });
          }}
        />
      )}

      <ProductEvolutionGallery product={product} />
    </div>
  );
}