"use client";

import { useFormContext } from "react-hook-form";
import { EditableImage } from "@/app/components/admin/CMSComponents";
import type { ProductImageGuidelineKey } from "@/lib/productImageGuidelines";
import { getCloudinarySrcSet, getOptimizedCloudinaryImage } from "@/lib/cloudinaryImage";

type Props = {
  src?: string;
  alt: string;
  editablePath?: string;
  guidelineKey?: ProductImageGuidelineKey;
  fit?: "cover" | "contain" | "natural";
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
};

export default function ProductSectionImage({
  src = "", alt, editablePath, guidelineKey, fit = "cover",
  className = "", imageClassName = "", loading = "lazy", sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const isEditing = Boolean(useFormContext());
  const fitClass = fit === "contain" ? "object-contain" : fit === "natural" ? "h-auto object-contain" : "object-cover";

  if (isEditing && editablePath) {
    return (
      <EditableImage
        src={src}
        path={editablePath}
        guidelineKey={guidelineKey}
        fit={fit}
        alt={alt}
        className={`${className} ${!src ? "h-full" : ""}`}
        imageClassName={imageClassName}
      />
    );
  }

  if (!src) return null;
  return (
    <img
      src={getOptimizedCloudinaryImage(src, 1080)}
      srcSet={getCloudinarySrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`block w-full ${fit === "natural" ? "h-auto" : "h-full"} ${fitClass} ${imageClassName} ${className}`}
    />
  );
}
