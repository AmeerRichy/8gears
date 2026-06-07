"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Image as ImageIcon,
  Plus,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import MediaManager from "./MediaManager";

interface EditableTextProps {
  value: string;
  path: string;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  path,
  className = "",
  multiline = false,
  placeholder = "Type here...",
  as: Component = "div",
}) => {
  const formContext = useFormContext();
  const [localValue, setLocalValue] = useState(value || "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!multiline || !textAreaRef.current) return;

    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height =
      textAreaRef.current.scrollHeight + "px";
  }, [localValue, multiline]);

  if (!formContext) {
    return (
      <Component className={className}>
        {value || ""}
      </Component>
    );
  }

  const { setValue } = formContext;

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const updatedValue = event.target.value;

    setLocalValue(updatedValue);

    setValue(path, updatedValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className={`group/text relative ${className}`}>
      {multiline ? (
        <textarea
          ref={textAreaRef}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="-m-2 w-full resize-none overflow-hidden rounded-lg border-none bg-transparent p-2 font-inherit leading-inherit text-inherit outline-none transition-all duration-300 placeholder:text-gray-400/50 focus:ring-2 focus:ring-orange-500/20"
          rows={1}
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="-m-2 w-full rounded-lg border-none bg-transparent p-2 font-inherit leading-inherit text-inherit outline-none placeholder:text-gray-400/50 focus:ring-2 focus:ring-orange-500/20"
        />
      )}

      <div className="pointer-events-none absolute -top-6 left-0 z-50 -translate-y-1 opacity-0 transition-all duration-300 group-hover/text:translate-y-0 group-hover/text:opacity-100">
        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-slate-900 px-2 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-white shadow-2xl">
          <Type size={8} className="text-orange-500" />

          {path.split(".").pop()}
        </div>
      </div>
    </div>
  );
};

interface EditableImageProps {
  src: string;
  path: string;
  className?: string;
  aspectRatio?: string;
}

export const EditableImage: React.FC<
  EditableImageProps
> = ({
  src,
  path,
  className = "",
  aspectRatio = "",
}) => {
  const formContext = useFormContext();
  const [isMediaOpen, setIsMediaOpen] =
    useState(false);

  if (!formContext) {
    return (
      <img
        src={src}
        className={`${aspectRatio} ${className}`}
        alt=""
        draggable={false}
      />
    );
  }

  const { setValue } = formContext;

  const openMediaManager = () => {
    setIsMediaOpen(true);
  };

  return (
    <>
      <div
        data-sort-drag-area="true"
        className={`group/img relative touch-none select-none overflow-hidden transition-all duration-500 hover:shadow-2xl ${aspectRatio} ${className}`}
      >
        {src ? (
          <img
            src={src}
            className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105"
            alt=""
            draggable={false}
          />
        ) : (
          <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300">
            <ImageIcon size={38} className="mb-2" />

            <span className="text-[10px] font-black uppercase tracking-widest">
              Empty Image Slot
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={openMediaManager}
          className="absolute inset-0 z-20 hidden cursor-grab flex-col items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover/img:opacity-100 active:cursor-grabbing sm:flex"
        >
          <div className="pointer-events-none scale-75 rounded-full bg-white p-3 text-slate-900 shadow-2xl transition-transform duration-300 group-hover/img:scale-100">
            <Upload size={20} />
          </div>

          <span className="pointer-events-none mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-sm">
            Click to Replace · Drag to Reorder
          </span>
        </button>

        <button
          type="button"
          onClick={openMediaManager}
          className="absolute bottom-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-xl backdrop-blur-md sm:hidden"
          aria-label="Replace image"
        >
          <Upload size={16} />
        </button>

        <div className="pointer-events-none absolute bottom-4 left-4 z-30 hidden opacity-0 transition-opacity group-hover/img:opacity-100 sm:block">
          <span className="rounded-full bg-orange-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-xl">
            {path}
          </span>
        </div>
      </div>

      <MediaManager
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(url) => {
          setValue(path, url, {
            shouldDirty: true,
            shouldValidate: true,
          });

          setIsMediaOpen(false);
        }}
      />
    </>
  );
};

type EditableArrayLayout =
  | "vertical"
  | "horizontal"
  | "grid";

interface EditableArrayProps {
  items: any[];
  path: string;
  renderItem: (
    item: any,
    index: number
  ) => React.ReactNode;
  newItemTemplate: any;
  label?: string;
  className?: string;
  layout?: EditableArrayLayout;
  itemClassName?: string;
  gridClassName?: string;
  minItems?: number;
  maxItems?: number;
  sortable?: boolean;
  helperText?: string;
}

type ActiveDrag = {
  pointerId: number;
  initialX: number;
  initialY: number;
  currentIndex: number;
  hasStartedMoving: boolean;
};

function cloneTemplate<T>(template: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(template);
  }

  return JSON.parse(JSON.stringify(template)) as T;
}

export const EditableArray: React.FC<
  EditableArrayProps
> = ({
  items = [],
  path,
  renderItem,
  newItemTemplate,
  label,
  className = "",
  layout = "vertical",
  itemClassName = "",
  gridClassName = "grid grid-cols-1 gap-5",
  minItems,
  maxItems,
  sortable = false,
  helperText,
}) => {
  const formContext = useFormContext();

  const safeItems = Array.isArray(items) ? items : [];

  const [localItems, setLocalItems] =
    useState<any[]>(safeItems);

  const localItemsRef =
    useRef<any[]>(safeItems);

  const activeDragRef =
    useRef<ActiveDrag | null>(null);

  const cleanupGlobalListenersRef =
    useRef<(() => void) | null>(null);

  const suppressNextClickRef =
    useRef(false);

  const [draggedIndex, setDraggedIndex] =
    useState<number | null>(null);

  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  useEffect(() => {
    if (activeDragRef.current) return;

    localItemsRef.current = safeItems;
    setLocalItems(safeItems);
  }, [items]);

  useEffect(() => {
    return () => {
      cleanupGlobalListenersRef.current?.();

      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, []);

  if (!formContext) {
    return (
      <>
        {safeItems.map((item, index) =>
          renderItem(item, index)
        )}
      </>
    );
  }

  const { setValue } = formContext;

  const reachedMinimum =
    typeof minItems === "number" &&
    localItems.length <= minItems;

  const reachedMaximum =
    typeof maxItems === "number" &&
    localItems.length >= maxItems;

  const hasFixedItemCount =
    typeof minItems === "number" &&
    typeof maxItems === "number" &&
    minItems === maxItems;

  const updateItems = (
    updatedItems: any[]
  ) => {
    localItemsRef.current = updatedItems;

    setLocalItems(updatedItems);

    setValue(path, updatedItems, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const addItem = () => {
    if (reachedMaximum) return;

    updateItems([
      ...localItemsRef.current,
      cloneTemplate(newItemTemplate),
    ]);
  };

  const removeItem = (
    index: number
  ) => {
    if (reachedMinimum) return;

    updateItems(
      localItemsRef.current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const moveItem = (
    fromIndex: number,
    toIndex: number
  ) => {
    const currentItems = [
      ...localItemsRef.current,
    ];

    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentItems.length ||
      toIndex >= currentItems.length
    ) {
      return;
    }

    const [movedItem] =
      currentItems.splice(fromIndex, 1);

    currentItems.splice(
      toIndex,
      0,
      movedItem
    );

    updateItems(currentItems);
  };

  const resetDraggingState = () => {
    cleanupGlobalListenersRef.current?.();
    cleanupGlobalListenersRef.current = null;

    activeDragRef.current = null;

    setDraggedIndex(null);
    setHoveredIndex(null);

    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 180);
  };

  const handlePointerMove = (
    event: PointerEvent
  ) => {
    const activeDrag =
      activeDragRef.current;

    if (!activeDrag) return;

    if (
      activeDrag.pointerId !==
      event.pointerId
    ) {
      return;
    }

    const distanceX =
      event.clientX -
      activeDrag.initialX;

    const distanceY =
      event.clientY -
      activeDrag.initialY;

    const totalDistance = Math.sqrt(
      distanceX * distanceX +
        distanceY * distanceY
    );

    if (
      !activeDrag.hasStartedMoving &&
      totalDistance < 8
    ) {
      return;
    }

    if (!activeDrag.hasStartedMoving) {
      activeDrag.hasStartedMoving = true;

      suppressNextClickRef.current = true;

      setDraggedIndex(
        activeDrag.currentIndex
      );

      document.body.style.userSelect =
        "none";

      document.body.style.cursor =
        "grabbing";
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const hoveredElement =
      document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLElement | null;

    const hoveredCard =
      hoveredElement?.closest(
        "[data-sort-array-item='true']"
      ) as HTMLElement | null;

    if (!hoveredCard) return;

    if (
      hoveredCard.dataset.sortPath !== path
    ) {
      return;
    }

    const nextIndex = Number(
      hoveredCard.dataset.sortIndex
    );

    if (
      Number.isNaN(nextIndex) ||
      nextIndex ===
        activeDrag.currentIndex
    ) {
      return;
    }

    setHoveredIndex(nextIndex);

    moveItem(
      activeDrag.currentIndex,
      nextIndex
    );

    activeDrag.currentIndex =
      nextIndex;

    setDraggedIndex(nextIndex);
  };

  const handlePointerEnd = (
    event: PointerEvent
  ) => {
    const activeDrag =
      activeDragRef.current;

    if (!activeDrag) return;

    if (
      activeDrag.pointerId !==
      event.pointerId
    ) {
      return;
    }

    resetDraggingState();
  };

  const startPointerDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    index: number
  ) => {
    if (!sortable) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    if (
      localItemsRef.current.length < 2
    ) {
      return;
    }

    const clickedElement =
      event.target as HTMLElement;

    const clickedInsideImage =
      Boolean(
        clickedElement.closest(
          '[data-sort-drag-area="true"]'
        )
      );

    const clickedGripHandle =
      Boolean(
        clickedElement.closest(
          '[data-sort-handle="true"]'
        )
      );

    if (
      !clickedInsideImage &&
      !clickedGripHandle
    ) {
      return;
    }

    cleanupGlobalListenersRef.current?.();

    activeDragRef.current = {
      pointerId: event.pointerId,
      initialX: event.clientX,
      initialY: event.clientY,
      currentIndex: index,
      hasStartedMoving: false,
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "pointerup",
      handlePointerEnd
    );

    window.addEventListener(
      "pointercancel",
      handlePointerEnd
    );

    cleanupGlobalListenersRef.current =
      () => {
        window.removeEventListener(
          "pointermove",
          handlePointerMove
        );

        window.removeEventListener(
          "pointerup",
          handlePointerEnd
        );

        window.removeEventListener(
          "pointercancel",
          handlePointerEnd
        );
      };
  };

  const blockClickAfterDragging = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      !suppressNextClickRef.current
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const renderEditableItem = (
    item: any,
    index: number
  ) => {
    const isBeingDragged =
      draggedIndex === index;

    const isHovered =
      hoveredIndex === index;

    return (
      <div
        key={index}
        data-sort-array-item="true"
        data-sort-path={path}
        data-sort-index={index}
        onPointerDown={(event) =>
          startPointerDrag(event, index)
        }
        onClickCapture={
          blockClickAfterDragging
        }
        className={`group/item relative min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          layout === "horizontal"
            ? "shrink-0"
            : ""
        } ${
          isBeingDragged
            ? "z-[90] scale-[0.98] opacity-75 shadow-2xl ring-4 ring-orange-500/65"
            : ""
        } ${
          isHovered
            ? "rounded-[24px] ring-4 ring-orange-500/35"
            : ""
        } ${itemClassName}`}
      >
        {layout === "vertical" && (
          <div className="absolute -left-12 bottom-0 top-0 hidden w-px bg-gradient-to-b from-orange-500/50 via-transparent to-transparent lg:block" />
        )}

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-3 z-[70] flex h-8 min-w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 px-2 text-[10px] font-black text-slate-700 shadow-lg backdrop-blur-md">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div className="absolute right-3 top-3 z-[80] flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/90 p-1 text-white shadow-xl backdrop-blur-md">
            {sortable && (
              <button
                type="button"
                data-sort-handle="true"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className="flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-lg text-white/80 transition-all hover:bg-white/15 hover:text-white active:cursor-grabbing"
                aria-label={`Drag ${
                  label || "item"
                } ${index + 1}`}
                title="Hold and drag to reorder"
              >
                <GripVertical
                  size={16}
                />
              </button>
            )}

            {sortable && (
              <>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    moveItem(
                      index,
                      index - 1
                    );
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label={`Move ${
                    label || "item"
                  } backward`}
                  title="Move backward"
                >
                  <ChevronLeft
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  disabled={
                    index ===
                    localItems.length - 1
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    moveItem(
                      index,
                      index + 1
                    );
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label={`Move ${
                    label || "item"
                  } forward`}
                  title="Move forward"
                >
                  <ChevronRight
                    size={16}
                  />
                </button>
              </>
            )}

            <button
              type="button"
              disabled={reachedMinimum}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                removeItem(index);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:bg-transparent"
              aria-label={`Remove ${
                label || "item"
              } ${index + 1}`}
              title={
                reachedMinimum
                  ? `Minimum ${minItems} required`
                  : "Remove"
              }
            >
              <Trash2 size={15} />
            </button>
          </div>

          {renderItem(item, index)}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-700">
            {label || "Content Blocks"}
          </p>

          <p className="mt-1 text-[11px] font-medium leading-5 text-slate-400">
            {helperText ||
              "Hold an image and drag it onto another card to reorder it. Click without dragging to replace it."}
          </p>
        </div>

        {typeof maxItems ===
          "number" && (
          <div className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm">
            {localItems.length} /{" "}
            {maxItems}{" "}
            {hasFixedItemCount
              ? "Required"
              : "Used"}
          </div>
        )}
      </div>

      {layout === "grid" && (
        <div className={gridClassName}>
          {localItems.map(
            (item, index) =>
              renderEditableItem(
                item,
                index
              )
          )}
        </div>
      )}

      {layout === "horizontal" && (
        <div className="flex gap-5 overflow-x-auto overflow-y-hidden pb-4 pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80 [&::-webkit-scrollbar-track]:bg-transparent">
          {localItems.map(
            (item, index) =>
              renderEditableItem(
                item,
                index
              )
          )}
        </div>
      )}

      {layout === "vertical" && (
        <div className="space-y-12">
          {localItems.map(
            (item, index) =>
              renderEditableItem(
                item,
                index
              )
          )}
        </div>
      )}

      {/*
        Hide the add button completely when the section
        has a fixed number of required cards and all slots exist.
      */}
      {(!hasFixedItemCount ||
        !reachedMaximum) && (
        <button
          type="button"
          disabled={reachedMaximum}
          onClick={(event) => {
            event.preventDefault();

            addItem();
          }}
          className="group mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-[24px] border-2 border-dashed border-slate-200 bg-white/50 py-6 text-slate-300 transition-all hover:border-orange-500/35 hover:bg-orange-50/40 hover:text-orange-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100/60 disabled:text-slate-300"
        >
          <div className="rounded-xl bg-slate-50 p-2.5 transition-all group-hover:bg-orange-500 group-hover:text-white">
            <Plus size={22} />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.28em]">
            {reachedMaximum
              ? `Maximum ${maxItems} ${
                  label || "Items"
                }`
              : `Add ${
                  label ||
                  "Component"
                }`}
          </span>
        </button>
      )}
    </div>
  );
};