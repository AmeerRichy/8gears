'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Upload, Trash2, CheckCircle2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

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
  onSelect: (url: string) => void;
  allowMultiple?: boolean;
}

export default function MediaManager({ isOpen, onClose, onSelect, allowMultiple = false }: MediaManagerProps) {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchImages = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const url = `/api/admin/cloudinary?${cursor ? `next_cursor=${cursor}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setImages(prev => cursor ? [...prev, ...data.resources] : data.resources);
      setNextCursor(data.next_cursor || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
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
      
      setImages(prev => prev.filter(i => i.public_id !== img.public_id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = images.filter(img => 
    img.public_id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Asset <span className="text-orange-500">Command</span></h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Manage Evolution Visuals</p>
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
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

          <div className="flex items-center gap-4">
            <CldUploadWidget 
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={() => fetchImages()}
            >
              {({ open }) => (
                <button 
                  onClick={() => open()}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Upload size={14} />
                  Deploy New
                </button>
              )}
            </CldUploadWidget>
            <button onClick={onClose} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredImages.map((img) => (
                <div 
                  key={img.public_id}
                  onClick={() => setSelectedUrl(img.secure_url)}
                  className={`group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ring-4 ${
                    selectedUrl === img.secure_url ? 'ring-orange-500 shadow-2xl' : 'ring-transparent hover:ring-gray-100 shadow-sm'
                  }`}
                >
                  <img src={img.secure_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Overlays */}
                  <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity duration-300 ${
                    selectedUrl === img.secure_url ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {selectedUrl === img.secure_url ? (
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
              ))}
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
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {images.length} Assets Loaded • Secure Cloud Storage
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500"
            >
              Cancel
            </button>
            <button 
              onClick={() => selectedUrl && onSelect(selectedUrl)}
              disabled={!selectedUrl}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 hover:bg-slate-800 transition-all"
            >
              Assign Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
