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
        if (Array.isArray(data)) setProducts(data);
        else console.error("API returned non-array data:", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const latestProducts = [...products].slice(-4).reverse();

  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-8 xl:px-10">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="h-2 w-8 rounded-full bg-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
                Fresh Arrivals
              </span>
            </div>

            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 md:text-5xl">
              Latest Gear{" "}
              <span className="text-slate-300">Deployments</span>
            </h2>
          </div>

          <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500">
            New launches, trending picks, and must-have essentials curated for
            professional riders.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            : latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => router.push("/category?cat=all")}
            className="group flex items-center gap-3 rounded-2xl bg-slate-900 px-12 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-200 transition-all hover:bg-orange-600 active:scale-95"
          >
            Explore Global Catalog
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}