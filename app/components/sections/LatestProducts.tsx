"use client";

import { useRouter } from "next/navigation";
import ProductCard from "@/components/productcard";
import { useEffect, useState } from "react";
import { ProductSkeleton } from "@/components/Skeleton";

export default function LatestProducts() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned non-array data:", data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const latestProducts = [...products].slice(-4).reverse();

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1920px] px-[24px] py-[72px] sm:px-[40px] md:py-[88px] lg:px-[70px] lg:py-[100px] xl:px-[72px]">
        {/* HEADER */}
        <div className="mb-[42px] flex items-center justify-between gap-[30px]">
          {/* Title */}
          <h2 className="font-[var(--font-sf-pro)] text-[34px] font-normal leading-none tracking-[-1px] text-black sm:text-[40px] lg:text-[44px]">
            Latest{" "}
            <span className="font-bold">
              Showcase
            </span>
          </h2>

          {/* Explore More - Desktop */}
          <button
            onClick={() => router.push("/category?cat=all")}
            className="group hidden h-[52px] w-[205px] items-center justify-center gap-[12px] rounded-full border border-black bg-transparent font-[var(--font-sf-pro)] text-[14px] font-medium text-black transition-all duration-300 hover:bg-black hover:text-white sm:flex"
          >
            <span>Explore More</span>

            <span className="text-[17px] leading-none transition-transform duration-300 group-hover:translate-x-[4px]">
              →
            </span>
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 gap-x-[28px] gap-y-[42px] sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, index) => (
                <div key={index} className="w-full">
                  <ProductSkeleton />
                </div>
              ))
            : latestProducts.map((product) => (
                <div
                  key={product._id}
                  className="w-full min-w-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* MOBILE EXPLORE BUTTON */}
        <div className="mt-[38px] flex justify-center sm:hidden">
          <button
            onClick={() => router.push("/category?cat=all")}
            className="group flex h-[50px] w-[200px] items-center justify-center gap-[10px] rounded-full border border-black bg-transparent font-[var(--font-sf-pro)] text-[14px] font-medium text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            Explore More

            <span className="text-[17px] leading-none transition-transform duration-300 group-hover:translate-x-[4px]">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}