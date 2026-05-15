"use client";

import { useFormContext } from "react-hook-form";
import { EditableImage } from "@/app/components/admin/CMSComponents";

type ProductCinematicHeroProps = {
    product: any;
};

export default function ProductCinematicHero({
    product,
}: ProductCinematicHeroProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;

    if (!isEditing && !product?.lifestyleImage) {
        return null;
    }

    return (
        <section className="relative w-full bg-slate-950 overflow-hidden">
            {/* Large Cinematic Image Section */}
            <div className="w-full h-[100vh] min-h-[700px] relative">
                {isEditing ? (
                    <div className="w-full h-full group">
                        <div className="absolute top-12 left-12 z-40 bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl animate-pulse">
                            Cinematic lifestyle slot
                        </div>
                        <EditableImage
                            src={product?.lifestyleImage || ""}
                            path="lifestyleImage"
                            className="w-full h-full"
                        />
                    </div>
                ) : (
                    product?.lifestyleImage && (
                        <img
                            src={product.lifestyleImage}
                            alt={product?.title || "Product lifestyle"}
                            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                        />
                    )
                )}

                {/* Cinematic Overlays */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-transparent pointer-events-none" /> */}

                {/* Bottom decorative bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30" />
            </div>
        </section>
    );
}