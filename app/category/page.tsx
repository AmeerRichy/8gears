import React, { Suspense } from "react";

import CategoryHero from "@/app/components/sections/CategoryHero";
import CategoryListing from "@/app/components/sections/CategoryListing";

import Footer from "@/components/footer";
import ContactSection from "@/components/ContactSection";

import connectDB from "@/app/lib/db/mongodb";
import Category from "@/app/models/Category";

import {
  cleanSeoText,
  createPageMetadata,
} from "@/app/lib/seo";

type CategoryPageProps = {
  searchParams: Promise<{
    cat?: string | string[];
  }>;
};

/* =========================================================
   METADATA
========================================================= */
export async function generateMetadata({
  searchParams,
}: CategoryPageProps) {
  const params = await searchParams;

  const selected = Array.isArray(params.cat)
    ? params.cat[0]
    : params.cat;

  const normalized = (selected || "all").toLowerCase();

  if (normalized === "all") {
    return createPageMetadata({
      title: "Motorcycle Riding Gear Collection",
      description:
        "Browse the complete 8-Gear collection of premium motorcycle riding apparel and protective gear for comfort, performance, and everyday riding.",
      path: "/category",
    });
  }

  try {
    await connectDB();

    const categories = await Category.find({})
      .select("name description image")
      .lean();

    const category = categories.find(
      (item) =>
        item.name.toLowerCase() === normalized
    );

    if (!category) {
      throw new Error("Category not found");
    }

    return createPageMetadata({
      title: `${category.name} Motorcycle Riding Gear`,
      description:
        cleanSeoText(category.description) ||
        `Browse 8-Gear ${category.name.toLowerCase()} designed for motorcycle riders seeking protection, comfort, and performance.`,
      path: `/category?cat=${encodeURIComponent(
        category.name.toLowerCase()
      )}`,
      image: category.image || undefined,
    });
  } catch {
    return createPageMetadata({
      title: "Motorcycle Riding Gear Collection",
      description:
        "Browse premium motorcycle riding apparel and protective gear from 8-Gear.",
      path: "/category",
      noIndex: true,
    });
  }
}

/* =========================================================
   PAGE
========================================================= */
export default function CategoryPage() {
  return (
    <>
      <main>
        {/* =====================================================
            CATEGORY HERO
        ====================================================== */}
        <Suspense
          fallback={
            <div className="h-24 bg-[#FCF8F8]" />
          }
        >
          <CategoryHero />
        </Suspense>

        {/* =====================================================
            CATEGORY LISTING

            This is where category links land.
        ====================================================== */}
        <section id="category-listing">
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#FCF8F8]" />
            }
          >
            <CategoryListing />
          </Suspense>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#FCF8F8]" />
          }
        >
          <ContactSection />
        </Suspense>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8F8]" />
        }
      >
        <Footer />
      </Suspense>
    </>
  );
}