"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/productcard";
import { ProductSkeleton } from "@/components/Skeleton";
import ContactSection from "@/components/ContactSection";
import { Search, Filter, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/categories").then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        if (Array.isArray(productsData)) setProducts(productsData);
        if (Array.isArray(categoriesData)) setCategories(categoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const selectedCategoryValue = (searchParams.get("cat") || "all").toLowerCase();

  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Category
    if (selectedCategoryValue !== "all") {
      result = result.filter(
        (p) => String(p.category).toLowerCase() === selectedCategoryValue
      );
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.baseDescription?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          String(p.category).toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategoryValue, products, searchQuery]);

  return (
    <section className="bg-slate-50 py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col items-center text-center mb-12">
           <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-8 rounded-full bg-orange-600" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Armory Access</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Mission <span className="text-slate-300">Catalog</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by gear name, brand, or mission class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none shadow-sm focus:shadow-2xl focus:border-orange-600 transition-all text-slate-900 font-bold placeholder-slate-400"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => router.push("/category?cat=all")}
            className={cn(
              "px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
              selectedCategoryValue === "all"
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                : "bg-white text-slate-500 border border-slate-100 hover:border-orange-600 hover:text-orange-600"
            )}
          >
            All Gear
          </button>
          {categories.map((cat) => {
            const isActive = cat.name.toLowerCase() === selectedCategoryValue;
            return (
              <button
                key={cat._id}
                onClick={() => router.push(`/category?cat=${cat.name.toLowerCase()}`)}
                className={cn(
                  "px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                  isActive
                    ? "bg-orange-600 text-white shadow-xl shadow-orange-900/20"
                    : "bg-white text-slate-500 border border-slate-100 hover:border-orange-600 hover:text-orange-600"
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100">
             <Filter size={48} className="mx-auto text-slate-200 mb-6" />
             <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Zero Gear Detected</h3>
             <p className="text-slate-500 font-medium mt-2">No items match your current mission filters.</p>
          </div>
        )}
      </div>

      <div className="mt-24">
        <ContactSection />
      </div>
    </section>
  );
}
