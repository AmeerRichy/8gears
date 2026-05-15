"use client";

import { useFormContext } from "react-hook-form";
import { EditableText, EditableImage } from "@/app/components/admin/CMSComponents";

type ProductStyleAestheticsProps = {
    product: any;
    isCMS?: boolean;
};

export default function ProductStyleAesthetics({
    product,
    isCMS = false,
}: ProductStyleAestheticsProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;
    const stylish = product?.stylishSection;

    if (
        !isEditing &&
        !stylish?.title &&
        !stylish?.description &&
        !stylish?.mainImage &&
        !stylish?.secondaryImage
    ) {
        return null;
    }

    return (
        <section className="w-full bg-white border-b border-gray-100">
            <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[90px] pt-[72px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[64px] max-[768px]:pt-[48px]">
                <div className="grid grid-cols-[minmax(0,850px)_minmax(0,850px)] items-start justify-center gap-[56px] max-[1500px]:gap-[38px] max-[1050px]:grid-cols-1 max-[1050px]:gap-[42px]">
                    {/* Left text + bottom aligned image */}
                    <div className="flex h-[1132px] w-full max-w-[850px] flex-col justify-between max-[1500px]:h-[980px] max-[1200px]:h-[820px] max-[1050px]:mx-auto max-[1050px]:h-auto max-[1050px]:justify-start">
                        <div className="pb-[40px] max-[1050px]:pb-[32px]">
                            {isEditing ? (
                                <div className="space-y-6">
                                    <EditableText
                                        value={stylish?.title || ""}
                                        path="stylishSection.title"
                                        className="max-w-[780px] font-[var(--font-sf-pro)] text-[48px] font-medium leading-[1.08] tracking-[-1.2px] text-black"
                                        placeholder="Style Title"
                                    />
                                    <EditableText
                                        value={stylish?.description || ""}
                                        path="stylishSection.description"
                                        multiline
                                        className="max-w-[820px] font-[var(--font-sf-pro)] text-[20px] font-normal leading-[1.35] tracking-[-0.2px] text-black"
                                        placeholder="Style narrative..."
                                    />
                                </div>
                            ) : (
                                <>
                                    {stylish?.title && (
                                        <h2 className="max-w-[780px] font-[var(--font-sf-pro)] text-[48px] font-medium leading-[1.08] tracking-[-1.2px] text-black max-[1200px]:text-[42px] max-[768px]:text-[36px] max-[480px]:text-[30px]">
                                            {stylish.title}
                                        </h2>
                                    )}
                                    {stylish?.description && (
                                        <p className="mt-[18px] max-w-[820px] font-[var(--font-sf-pro)] text-[20px] font-normal leading-[1.35] tracking-[-0.2px] text-black max-[768px]:text-[17px] max-[480px]:text-[15px]">
                                            {stylish.description}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="h-[880px] w-full max-w-[850px] overflow-hidden rounded-[27px] bg-[#eeeeee] max-[1500px]:h-[760px] max-[1200px]:h-[620px] max-[1050px]:mx-auto max-[1050px]:h-[780px] max-[640px]:h-[560px] max-[480px]:h-[440px]">
                            {isEditing ? (
                                <EditableImage
                                    src={stylish?.mainImage || ""}
                                    path="stylishSection.mainImage"
                                    className="h-full w-full"
                                />
                            ) : (
                                stylish?.mainImage && (
                                    <img
                                        src={stylish.mainImage}
                                        alt={stylish?.title || product?.title || "Product style image"}
                                        className="h-full w-full object-cover"
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="h-[1132px] w-full max-w-[850px] overflow-hidden rounded-[27px] bg-[#eeeeee] max-[1500px]:h-[980px] max-[1200px]:h-[820px] max-[1050px]:mx-auto max-[1050px]:h-[780px] max-[640px]:h-[560px] max-[480px]:h-[440px]">
                        {isEditing ? (
                            <EditableImage
                                src={stylish?.secondaryImage || ""}
                                path="stylishSection.secondaryImage"
                                className="h-full w-full"
                            />
                        ) : (
                            stylish?.secondaryImage && (
                                <img
                                    src={stylish.secondaryImage}
                                    alt={stylish?.title || product?.title || "Product style image"}
                                    className="h-full w-full object-cover"
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}