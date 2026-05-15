"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function formatLabel(value: string) {
  if (!value || value === "all") return "All Products";
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryHero() {
  const searchParams = useSearchParams();
  const category = searchParams.get("cat") || "all";

  const title = formatLabel(category);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1920&auto=format&fit=crop"
          alt="Beauty Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-white">
        
        {/* Breadcrumb */}
        <div className="text-sm flex items-center gap-2 opacity-90">
          <Link href="/" className="hover:opacity-100 transition">
            Home
          </Link>

          <span>/</span>

          <Link href="/category?cat=all" className="hover:opacity-100 transition">
            Category
          </Link>

          <span>/</span>

          <span className="font-medium opacity-100">
            {title}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold">
          {title}
        </h1>

        <p className="mt-3 text-white/90 max-w-xl">
          Discover premium {title.toLowerCase()} products curated just for you.
        </p>
      </div>
    </section>
  );
}
