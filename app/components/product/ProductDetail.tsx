// src/app/components/product/ProductDetail.tsx

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { PRODUCT_SECTIONS, hasSectionContent, type ProductSectionKey } from "@/lib/productSections";
import { useCart } from "@/app/context/CartContext";

import ProductHero from "@/app/components/product/ProductHero";
import ProductCloseUp from "@/app/components/product/ProductCloseUp";
import ProductYouMightAlsoLike from "@/app/components/product/ProductYouMightAlsoLike";
import ProductEngineered from "@/app/components/product/ProductEngineered";
import ProductCinematicHero from "@/app/components/product/ProductCinematicHero";
import ProductStyleAesthetics from "@/app/components/product/ProductStyleAesthetics";
import ProductReviewsSection from "@/app/components/product/ProductReviewsSection";
import ProductEvolutionGallery from "@/app/components/product/ProductEvolutionGallery";
import ContactSection from "../ContactSection";
import Footer from "../footer";

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
  const formContext = useFormContext();

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

  const showSection = (key: ProductSectionKey, content: unknown) =>
    isCMS || (product.sectionSettings?.[key] === true && hasSectionContent(content));

  const sectionContent = (key: ProductSectionKey, children: ReactNode) => {
    if (!isCMS) return children;
    const disabled = product.sectionSettings?.[key] !== true;
    return (
      <div className="relative">
        <div
          inert={disabled}
          aria-hidden={disabled ? true : undefined}
          className={disabled ? "pointer-events-none select-none blur-sm opacity-50" : undefined}
        >
          {children}
        </div>
        {disabled && (
          <div className="absolute inset-0 z-10 flex cursor-not-allowed items-start justify-center bg-white/20 px-4 pt-12">
            <p className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 shadow-sm">
              Turn this section on to add images or edit content.
            </p>
          </div>
        )}
      </div>
    );
  };

  const sectionToggle = (key: ProductSectionKey) => {
    if (!isCMS || !formContext) return null;
    const enabled = product.sectionSettings?.[key] === true;
    const label = PRODUCT_SECTIONS.find((section) => section.key === key)?.label;
    return (
      <div className="flex items-center justify-between gap-4 border-y border-orange-200 bg-orange-50 px-4 py-4 sm:px-12">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-600">
            {enabled ? "On — shows on storefront when content is added." : "Off — turn on to add images or edit content."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`Show ${label} on storefront`}
          onClick={() => formContext.setValue(`sectionSettings.${key}`, !enabled, { shouldDirty: true, shouldTouch: true })}
          className="flex shrink-0 items-center gap-3 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <span className="text-sm font-semibold">{enabled ? "On" : "Off"}</span>
          <span aria-hidden="true" className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${enabled ? "bg-orange-600" : "bg-slate-400"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white text-black">
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

      {sectionToggle("closeUp")}
      {showSection("closeUp", product.closeUpSection) && (
        sectionContent("closeUp", <ProductCloseUp items={product?.closeUpSection} />)
      )}

      <ProductYouMightAlsoLike products={displayRelatedProducts} />

      {sectionToggle("engineered")}
      {showSection("engineered", product.engineeredSection) && (
        sectionContent("engineered", <ProductEngineered product={product} isCMS={isCMS} />)
      )}

      {sectionToggle("cinematic")}
      {showSection("cinematic", product.lifestyleImage) && (
        sectionContent("cinematic", <ProductCinematicHero product={product} />)
      )}

      {sectionToggle("style")}
      {showSection("style", product.stylishSection) && (
        sectionContent("style", <ProductStyleAesthetics product={product} isCMS={isCMS} />)
      )}

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

      {sectionToggle("evolution")}
      {showSection("evolution", product.bottomGallery) && (
        sectionContent("evolution", <ProductEvolutionGallery product={product} />)
      )}
      <ContactSection/>
      <Footer/>
    </div>
  );
}
