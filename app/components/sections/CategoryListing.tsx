"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import ProductCard from "@/components/productcard";
import { ProductSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";

export default function CategoryListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const selectedCategoryValue = (
    searchParams.get("cat") || "all"
  ).toLowerCase();

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategoryValue !== "all") {
      result = result.filter(
        (product) =>
          String(product.category || "").toLowerCase() ===
          selectedCategoryValue
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.baseDescription?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          String(product.category || "")
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [products, searchQuery, selectedCategoryValue]);

  useEffect(() => {
    setAnimationCycle((previousCycle) => previousCycle + 1);
  }, [selectedCategoryValue, searchQuery]);

  const updateCategory = (categoryName: string) => {
    const normalizedCategory = categoryName.toLowerCase();

    router.push(
      `/category?cat=${encodeURIComponent(normalizedCategory)}`,
      {
        scroll: false,
      }
    );
  };

  return (
    <section className="min-h-screen bg-white px-[24px] pb-[100px] pt-[60px] sm:px-[40px] lg:px-[72px] lg:pt-[70px]">
      <div className="mx-auto w-full max-w-[1904px]">
        {/* =========================================================
            TOP TITLE AND PRODUCT COUNT
        ========================================================= */}
        <div className="flex items-start justify-between gap-6">
          <h1 className="font-[var(--font-sf-pro)] text-[34px] font-normal leading-none tracking-[-1.5px] text-black sm:text-[42px] lg:text-[46px]">
            The Full{" "}
            <span className="font-bold tracking-[-2px]">Collection</span>
          </h1>

          <p className="hidden pt-[10px] font-[var(--font-sf-pro)] text-[12px] font-normal tracking-[0.08em] text-[#8ba0bf] sm:block">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* =========================================================
            FILTER BUTTONS AND SEARCH BAR
        ========================================================= */}
        <div className="mt-[54px] flex flex-col gap-[24px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-[18px]">
            <button
              type="button"
              onClick={() => updateCategory("all")}
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full border px-[28px] font-[var(--font-sf-pro)] text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
                selectedCategoryValue === "all"
                  ? "border-black bg-black text-white"
                  : "border-[#9c9c9c] bg-white text-[#5c5c5c] hover:border-black hover:text-black"
              )}
            >
              All Gear
            </button>

            {categories.map((category) => {
              const isActive =
                String(category.name || "").toLowerCase() ===
                selectedCategoryValue;

              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => updateCategory(category.name)}
                  className={cn(
                    "flex h-[44px] items-center justify-center rounded-full border px-[28px] font-[var(--font-sf-pro)] text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-[#9c9c9c] bg-white text-[#5c5c5c] hover:border-black hover:text-black"
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-[680px]">
            <Search
              size={20}
              strokeWidth={1.7}
              className="pointer-events-none absolute left-[27px] top-1/2 -translate-y-1/2 text-[#777777]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by gear name, brand, or mission class..."
              className="h-[64px] w-full rounded-full border border-[#e6e6e6] bg-white pl-[60px] pr-[28px] font-[var(--font-sf-pro)] text-[14px] font-normal text-black outline-none transition-colors duration-300 placeholder:text-[#777777] focus:border-[#b5b5b5]"
            />
          </div>
        </div>

        {/* Mobile Product Counter */}
        <p className="mt-[20px] font-[var(--font-sf-pro)] text-[12px] font-normal tracking-[0.08em] text-[#8ba0bf] sm:hidden">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* =========================================================
            PRODUCTS GRID
        ========================================================= */}
        <div className="mt-[38px]">
          {loading ? (
            <div className="grid grid-cols-1 gap-x-[28px] gap-y-[34px] sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-[28px] gap-y-[34px] sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={`${animationCycle}-${product._id}`}
                  className="product-card-animation"
                  style={{
                    animationDelay: `${index * 65}ms`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[20px] border border-[#eeeeee] bg-[#fafafa] px-5 text-center">
              <Filter
                size={42}
                strokeWidth={1.4}
                className="mb-[18px] text-[#c4c4c4]"
              />

              <h3 className="font-[var(--font-sf-pro)] text-[22px] font-semibold tracking-[-0.4px] text-black">
                No Products Found
              </h3>

              <p className="mt-[8px] font-[var(--font-sf-pro)] text-[14px] font-normal text-[#777777]">
                Try another category or search with a different keyword.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .product-card-animation {
          opacity: 0;
          transform: translateY(20px);
          animation: productCardFadeUp 500ms ease-out forwards;
        }

        @keyframes productCardFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}