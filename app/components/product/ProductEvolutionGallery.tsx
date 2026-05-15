"use client";

import { useFormContext } from "react-hook-form";
import { EditableImage, EditableArray } from "@/app/components/admin/CMSComponents";

type ProductEvolutionGalleryProps = {
    product: any;
};

export default function ProductEvolutionGallery({
    product,
}: ProductEvolutionGalleryProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;
    const images = product?.bottomGallery || [];
    const cmsImages = isEditing && images.length === 0 ? [''] : images;

    if (!isEditing && (!Array.isArray(images) || images.length === 0)) return null;

    const renderGalleryItem = (index: number, className: string) => (
        <div className={`overflow-hidden rounded-[20px] bg-[#eeeeee] ${className}`}>
            {isEditing ? (
                <EditableImage
                    src={cmsImages[index] || ""}
                    path={`bottomGallery[${index}]`}
                    className="h-full w-full"
                />
            ) : (
                cmsImages[index] && (
                    <img
                        src={cmsImages[index]}
                        alt={`${product?.title || "Product"} gallery image ${index + 1}`}
                        className="h-full w-full object-cover"
                    />
                )
            )}
        </div>
    );

    return (
        <section className="w-full bg-white border-t border-gray-100">
            <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[72px] pt-[58px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[56px] max-[768px]:pt-[42px]">
                <div className="mb-12 text-center">
                    <h2 className="text-center font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
                        Evolution Gallery
                    </h2>
                </div>

                {isEditing ? (
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200">
                        <EditableArray
                            items={cmsImages}
                            path="bottomGallery"
                            label="Gallery Shot"
                            newItemTemplate=""
                            renderItem={(url, index) => (
                                <div key={index} className="aspect-video rounded-xl overflow-hidden shadow-lg border border-white">
                                    <EditableImage src={url} path={`bottomGallery[${index}]`} className="w-full h-full" />
                                </div>
                            )}
                        />
                        <div className="mt-8 grid grid-cols-5 gap-4">
                            {/* Visual Preview of the Masonry structure if needed, but the Array is enough */}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[627px_564px_508px] justify-center gap-[20px] max-[1800px]:grid-cols-[minmax(0,627px)_minmax(0,564px)_minmax(0,508px)] max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1">
                            {renderGalleryItem(0, "h-[836px] w-full max-[1400px]:h-[690px] max-[1200px]:h-[620px] max-[700px]:h-[560px] max-[480px]:h-[420px]")}

                            <div className="grid h-[836px] w-full grid-rows-[570px_226px] gap-[40px] max-[1400px]:h-[690px] max-[1400px]:grid-rows-[470px_180px] max-[1200px]:h-[620px] max-[1200px]:grid-rows-[420px_170px] max-[700px]:h-auto max-[700px]:grid-rows-none max-[700px]:gap-[20px]">
                                {renderGalleryItem(1, "h-full w-full max-[700px]:h-[420px] max-[480px]:h-[320px]")}
                                {renderGalleryItem(2, "h-full w-full max-[700px]:h-[220px] max-[480px]:h-[170px]")}
                            </div>

                            {renderGalleryItem(3, "h-[836px] w-full max-[1400px]:h-[690px] max-[1200px]:col-span-2 max-[1200px]:h-[620px] max-[700px]:col-span-1 max-[700px]:h-[560px] max-[480px]:h-[420px]")}
                        </div>

                        {images[4] && (
                            <div className="mx-auto mt-[40px] h-[757px] w-full max-w-[1780px] overflow-hidden rounded-[20px] bg-[#eeeeee] max-[1400px]:h-[620px] max-[1200px]:h-[520px] max-[768px]:mt-[20px] max-[768px]:h-[420px] max-[480px]:h-[300px]">
                                <img
                                    src={images[4]}
                                    alt={`${product?.title || "Product"} gallery image 5`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}