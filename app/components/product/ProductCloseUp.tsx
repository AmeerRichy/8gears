import { useFormContext } from "react-hook-form";
import { EditableText, EditableImage, EditableArray } from "@/app/components/admin/CMSComponents";

type CloseUpItem = {
    image?: string;
    title?: string;
    description?: string;
};

type ProductCloseUpProps = {
    items?: CloseUpItem[];
};

export default function ProductCloseUp({ items }: ProductCloseUpProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;
    const cmsItems = isEditing && (!items || items.length === 0)
        ? [{ image: '', title: '', description: '' }]
        : items;

    if (!isEditing && (!items || items.length === 0)) return null;

    const renderCloseUpItem = (item: CloseUpItem, index: number) => (
        <article
            key={index}
            className="w-full max-w-[570px]"
        >
            <div className="h-[760px] w-full max-w-[570px] overflow-hidden rounded-[20px] bg-[#eeeeee] max-[1400px]:h-[680px] max-[1200px]:h-[600px] max-[900px]:h-[760px] max-[640px]:h-[620px] max-[480px]:h-[500px]">
                {isEditing ? (
                    <EditableImage 
                        src={item.image || ""} 
                        path={`closeUpSection[${index}].image`}
                        className="h-full w-full"
                    />
                ) : (
                    item.image && (
                        <img
                            src={item.image}
                            alt={item.title || "Product close up"}
                            className="h-full w-full object-cover"
                        />
                    )
                )}
            </div>

            <div className="pt-[22px]">
                {isEditing ? (
                    <div className="space-y-4">
                        <EditableText 
                            value={item.title || ""} 
                            path={`closeUpSection[${index}].title`} 
                            className="font-[var(--font-sf-pro)] text-[28px] font-semibold leading-[1.12] tracking-[-0.55px] text-black"
                            placeholder="Detail Title"
                        />
                        <EditableText 
                            value={item.description || ""} 
                            path={`closeUpSection[${index}].description`} 
                            multiline
                            className="max-w-[520px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.45] tracking-[-0.1px] text-[#545454]"
                            placeholder="Brief explanation..."
                        />
                    </div>
                ) : (
                    <>
                        {item.title && (
                            <h3 className="font-[var(--font-sf-pro)] text-[28px] font-semibold leading-[1.12] tracking-[-0.55px] text-black max-[768px]:text-[25px] max-[480px]:text-[22px]">
                                {item.title}
                            </h3>
                        )}
                        {item.description && (
                            <p className="mt-[10px] max-w-[520px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.45] tracking-[-0.1px] text-[#545454] max-[480px]:text-[14px]">
                                {item.description}
                            </p>
                        )}
                    </>
                )}
            </div>
        </article>
    );

    return (
        <section className="w-full bg-white border-y border-gray-100">
            <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[72px] pt-[58px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[56px] max-[768px]:pt-[42px]">
                <h2 className="text-center font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
                    Close Up
                </h2>

                <div className="mt-[56px] grid grid-cols-3 justify-items-center gap-[28px] max-[1200px]:gap-[22px] max-[900px]:grid-cols-1 max-[900px]:gap-[42px]">
                    {isEditing ? (
                        <div className="col-span-3 w-full">
                            <EditableArray 
                                items={cmsItems || []} 
                                path="closeUpSection" 
                                label="Close Up Focus"
                                newItemTemplate={{ image: '', title: '', description: '' }}
                                renderItem={(item, index) => renderCloseUpItem(item, index)}
                            />
                        </div>
                    ) : (
                        cmsItems?.filter((item) => item?.image || item?.title || item?.description)
                             .slice(0, 3)
                             .map((item, index) => renderCloseUpItem(item, index))
                    )}
                </div>
            </div>
        </section>
    );
}
