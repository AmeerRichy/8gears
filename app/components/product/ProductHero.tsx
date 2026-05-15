"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Star,
    ChevronDown,
    Truck,
    ShieldCheck,
    BadgeCheck,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { EditableText, EditableArray } from "@/app/components/admin/CMSComponents";

type ProductHeroProps = {
    product: any;
    selectedColor: string;
    setSelectedColor: (value: string) => void;
    selectedSize: string;
    setSelectedSize: (value: string) => void;
    selectedVariant: any;
    uniqueColors: { name: string; hex: string }[];
    availableSizes: string[];
    handleAddToCart: () => void;
};

export default function ProductHero({
    product,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedVariant,
    uniqueColors,
    availableSizes,
    handleAddToCart,
}: ProductHeroProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;
    const [activeThumb, setActiveThumb] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const images =
        selectedVariant?.images && selectedVariant.images.length > 0
            ? selectedVariant.images
            : [];

    useEffect(() => {
        setActiveThumb(0);
    }, [selectedVariant?.sku]);

    const firstImage = images[activeThumb] || images[0];
    const secondImage = images[(activeThumb + 1) % images.length] || images[1];

    const reviewCount = product?.reviews?.reviewCount;
    const rating = product?.reviews?.rating;

    const price = Number(selectedVariant?.price || 0);
    const comparePrice = selectedVariant?.comparePrice
        ? Number(selectedVariant.comparePrice)
        : null;

    const productSubtitle = product?.baseDescription || product?.shortDescription;
    const currencySymbol = product?.currencySymbol || "Rs. ";
    const categoryText = product?.category?.name || product?.category;

    const featureItems = useMemo(() => {
        const source = Array.isArray(product?.advantages) && product.advantages.length > 0
            ? product.advantages
            : isEditing
                ? [{ title: "", description: "" }]
                : [];

        return source.slice(0, 3).map((item: any, index: number) => ({
            title: item?.title || "",
            description: item?.description || "",
            index,
            icon: index === 0 ? Truck : index === 1 ? ShieldCheck : BadgeCheck,
        }));
    }, [product, isEditing]);

    const accordions = useMemo(() => {
        const items = [];

        if (isEditing || product?.fullDescription || product?.description) {
            items.push({
                id: "details",
                title: "Details",
                content: product?.fullDescription || product?.description || '',
                path: 'fullDescription'
            });
        }

        if (isEditing || product?.materialCare) {
            items.push({
                id: "material-care",
                title: "Material & Care",
                content: [
                    product?.materialCare?.composition
                        ? `Composition: ${product?.materialCare?.composition}`
                        : null,
                    product?.materialCare?.careInstructions
                        ? `Care: ${product?.materialCare?.careInstructions}`
                        : null,
                ].filter(Boolean).join("\n\n"),
                isMaterialCare: true
            });
        }

        if (isEditing || product?.logistics?.shipping) {
            items.push({
                id: "shipping-delivery",
                title: "Shipping & Delivery",
                content: product?.logistics?.shipping || '',
                path: 'logistics.shipping'
            });
        }

        if (isEditing || product?.logistics?.returns) {
            items.push({
                id: "returns-exchange",
                title: "Returns and Exchange",
                content: product?.logistics?.returns || '',
                path: 'logistics.returns'
            });
        }

        return items;
    }, [product, isEditing]);

    return (
        <section className="w-full bg-white">
            <div className="mx-auto w-full max-w-[1800px] px-[36px] pb-[56px] pt-[18px] max-[1100px]:px-[24px] max-[768px]:px-4 max-[768px]:pt-4">
                {/* Breadcrumb */}
                <div className="mb-[12px] flex items-center gap-[8px] text-[12px] font-normal leading-none text-[#8a8a8a]">
                    <Link href="/" className="transition-colors hover:text-black">
                        Home
                    </Link>

                    {categoryText && (
                        <>
                            <span className="text-[#b0b0b0]">›</span>
                            <span className="truncate">{categoryText}</span>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-[minmax(0,1260px)_340px] gap-[38px] max-[1500px]:grid-cols-[minmax(0,1fr)_340px] max-[1180px]:grid-cols-[minmax(0,1fr)_330px] max-[980px]:grid-cols-1 max-[980px]:gap-[30px]">
                    {/* Sticky Left Gallery */}
                    <div className="lg:sticky lg:top-[96px] lg:self-start">
                        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-[12px] max-[768px]:grid-cols-1">
                            {/* Thumbnails */}
                            {images.length > 0 && (
                                <div className="flex flex-col gap-[10px] max-[768px]:order-2 max-[768px]:flex-row max-[768px]:overflow-x-auto max-[768px]:pb-1">
                                    {images.slice(0, 5).map((image: string, index: number) => (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() => setActiveThumb(index)}
                                            className={`h-[56px] w-[44px] shrink-0 overflow-hidden border bg-[#f1f1f1] transition-all duration-200 max-[768px]:h-[64px] max-[768px]:w-[52px] ${activeThumb === index
                                                ? "border-black"
                                                : "border-transparent hover:border-[#cfcfcf]"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product?.title || "Product"} thumbnail ${index + 1
                                                    }`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Images */}
                            <div className="grid grid-cols-[minmax(0,602px)_minmax(0,602px)] gap-[12px] max-[1500px]:grid-cols-2 max-[760px]:grid-cols-1">
                                {firstImage && (
                                    <div className="h-[799px] w-full overflow-hidden rounded-[20px] bg-[#ececec] shadow-[0_2px_7px_rgba(0,0,0,0.18)] max-[1500px]:h-[720px] max-[1180px]:h-[620px] max-[980px]:h-[680px] max-[640px]:h-[520px] max-[420px]:h-[430px]">
                                        <img
                                            src={firstImage}
                                            alt={product?.title || "Product image"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}

                                {secondImage && (
                                    <div className="h-[799px] w-full overflow-hidden rounded-[20px] bg-[#ececec] shadow-[0_2px_7px_rgba(0,0,0,0.14)] max-[1500px]:h-[720px] max-[1180px]:h-[620px] max-[980px]:h-[680px] max-[760px]:hidden">
                                        <img
                                            src={secondImage}
                                            alt={`${product?.title || "Product"} detail`}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <aside className="pt-[2px] max-[980px]:pt-0">
                        {(reviewCount || rating) && (
                            <div className="flex items-center gap-[8px]">
                                {reviewCount && (
                                    <button
                                        type="button"
                                        className="border-b border-black text-[11px] font-normal leading-none text-black"
                                    >
                                        {reviewCount} Reviews
                                    </button>
                                )}

                                {rating && (
                                    <div className="flex items-center gap-[2px] text-[#d9a300]">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                size={11}
                                                strokeWidth={1.4}
                                                fill={
                                                    index < Math.floor(rating) ? "currentColor" : "none"
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-[18px]">
                            {isEditing ? (
                                <EditableText
                                    value={product.title}
                                    path="title"
                                    className="text-[30px] font-medium leading-[1.05] tracking-[-0.7px] text-black"
                                />
                            ) : (
                                product?.title && (
                                    <h1 className="text-[30px] font-medium leading-[1.05] tracking-[-0.7px] text-black max-[640px]:text-[32px]">
                                        {product.title}
                                    </h1>
                                )
                            )}
                        </div>

                        <div className="mt-[7px]">
                            {isEditing ? (
                                <EditableText
                                    value={productSubtitle}
                                    path="baseDescription"
                                    multiline
                                    className="text-[15px] font-normal leading-[1.35] text-black"
                                />
                            ) : (
                                productSubtitle && (
                                    <p className="text-[15px] font-normal leading-[1.35] text-black">
                                        {productSubtitle}
                                    </p>
                                )
                            )}
                        </div>

                        <div className="mt-[14px] flex items-baseline gap-[10px]">
                            {comparePrice && (
                                <span className="text-[17px] font-normal text-[#8a8a8a] line-through">
                                    {currencySymbol}
                                    {comparePrice.toLocaleString()}
                                </span>
                            )}

                            <span className="text-[26px] font-medium leading-none tracking-[-0.5px] text-black">
                                {currencySymbol}
                                {price.toLocaleString()}
                            </span>
                        </div>

                        {uniqueColors.length > 0 && (
                            <div className="mt-[22px]">
                                <p className="text-[13px] font-normal text-black">
                                    Color: <span className="ml-[4px]">{selectedColor}</span>
                                </p>

                                <div className="mt-[9px] flex flex-wrap gap-[11px]">
                                    {uniqueColors.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            aria-label={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`h-[30px] w-[56px] rounded-[6px] border p-[3px] transition-all duration-200 ${selectedColor === color.name
                                                ? "border-black"
                                                : "border-transparent hover:border-[#cccccc]"
                                                }`}
                                        >
                                            <span
                                                className="block h-full w-full rounded-[4px]"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {availableSizes.length > 0 && (
                            <div className="mt-[19px]">
                                <div className="flex items-center justify-between text-[13px] font-normal text-black">
                                    <p>
                                        Size: <span>{selectedSize}</span>
                                    </p>

                                    {product?.sizeChart && (
                                        <button
                                            type="button"
                                            className="border-b border-black text-[12px] leading-none"
                                        >
                                            Size Chart
                                        </button>
                                    )}
                                </div>

                                <div className="mt-[13px] grid grid-cols-4 gap-[14px]">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-[32px] rounded-[5px] border text-[13px] font-normal transition-all duration-200 ${selectedSize === size
                                                ? "border-black text-black"
                                                : "border-[#e5e5e5] text-[#444444] hover:border-black"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                            className="mt-[30px] h-[36px] w-full rounded-full bg-black text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#1f1f1f] disabled:bg-[#dddddd] disabled:text-[#888888]"
                        >
                            {selectedVariant?.stockQuantity > 0
                                ? "Add To Cart"
                                : "Out Of Stock"}
                        </button>

                        {(product?.logistics?.shipping || product?.guaranteeText) && (
                            <div className="mt-[9px] flex items-center justify-center gap-[5px] text-[11px] font-normal text-black">
                                <span>
                                    {[product?.logistics?.shipping, product?.guaranteeText]
                                        .filter(Boolean)
                                        .join(" | ")}
                                </span>

                                <span className="flex h-[13px] w-[13px] items-center justify-center rounded-full border border-black text-[8px] leading-none">
                                    i
                                </span>
                            </div>
                        )}

                        <div className="mt-[23px] grid grid-cols-3 gap-[10px] text-center">
                            {[0, 1, 2].map((index) => {
                                const Icon = index === 0 ? Truck : index === 1 ? ShieldCheck : BadgeCheck;
                                const item = product?.advantages?.[index] || { title: "", description: "" };
                                
                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <Icon size={18} strokeWidth={1.4} />
                                        <div className="mt-[7px] w-full space-y-1">
                                            {isEditing ? (
                                                <>
                                                    <EditableText
                                                        value={item.title || ""}
                                                        path={`advantages.${index}.title`}
                                                        className="text-[11px] font-bold leading-[1.25] text-black text-center uppercase"
                                                        placeholder="Advantage title"
                                                    />
                                                    <EditableText
                                                        value={item.description || ""}
                                                        path={`advantages.${index}.description`}
                                                        multiline
                                                        className="text-[10px] leading-[1.25] text-[#666] text-center"
                                                        placeholder="Advantage detail"
                                                    />
                                                </>
                                            ) : (
                                                item.title && (
                                                    <>
                                                        <h4 className="text-[11px] font-bold leading-[1.25] text-black uppercase">{item.title}</h4>
                                                        <p className="text-[10px] leading-[1.25] text-[#666]">{item.description}</p>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {accordions.length > 0 && (
                            <div className="mt-[27px] border-t border-[#e8e8e8]">
                                {accordions.map((accordion) => {
                                    const isOpen = activeAccordion === accordion.id;

                                    return (
                                        <div
                                            key={accordion.id}
                                            className="border-b border-[#e8e8e8]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveAccordion(isOpen ? null : accordion.id)
                                                }
                                                className="flex w-full items-center justify-between py-[15px] text-left text-[14px] font-normal text-black"
                                            >
                                                <span>{accordion.title}</span>

                                                <ChevronDown
                                                    size={15}
                                                    strokeWidth={1.5}
                                                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] pb-[14px]" : "max-h-0"
                                                    }`}
                                            >
                                                {isEditing ? (
                                                    (accordion as any).isMaterialCare ? (
                                                        <div className="space-y-4 pt-2">
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Composition</label>
                                                                <EditableText
                                                                    value={product?.materialCare?.composition || ""}
                                                                    path="materialCare.composition"
                                                                    multiline
                                                                    className="text-[13px] font-normal leading-[1.6] text-[#555555]"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Care Instructions</label>
                                                                <EditableText
                                                                    value={product?.materialCare?.careInstructions || ""}
                                                                    path="materialCare.careInstructions"
                                                                    multiline
                                                                    className="text-[13px] font-normal leading-[1.6] text-[#555555]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <EditableText
                                                            value={accordion.content}
                                                            path={(accordion as any).path}
                                                            multiline
                                                            className="text-[13px] font-normal leading-[1.6] text-[#555555]"
                                                        />
                                                    )
                                                ) : (
                                                    <p className="whitespace-pre-line text-[13px] font-normal leading-[1.6] text-[#555555]">
                                                        {accordion.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </section>
    );
}