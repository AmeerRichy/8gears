'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Search, Upload, Trash2, CheckCircle2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { getAspectDifference, PRODUCT_IMAGE_GUIDELINES, type ProductImageGuidelineKey } from '@/lib/productImageGuidelines';
import { getOptimizedCloudinaryImage } from '@/lib/cloudinaryImage';
import { optimizeImageUpload } from '@/lib/optimizeImageUpload';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
}

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string | string[]) => void;
  allowMultiple?: boolean;
  guidelineKey?: ProductImageGuidelineKey;
}

export default function MediaManager({ isOpen, onClose, onSelect, allowMultiple = false, guidelineKey }: MediaManagerProps) {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const url = `/api/admin/cloudinary?${cursor ? `next_cursor=${cursor}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setImages(prev => cursor ? [...prev, ...data.resources] : data.resources);
      setNextCursor(data.next_cursor || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedUrls([]);
    }
  }, [isOpen, fetchImages]);

  const handleDelete = async (e: React.MouseEvent, img: CloudinaryResource) => {
    e.stopPropagation();
    if (!window.confirm('WARNING: This will permanently delete this image from Cloudinary and remove it from all products. Continue?')) return;

    setDeletingId(img.public_id);
    setError(null);
    try {
      const res = await fetch('/api/admin/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: img.public_id, secureUrl: img.secure_url }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.deleted?.includes(img.public_id)) {
        throw new Error('Cannot delete this image because it is currently used by a product.');
      }
      
      setImages(prev => prev.filter(i => i.public_id !== img.public_id));
      setSelectedUrls(prev => prev.filter(url => url !== img.secure_url));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = images.filter(img => 
    img.public_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const sourceFiles = Array.from(event.target.files || []);
    event.target.value = '';
    if (sourceFiles.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploadPromises = sourceFiles.map(async (sourceFile) => {
        const file = await optimizeImageUpload(sourceFile, guideline ? { width: guideline.width, height: guideline.height } : undefined);
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/admin/cloudinary', { method: 'POST', body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Upload failed for ${sourceFile.name}`);
        return data.secure_url as string;
      });

      const newUrls = await Promise.all(uploadPromises);
      await fetchImages();

      if (allowMultiple) {
        setSelectedUrls((prev) => Array.from(new Set([...prev, ...newUrls.filter(Boolean)])));
      } else if (newUrls.length > 0) {
        setSelectedUrls([newUrls[0]]);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleDeleteSelection = (publicId: string) => {
    setSelectedForDeletion((current) =>
      current.includes(publicId) ? current.filter((id) => id !== publicId) : [...current, publicId]
    );
  };

  const toggleImageSelection = (url: string) => {
    if (allowMultiple) {
      setSelectedUrls((current) =>
        current.includes(url) ? current.filter((u) => u !== url) : [...current, url]
      );
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleBulkDelete = async () => {
    const selectedImages = images.filter((image) => selectedForDeletion.includes(image.public_id));
    if (selectedImages.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedImages.length} selected images? Images used by products will be protected and skipped.`)) return;

    setBulkDeleting(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedImages.map((image) => ({ publicId: image.public_id, secureUrl: image.secure_url })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Bulk delete failed');
      const deleted: string[] = data.deleted || [];
      const blocked: string[] = data.blocked || [];
      setImages((current) => current.filter((image) => !deleted.includes(image.public_id)));
      setSelectedForDeletion(blocked);
      if (blocked.length > 0) setError(`${blocked.length} selected image${blocked.length === 1 ? ' is' : 's are'} still used by products and were not deleted.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Bulk delete failed');
    } finally {
      setBulkDeleting(false);
    }
  };

  const guideline = guidelineKey ? PRODUCT_IMAGE_GUIDELINES[guidelineKey] : null;
  const selectedImage = images.find((image) => selectedUrls.includes(image.secure_url));
  const selectedImageWarning = Boolean(
    guideline && selectedImage && getAspectDifference(selectedImage.width, selectedImage.height, guideline) > 0.12
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative flex h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 sm:h-[90vh] sm:rounded-[2.5rem] md:h-[85vh]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6 md:flex-nowrap md:px-10 md:py-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Asset <span className="text-orange-500">Command</span></h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Manage Evolution Visuals</p>
            {guideline && <p className="mt-1 text-[10px] font-semibold text-orange-600">{guideline.label}: {guideline.width} × {guideline.height}px · {guideline.aspectRatio}</p>}
          </div>
          
          <div className="order-3 flex w-full items-center gap-4 md:order-none md:mx-8 md:max-w-xl md:flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {selectedForDeletion.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 sm:px-5 sm:text-[10px]"
              >
                {bulkDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete {selectedForDeletion.length}
              </button>
            )}
            <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={handleUpload} />
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60 sm:px-6 sm:text-[10px]"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading...' : 'Deploy New'}
            </button>
            <button onClick={onClose} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          {loading && images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <Loader2 className="animate-spin text-orange-500" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Scanning Grid...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {filteredImages.map((img) => {
                const isSelected = selectedUrls.includes(img.secure_url);
                return (
                  <div 
                    key={img.public_id}
                    onClick={() => toggleImageSelection(img.secure_url)}
                    className={`group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ring-4 ${
                      isSelected ? 'ring-orange-500 shadow-2xl' : 'ring-transparent hover:ring-gray-100 shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={`${selectedForDeletion.includes(img.public_id) ? 'Unselect' : 'Select'} ${img.public_id} for bulk deletion`}
                      onClick={(event) => { event.stopPropagation(); toggleDeleteSelection(img.public_id); }}
                      className={`absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-lg border-2 text-[11px] font-black transition ${selectedForDeletion.includes(img.public_id) ? 'border-red-600 bg-red-600 text-white' : 'border-white bg-slate-900/45 text-transparent hover:text-white'}`}
                    >
                      ✓
                    </button>
                    <img src={getOptimizedCloudinaryImage(img.secure_url, 160)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    {/* Overlays */}
                    <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected ? (
                        <CheckCircle2 className="text-orange-500" size={48} />
                      ) : (
                        <div className="bg-white text-slate-900 p-3 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(e, img)}
                      disabled={deletingId === img.public_id}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                      {deletingId === img.public_id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                    </button>

                    {/* Info Tag */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl">
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-900 truncate">{img.public_id.split('/').pop()}</p>
                        <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">{img.width}x{img.height} • {img.format}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {nextCursor && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => fetchImages(nextCursor)}
                disabled={loading}
                className="px-8 py-4 bg-gray-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : 'Load More Assets'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {images.length} Assets Loaded • {selectedUrls.length} Selected
            </p>
            {guideline && <p className={`mt-1 text-[10px] font-semibold ${selectedImageWarning ? 'text-amber-700' : 'text-slate-500'}`}>{selectedImageWarning && selectedImage ? `Selected image is ${selectedImage.width} × ${selectedImage.height}px and may crop differently. ` : ''}{guideline.guidance}</p>}
          </div>
          <div className="flex w-full gap-2 md:w-auto md:gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 md:flex-none md:px-8"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (selectedUrls.length > 0) {
                  onSelect(allowMultiple ? selectedUrls : selectedUrls[0]);
                }
              }}
              disabled={selectedUrls.length === 0}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-2xl transition-all hover:bg-slate-800 disabled:opacity-50 md:flex-none md:px-12 md:tracking-[0.2em]"
            >
              Assign Selection {allowMultiple && selectedUrls.length > 0 ? `(${selectedUrls.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
