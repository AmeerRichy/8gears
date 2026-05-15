// src/app/components/product/ProductYouMightAlsoLike.tsx

"use client";

import ProductCard from "@/app/components/productcard";
import type { Product } from "@/app/types/product";

type ProductYouMightAlsoLikeProps = {
    products?: Product[];
};

export default function ProductYouMightAlsoLike({
    products = [],
}: ProductYouMightAlsoLikeProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-white">
            <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[72px] pt-[58px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[56px] max-[768px]:pt-[42px]">
                <h2 className="text-center font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
                    You Might Also Like
                </h2>

                <div className="mt-[56px] grid grid-cols-4 justify-items-center gap-[28px] max-[1500px]:gap-[22px] max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-[42px]">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}