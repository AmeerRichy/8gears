'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Plus, Image as ImageIcon, Type } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import MediaManager from './MediaManager';

interface EditableTextProps {
  value: string;
  path: string;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  path,
  className = '',
  multiline = false,
  placeholder = 'Type here...',
  as: Component = 'div'
}) => {
  const formContext = useFormContext();
  const [localValue, setLocalValue] = useState(value || '');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Auto-resize logic for textarea
  useEffect(() => {
    if (multiline && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [localValue, multiline]);

  if (!formContext) {
    return <Component className={className}>{value || ''}</Component>;
  }

  const { setValue } = formContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    setValue(path, val, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={`relative group/text ${className}`}>
      {multiline ? (
        <textarea
          ref={textAreaRef}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:ring-2 focus:ring-orange-500/20 rounded-lg outline-none resize-none p-2 -m-2 leading-inherit font-inherit text-inherit overflow-hidden transition-all duration-300 placeholder:text-gray-400/50"
          rows={1}
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:ring-2 focus:ring-orange-500/20 rounded-lg outline-none p-2 -m-2 leading-inherit font-inherit text-inherit placeholder:text-gray-400/50"
        />
      )}

      {/* Floating Indicator */}
      <div className="absolute -top-6 left-0 opacity-0 group-hover/text:opacity-100 transition-all duration-300 pointer-events-none z-50 transform -translate-y-1 group-hover/text:translate-y-0">
        <div className="flex items-center gap-1 bg-slate-900 text-white text-[7px] px-2 py-1 rounded-md font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10">
          <Type size={8} className="text-orange-500" />
          {path.split('.').pop()}
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

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  path,
  className = '',
  aspectRatio = ''
}) => {
  const formContext = useFormContext();
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  if (!formContext) {
    return <img src={src} className={`${aspectRatio} ${className}`} alt="" />;
  }

  const { setValue } = formContext;

  return (
    <>
      <div className={`relative group/img overflow-hidden ${aspectRatio} ${className} transition-all duration-500 hover:shadow-2xl`}>
        {src ? (
          <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="" />
        ) : (
          <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
            <ImageIcon size={40} className="mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Image Slot</span>
          </div>
        )}

        <div
          onClick={() => setIsMediaOpen(true)}
          className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 cursor-pointer z-20 backdrop-blur-[2px]"
        >
          <div className="bg-white text-slate-900 p-3 rounded-full shadow-2xl transform scale-75 group-hover/img:scale-100 transition-transform duration-300">
            <Upload size={20} />
          </div>
          <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] mt-4 shadow-sm">
            Asset Manager
          </span>
        </div>

        {/* Path Tag */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover/img:opacity-100 transition-opacity z-30">
          <span className="bg-orange-500 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">
            {path}
          </span>
        </div>
      </div>

      <MediaManager
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(url) => {
          setValue(path, url, { shouldDirty: true });
          setIsMediaOpen(false);
        }}
      />
    </>
  );
};

export const EditableArray: React.FC<{
  items: any[];
  path: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  newItemTemplate: any;
  label?: string;
  className?: string;
}> = ({ items = [], path, renderItem, newItemTemplate, label, className = 'space-y-12' }) => {
  const formContext = useFormContext();

  if (!formContext) {
    return <>{items.map((item, index) => renderItem(item, index))}</>;
  }

  const { setValue } = formContext;

  const addItem = () => {
    const newItems = [...items, newItemTemplate];
    setValue(path, newItems, { shouldDirty: true });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue(path, newItems, { shouldDirty: true });
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="relative group/item animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-transparent to-transparent hidden lg:block" />

          <div className="relative">
            {renderItem(item, index)}

            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem(index);
              }}
              className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-all z-[60] shadow-2xl hover:bg-red-600 hover:scale-110 active:scale-95"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          addItem();
        }}
        className="w-full py-8 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-orange-500/30 hover:text-orange-500 hover:bg-orange-50/10 transition-all group mt-8"
      >
        <div className="p-4 bg-gray-50 group-hover:bg-orange-500 group-hover:text-white rounded-2xl transition-all">
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <span className="text-[12px] font-black uppercase tracking-[0.4em]">Add {label || 'Component'}</span>
      </button>
    </div>
  );
};
