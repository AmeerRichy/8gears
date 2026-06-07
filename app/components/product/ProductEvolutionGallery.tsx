"use client";

import { useFormContext } from "react-hook-form";
import {
  EditableArray,
  EditableImage,
} from "@/app/components/admin/CMSComponents";

type ProductEvolutionGalleryProps = {
  product: any;
};

function isValidImage(image: unknown): image is string {
  return typeof image === "string" && image.trim().length > 0;
}

export default function ProductEvolutionGallery({
  product,
}: ProductEvolutionGalleryProps) {
  const formContext = useFormContext();
  const isEditing = Boolean(formContext);

  /*
    Keep the stored values safe and explicitly typed.
  */
  const storedImages: unknown[] = Array.isArray(product?.bottomGallery)
    ? product.bottomGallery
    : [];

  /*
    Evolution Gallery supports a maximum of four images.
  */
  const limitedImages: unknown[] = storedImages.slice(0, 4);

  /*
    Inside Visual CMS:
    Show one empty clickable slot when no image exists yet.
  */
  const cmsImages: string[] =
    isEditing && limitedImages.length === 0
      ? [""]
      : limitedImages.map((image) =>
          typeof image === "string" ? image : ""
        );

  /*
    On the public storefront:
    Remove all empty slots completely.
  */
  const frontendImages: string[] = limitedImages.filter(isValidImage);

  if (!isEditing && frontendImages.length === 0) {
    return null;
  }

  /*
    Automatically use only the columns that are actually needed.
    One image  = one full-width column
    Two images = two columns
    Three or four images = responsive masonry columns
  */
  const masonryColumnsClass =
    frontendImages.length === 1
      ? "columns-1"
      : frontendImages.length === 2
        ? "columns-1 sm:columns-2"
        : "columns-1 sm:columns-2 xl:columns-3";

  return (
    <section className="w-full border-t border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[72px] pt-[58px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[56px] max-[768px]:pt-[42px]">
        <div className="mb-12 text-center">
          <h2 className="text-center font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
            Evolution Gallery
          </h2>
        </div>

        {isEditing ? (
          /*
            ADMIN VISUAL CMS ONLY:
            Keep horizontal cards, sortable order, and four-image limit.
          */
          <div className="rounded-[2.5rem] border border-dashed border-gray-200 bg-slate-50 p-5 sm:p-7">
            <EditableArray
              items={cmsImages}
              path="bottomGallery"
              label="Gallery Shot"
              newItemTemplate=""
              layout="horizontal"
              itemClassName="w-[78vw] max-w-[390px] shrink-0 sm:w-[360px]"
              sortable
              maxItems={4}
              helperText="Maximum four images. Click an image to replace it. Hold and drag an image onto another card to switch its position. You can also use the arrow controls."
              renderItem={(image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-[4/5] overflow-hidden rounded-[18px] border border-white bg-white shadow-lg"
                >
                  <EditableImage
                    src={image}
                    path={`bottomGallery[${index}]`}
                    className="h-full w-full"
                  />
                </div>
              )}
            />
          </div>
        ) : (
          /*
            LIVE STOREFRONT ONLY:
            True responsive masonry layout using the real image dimensions.
            No fixed heights and no image stretching.
          */
          <div className={`${masonryColumnsClass} gap-[20px]`}>
            {frontendImages.map((image: string, index: number) => (
              <figure
                key={`${image}-${index}`}
                className="mb-[20px] break-inside-avoid overflow-hidden rounded-[20px] bg-[#eeeeee]"
              >
                <img
                  src={image}
                  alt={`${product?.title || "Product"} gallery image ${
                    index + 1
                  }`}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}