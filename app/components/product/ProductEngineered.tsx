import { useFormContext } from "react-hook-form";
import { EditableText, EditableImage } from "@/app/components/admin/CMSComponents";

type ProductEngineeredProps = {
    product: any;
    isCMS?: boolean;
};

export default function ProductEngineered({ product, isCMS = false }: ProductEngineeredProps) {
    const formContext = useFormContext();
    const isEditing = !!formContext;
    const engineered = product?.engineeredSection;

    if (!isEditing && (!engineered?.title && !engineered?.description && !engineered?.image)) {
        return null;
    }

    return (
        <section className="w-full bg-white border-b border-gray-100">
            <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[90px] pt-[72px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[64px] max-[768px]:pt-[48px]">
                <div className="grid grid-cols-[minmax(0,600px)_minmax(0,830px)] items-start justify-center gap-[110px] max-[1500px]:gap-[70px] max-[1200px]:grid-cols-[minmax(0,480px)_minmax(0,1fr)] max-[900px]:grid-cols-1 max-[900px]:gap-[36px]">
                    <div className="border-l border-[#bdbdbd] pl-[22px] pt-[22px] max-[900px]:border-l-0 max-[900px]:pl-0 max-[900px]:pt-0">
                        {isEditing ? (
                            <div className="space-y-10">
                                <EditableText 
                                    value={engineered?.title || ""} 
                                    path="engineeredSection.title" 
                                    className="max-w-[560px] font-[var(--font-sf-pro)] text-[48px] font-medium leading-[1.08] tracking-[-1.2px] text-black"
                                    placeholder="Section Title"
                                />
                                <EditableText 
                                    value={engineered?.description || ""} 
                                    path="engineeredSection.description" 
                                    multiline
                                    className="max-w-[540px] font-[var(--font-sf-pro)] text-[20px] font-normal leading-[1.48] tracking-[-0.2px] text-black"
                                    placeholder="Technical narrative..."
                                />
                            </div>
                        ) : (
                            <>
                                {engineered?.title && (
                                    <h2 className="max-w-[560px] whitespace-pre-line font-[var(--font-sf-pro)] text-[48px] font-medium leading-[1.08] tracking-[-1.2px] text-black max-[1200px]:text-[42px] max-[768px]:text-[36px] max-[480px]:text-[30px]">
                                        {engineered.title}
                                    </h2>
                                )}

                                {engineered?.description && (
                                    <p className="mt-[42px] max-w-[540px] font-[var(--font-sf-pro)] text-[20px] font-normal leading-[1.48] tracking-[-0.2px] text-black max-[900px]:mt-[22px] max-[768px]:text-[17px] max-[480px]:text-[15px]">
                                        {engineered.description}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="h-[1100px] w-full max-w-[830px] overflow-hidden rounded-[27px] bg-[#eeeeee] max-[1500px]:h-[980px] max-[1200px]:h-[820px] max-[900px]:mx-auto max-[900px]:h-[900px] max-[640px]:h-[620px] max-[480px]:h-[500px]">
                        {isEditing ? (
                            <EditableImage 
                                src={engineered?.image || ""} 
                                path="engineeredSection.image"
                                className="h-full w-full"
                            />
                        ) : (
                            engineered?.image && (
                                <img
                                    src={engineered.image}
                                    alt={engineered?.title || product?.title || "Product engineered image"}
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
