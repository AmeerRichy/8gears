"use client";

import { useFormContext } from "react-hook-form";
import {
  EditableArray,
  EditableImage,
  EditableText,
} from "@/app/components/admin/CMSComponents";

type CloseUpItem = {
  image?: string;
  title?: string;
  description?: string;
};

type ProductCloseUpProps = {
  items?: CloseUpItem[];
};

const EMPTY_CLOSE_UP_ITEM: CloseUpItem = {
  image: "",
  title: "",
  description: "",
};

function createEmptyCloseUpItem(): CloseUpItem {
  return {
    ...EMPTY_CLOSE_UP_ITEM,
  };
}

function normalizeCMSItems(items?: CloseUpItem[]): CloseUpItem[] {
  const normalizedItems: CloseUpItem[] = Array.isArray(items)
    ? items.slice(0, 3).map((item) => ({
        image: item?.image || "",
        title: item?.title || "",
        description: item?.description || "",
      }))
    : [];

  while (normalizedItems.length < 3) {
    normalizedItems.push(createEmptyCloseUpItem());
  }

  return normalizedItems;
}

function getFrontendItems(items?: CloseUpItem[]): CloseUpItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item) =>
        Boolean(item?.image) ||
        Boolean(item?.title) ||
        Boolean(item?.description)
    )
    .slice(0, 3);
}

export default function ProductCloseUp({
  items,
}: ProductCloseUpProps) {
  const formContext = useFormContext();
  const isEditing = Boolean(formContext);

  /*
    Visual CMS always displays exactly three editable slots.
    Public storefront displays only real content.
  */
  const cmsItems = normalizeCMSItems(items);
  const frontendItems = getFrontendItems(items);

  if (!isEditing && frontendItems.length === 0) {
    return null;
  }

  const renderCloseUpItem = (
    item: CloseUpItem,
    index: number,
    compactCMSCard = false
  ) => (
    <article
      key={index}
      className={`w-full ${
        compactCMSCard ? "max-w-none" : "max-w-[570px]"
      }`}
    >
      <div
        className={`w-full overflow-hidden rounded-[20px] bg-[#eeeeee] ${
          compactCMSCard
            ? "h-[390px] sm:h-[450px]"
            : "h-[760px] max-w-[570px] max-[1400px]:h-[680px] max-[1200px]:h-[600px] max-[900px]:h-[760px] max-[640px]:h-[620px] max-[480px]:h-[500px]"
        }`}
      >
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

      <div className={compactCMSCard ? "pt-4" : "pt-[22px]"}>
        {isEditing ? (
          <div className="space-y-4">
            <EditableText
              value={item.title || ""}
              path={`closeUpSection[${index}].title`}
              className={`font-[var(--font-sf-pro)] font-semibold leading-[1.12] tracking-[-0.55px] text-black ${
                compactCMSCard ? "text-[22px]" : "text-[28px]"
              }`}
              placeholder="Detail Title"
            />

            <EditableText
              value={item.description || ""}
              path={`closeUpSection[${index}].description`}
              multiline
              className={`max-w-[520px] font-[var(--font-sf-pro)] font-normal leading-[1.45] tracking-[-0.1px] text-[#545454] ${
                compactCMSCard ? "text-[14px]" : "text-[16px]"
              }`}
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
    <section className="w-full border-y border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-[48px] pb-[72px] pt-[58px] max-[1100px]:px-[28px] max-[768px]:px-4 max-[768px]:pb-[56px] max-[768px]:pt-[42px]">
        <h2 className="text-center font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
          Close Up
        </h2>

        {isEditing ? (
          <div className="mt-[48px] rounded-[2.5rem] border border-dashed border-gray-200 bg-slate-50 p-5 sm:p-7">
            <EditableArray
              items={cmsItems}
              path="closeUpSection"
              label="Close Up Focus"
              newItemTemplate={createEmptyCloseUpItem()}
              layout="horizontal"
              itemClassName="w-[82vw] max-w-[430px] shrink-0 sm:w-[420px]"
              sortable
              minItems={3}
              maxItems={3}
              helperText="Exactly three close-up cards are required. Replace the images, edit the text, or reorder the cards by dragging them."
              renderItem={(item: CloseUpItem, index: number) =>
                renderCloseUpItem(item, index, true)
              }
            />
          </div>
        ) : (
          <div className="mt-[56px] grid grid-cols-3 justify-items-center gap-[28px] max-[1200px]:gap-[22px] max-[900px]:grid-cols-1 max-[900px]:gap-[42px]">
            {frontendItems.map((item, index) =>
              renderCloseUpItem(item, index)
            )}
          </div>
        )}
      </div>
    </section>
  );
}