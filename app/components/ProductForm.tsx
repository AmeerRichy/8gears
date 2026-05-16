'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, X, Loader2, Eye, Edit3, Save, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProductDetail from './product/ProductDetail';
import MediaManager from './admin/MediaManager';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const variantSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  colorHex: z.string().min(4, 'Valid hex code required').regex(/^#/, 'Must start with #'),
  size: z.string().min(1, 'Size is required'),
  price: z.number().min(0),
  comparePrice: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  stockQuantity: z.number().int().min(0),
  sku: z.string().min(1, 'SKU is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  tags: z.string().optional(),

  variants: z.array(variantSchema).min(1, 'At least one variant is required'),

  // CMS fields stay optional in Zod so the normal form stays simple.
  // They are checked manually on submit and edited in Visual CMS.
  baseDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  materialCare: z.object({
    composition: z.string().optional(),
    careInstructions: z.string().optional(),
  }),
  advantages: z.array(z.object({ title: z.string(), description: z.string() })),
  logistics: z.object({
    shipping: z.string().optional(),
    returns: z.string().optional(),
  }),
  closeUpSection: z.array(z.object({ image: z.string().optional(), title: z.string().optional(), description: z.string().optional() })).max(3),
  engineeredSection: z.object({ title: z.string().optional(), description: z.string().optional(), image: z.string().optional() }),
  lifestyleImage: z.string().optional(),
  stylishSection: z.object({ title: z.string().optional(), description: z.string().optional(), mainImage: z.string().optional(), secondaryImage: z.string().optional() }),
  bottomGallery: z.array(z.string()),
  sizeChart: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

function isEmpty(value: any) {
  return !value || String(value).trim() === '';
}

function normalizeProductData(initialData?: any): ProductFormValues {
  if (!initialData) {
    return {
      title: '',
      slug: '',
      category: '',
      brand: '8 GEARS',
      baseDescription: '',
      fullDescription: '',
      tags: '',
      variants: [{ color: 'Black', colorHex: '#000000', size: 'L', price: 0, comparePrice: null, stockQuantity: 10, sku: '', images: [] }],
      materialCare: { composition: '', careInstructions: '' },
      advantages: [
        { title: 'FAST DELIVERY', description: 'Next day shipping available' },
        { title: 'SECURE GEAR', description: 'Certified safety standards' },
        { title: 'AUTHENTICITY', description: '100% Genuine hardware' }
      ],
      logistics: { shipping: '', returns: '' },
      closeUpSection: [
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' },
      ],
      engineeredSection: { title: '', description: '', image: '' },
      lifestyleImage: '',
      stylishSection: { title: '', description: '', mainImage: '', secondaryImage: '' },
      bottomGallery: [],
      sizeChart: '',
    };
  }

  return {
    title: initialData.title || '',
    slug: initialData.slug || '',
    category: initialData.category?.name || initialData.category || '',
    brand: initialData.brand || '8 GEARS',
    baseDescription: initialData.baseDescription || '',
    fullDescription: initialData.fullDescription || '',
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
    variants: Array.isArray(initialData.variants) && initialData.variants.length > 0
      ? initialData.variants.map((variant: any) => ({
        color: variant.color || 'Black',
        colorHex: variant.colorHex || '#000000',
        size: variant.size || '',
        price: Number(variant.price || 0),
        comparePrice: variant.comparePrice === undefined || variant.comparePrice === null ? null : Number(variant.comparePrice),
        stockQuantity: Number(variant.stockQuantity || 0),
        sku: variant.sku || '',
        images: Array.isArray(variant.images) ? variant.images : [],
      }))
      : [{ color: 'Black', colorHex: '#000000', size: 'L', price: 0, comparePrice: null, stockQuantity: 10, sku: '', images: [] }],

    materialCare: {
      composition: initialData.materialCare?.composition || '',
      careInstructions: initialData.materialCare?.careInstructions || '',
    },
    advantages: Array.isArray(initialData.advantages) && initialData.advantages.length > 0
      ? initialData.advantages
      : [{ title: '', description: '' }],
    logistics: {
      shipping: initialData.logistics?.shipping || '',
      returns: initialData.logistics?.returns || '',
    },
    closeUpSection: Array.isArray(initialData.closeUpSection) && initialData.closeUpSection.length > 0
      ? initialData.closeUpSection
      : [
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' },
        { image: '', title: '', description: '' },
      ],
    engineeredSection: {
      title: initialData.engineeredSection?.title || '',
      description: initialData.engineeredSection?.description || '',
      image: initialData.engineeredSection?.image || '',
    },
    lifestyleImage: initialData.lifestyleImage || '',
    stylishSection: {
      title: initialData.stylishSection?.title || '',
      description: initialData.stylishSection?.description || '',
      mainImage: initialData.stylishSection?.mainImage || '',
      secondaryImage: initialData.stylishSection?.secondaryImage || '',
    },
    bottomGallery: Array.isArray(initialData.bottomGallery) ? initialData.bottomGallery : [],
    sizeChart: initialData.sizeChart || '',
  };
}

function validateCMSFields(data: ProductFormValues) {
  const missing: string[] = [];

  if (isEmpty(data.baseDescription)) missing.push('Base Description');
  if (isEmpty(data.fullDescription)) missing.push('Full Description');
  if (isEmpty(data.materialCare?.composition)) missing.push('Material Composition');
  if (isEmpty(data.materialCare?.careInstructions)) missing.push('Care Instructions');
  if (isEmpty(data.logistics?.shipping)) missing.push('Shipping Info');
  if (isEmpty(data.logistics?.returns)) missing.push('Returns Info');

  const validAdvantages = (data.advantages || []).filter((item) => !isEmpty(item.title) && !isEmpty(item.description));
  if (validAdvantages.length === 0) missing.push('At least 1 Advantage');

  const validCloseUps = (data.closeUpSection || []).filter((item) => !isEmpty(item.image) && !isEmpty(item.title) && !isEmpty(item.description));
  if (validCloseUps.length === 0) missing.push('At least 1 Close-up Section');

  if (isEmpty(data.engineeredSection?.title)) missing.push('Engineered Section Title');
  if (isEmpty(data.engineeredSection?.description)) missing.push('Engineered Section Description');
  if (isEmpty(data.engineeredSection?.image)) missing.push('Engineered Section Image');
  if (isEmpty(data.lifestyleImage)) missing.push('Lifestyle Image');
  if (isEmpty(data.stylishSection?.title)) missing.push('Stylish Section Title');
  if (isEmpty(data.stylishSection?.description)) missing.push('Stylish Section Description');
  if (isEmpty(data.stylishSection?.mainImage)) missing.push('Stylish Main Image');
  if (isEmpty(data.stylishSection?.secondaryImage)) missing.push('Stylish Secondary Image');
  if (!Array.isArray(data.bottomGallery) || data.bottomGallery.length === 0) missing.push('Bottom Gallery Images');

  return missing;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants'>('basic');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [mediaManager, setMediaManager] = useState<{ isOpen: boolean; path: string; multiple: boolean }>({
    isOpen: false,
    path: '',
    multiple: false
  });

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: normalizeProductData(initialData),
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Hidden input to ensure sizeChart is registered and synced
  register('sizeChart');

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });



  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    // Ensure slug exists
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    const missingCMSFields = validateCMSFields(data);

    if (missingCMSFields.length > 0) {
      alert(`Please fill these required CMS fields before uploading:\n\n${missingCMSFields.map((field) => `- ${field}`).join('\n')}`);
      setViewMode('preview');
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(t => t) : [],
        advantages: data.advantages.filter(item => item.title && item.description),
        closeUpSection: data.closeUpSection.filter(item => item.image && item.title && item.description).slice(0, 3),
        variants: data.variants.map(v => ({
          ...v,
          price: Number(v.price || 0),
          stockQuantity: Number(v.stockQuantity || 0),
          comparePrice: v.comparePrice || undefined
        })),
        sizeChart: data.sizeChart || ""
      };

      const url = initialData ? `/api/products/${initialData._id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = (color: string, size: string) => {
    const title = watch('title') || 'PROD';
    const cleanTitle = title.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanColor = color.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanSize = size.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const timestamp = Date.now().toString().slice(-4);
    return `${cleanTitle}-${cleanColor}-${cleanSize}-${timestamp}`;
  };

  const onInvalid: SubmitErrorHandler<ProductFormValues> = (errors) => {
    console.error('Validation Errors:', errors);
    
    const messages: string[] = [];
    
    // Recursive error finder
    const findErrors = (obj: any, prefix = '') => {
      if (!obj) return;
      if (obj.message) {
        messages.push(`${prefix}${obj.message}`);
        return;
      }
      Object.entries(obj).forEach(([key, value]) => {
        const newPrefix = isNaN(Number(key)) ? `${prefix}${key}: ` : `${prefix}Item ${Number(key) + 1}: `;
        findErrors(value, newPrefix);
      });
    };

    findErrors(errors);

    if (messages.length === 0) {
      alert('Validation failed, but no specific messages were found. Please check that all variant fields (Size, Price, SKU, Images) are correctly filled.');
    } else {
      alert(`Please fix the following validation errors:\n\n${messages.slice(0, 8).join('\n')}${messages.length > 8 ? '\n...and more' : ''}`);
    }
  };

  const generateSlug = () => {
    const title = watch('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const watchedValues = watch();
  const watchedVariants = watch('variants') || [];

  return (
    <FormProvider {...methods}>
      <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4">
        {/* Visual CMS Header */}
        <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl py-6 z-[100] border-b border-gray-100 -mx-4 px-8 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="relative">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                Evolution <span className="text-orange-500">Matrix</span>
              </h2>
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-500 rounded-full" />
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  viewMode === 'edit' ? "bg-white text-slate-900 shadow-xl" : "text-gray-400 hover:text-slate-900"
                )}
              >
                <Edit3 size={14} className={viewMode === 'edit' ? "text-orange-500" : ""} />
                Data Matrix
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  viewMode === 'preview' ? "bg-white text-slate-900 shadow-xl" : "text-gray-400 hover:text-slate-900"
                )}
              >
                <Eye size={14} className={viewMode === 'preview' ? "text-orange-500" : ""} />
                Visual CMS
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-all duration-300"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit, onInvalid)}
              disabled={loading}
              className="relative group overflow-hidden inline-flex items-center px-10 py-4 border border-transparent text-[10px] font-black rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-all duration-500 disabled:opacity-50 uppercase tracking-[0.3em]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                {loading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Save className="mr-3 h-4 w-4 text-orange-500" />}
                {initialData ? 'Sync Evolution' : 'Deploy Hardware'}
              </div>
            </button>
          </div>
        </div>

        {viewMode === 'preview' ? (
          <div className="relative mt-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Professional Preview Frame */}
            <div className="rounded-[3rem] overflow-hidden border-[12px] border-slate-900 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] bg-white ring-1 ring-slate-900/10">
              <div className="h-12 bg-slate-900 flex items-center justify-between px-10 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="bg-white/10 px-6 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
                  8GEARS-EVOLUTION-MATRIX.PREVIEW
                </div>
                <div className="flex items-center gap-3 text-orange-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Editing Active</span>
                </div>
              </div>
              <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                <ProductDetail product={watchedValues} isCMS={true} />
              </div>
            </div>

            {/* Floating help tip */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
              <Type size={16} className="text-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                Click any text or image to modify the interface
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
              {[
                { id: 'basic', label: 'Identity' },
                { id: 'variants', label: 'Inventory' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-2 self-center" />
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-orange-600 hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                Edit Visuals <Eye size={14} />
              </button>
            </div>

            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                    <div className="border-l-4 border-orange-500 pl-6">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Core Identity</h3>
                      <p className="text-slate-400 text-sm font-medium">Fundamental product metadata.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Product Title</label>
                        <input
                          {...register('title')}
                          onBlur={generateSlug}
                          className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-xl font-black tracking-tight"
                          placeholder="e.g. TITAN M1 GLOVES"
                        />
                        {errors.title && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{errors.title.message}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Category</label>
                        <select
                          key={categories.length}
                          {...register('category')}
                          className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold appearance-none bg-white cursor-pointer"
                        >
                          <option value="">Select Gear Class</option>
                          {categories.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Search Tags</label>
                        <input
                          {...register('tags')}
                          className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                          placeholder="racing, protective, carbon"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Slug (Auto-generated)</label>
                        <input
                          {...register('slug')}
                          className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-100 text-gray-400 font-mono text-xs cursor-not-allowed"
                          readOnly
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">8</div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-xs">8 GEARS Verified</h4>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Authentic Hardware</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      All products are automatically listed under the <span className="text-orange-500 font-black italic">8 GEARS</span> brand.
                    </p>
                  </div>

                  <div className="bg-orange-500 p-8 rounded-[2.5rem] shadow-xl text-white group cursor-pointer" onClick={() => setViewMode('preview')}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-black uppercase tracking-[0.2em] text-xs">Visual CMS</h4>
                      <Eye size={20} className="group-hover:scale-125 transition-transform duration-500" />
                    </div>
                    <p className="text-xs text-white/90 font-medium leading-relaxed">
                      Narratives, cinematic shots, and technical focus points are now managed directly on the product preview.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      Open Visual Editor <Plus size={12} />
                    </div>
                  </div>

                  {/* Size Chart Image Optional */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="border-l-4 border-slate-900 pl-4">
                      <h4 className="font-black uppercase tracking-widest text-xs text-slate-900">Size Chart Image</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">Optional</p>
                    </div>

                    {watch('sizeChart') ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group/chart">
                          <img 
                            src={watch('sizeChart')} 
                            alt="Size Chart" 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button
                              type="button"
                              onClick={() => setMediaManager({ isOpen: true, path: 'sizeChart', multiple: false })}
                              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => setValue('sizeChart', '', { shouldDirty: true, shouldValidate: true })}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-600 transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                        <button
                          type="button"
                          onClick={() => setMediaManager({ isOpen: true, path: 'sizeChart', multiple: false })}
                          className="w-full aspect-[2/1] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all bg-gray-50/30 gap-2 group cursor-pointer"
                        >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Size Chart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-8">
                <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="border-l-4 border-orange-500 pl-6">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Inventory Command</h3>
                      <p className="text-slate-400 text-sm font-medium">Manage sizes, colors, and stock levels.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const existingColors = Array.from(new Set(watchedVariants.map((v: any) => v.color || 'Black')));
                        let newColor = 'New Color';
                        let counter = 1;
                        while (existingColors.includes(newColor)) {
                          newColor = `New Color ${counter++}`;
                        }
                        const newSize = 'L';
                        appendVariant({ 
                          color: newColor, 
                          colorHex: '#000000', 
                          size: newSize, 
                          price: 0, 
                          stockQuantity: 10, 
                          sku: generateSKU(newColor, newSize), 
                          images: [] 
                        });
                      }}
                      className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                    >
                      <Plus size={18} />
                      Add New Variant
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    {/* We group the flat fields by Color to show them as "one variant with multiple sizes" */}
                    {Array.from(new Set(watchedVariants.map((v: any) => v.color || 'Black'))).map((colorName, groupIdx) => {
                      const firstIdx = watchedVariants.findIndex((v: any) => (v.color || 'Black') === colorName);
                      const sameColorIndices = watchedVariants.map((v: any, i: number) => (v.color || 'Black') === colorName ? i : -1).filter((i: number) => i !== -1);

                      return (
                        <div key={groupIdx} className="bg-gray-50/30 p-10 rounded-[3rem] border border-gray-100 space-y-8 animate-in fade-in duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div
                                className="w-16 h-16 rounded-2xl shadow-xl border-4 border-white"
                                style={{ backgroundColor: watch(`variants.${firstIdx}.colorHex`) }}
                              />
                              <div>
                                <input
                                  value={watch(`variants.${firstIdx}.color`) || ''}
                                  onChange={(e) => {
                                    const color = e.target.value;
                                    sameColorIndices.forEach(idx => setValue(`variants.${idx}.color`, color, { shouldDirty: true, shouldValidate: true }));
                                  }}
                                  className="text-xl font-black text-slate-900 uppercase italic leading-none bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-lg p-1 -m-1 w-full"
                                  placeholder="Color Name"
                                />
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Color Group</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  const first = watch(`variants.${firstIdx}`);
                                  const newSize = 'XL';
                                  appendVariant({ 
                                    ...first, 
                                    size: newSize, 
                                    sku: generateSKU(first.color, newSize), 
                                    stockQuantity: 10 
                                  });
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
                              >
                                <Plus size={14} /> Add Size
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove entire ${colorName} color group?`)) {
                                    // Remove from highest index to lowest to avoid index shifts
                                    [...sameColorIndices].reverse().forEach(idx => removeVariant(idx));
                                  }
                                }}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Remove Color Group"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Color Visuals */}
                            <div className="lg:col-span-1 space-y-6">
                              <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Matrix</label>
                                <div className="grid grid-cols-2 gap-3">
                                  {watch(`variants.${firstIdx}.images`)?.map((url: string, imgIdx: number) => (
                                    <div key={`${url}-${imgIdx}`} className="relative aspect-square rounded-2xl overflow-hidden group/img shadow-md">
                                      <img src={url} alt="" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          // Update ALL variants with this color to have the same images
                                          const currentImages = watch(`variants.${firstIdx}.images`);
                                          const newImages = currentImages.filter((_: any, i: number) => i !== imgIdx);
                                          sameColorIndices.forEach(idx => setValue(`variants.${idx}.images`, newImages));
                                        }}
                                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => setMediaManager({ isOpen: true, path: `variants.${firstIdx}.images`, multiple: true })}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all bg-white gap-1"
                                  >
                                    <Plus size={20} />
                                    <span className="text-[7px] font-black uppercase">Add Image</span>
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Color Sync</label>
                                <div className="flex gap-3">
                                  <input
                                    type="color"
                                    value={watch(`variants.${firstIdx}.colorHex`)}
                                    onChange={(e) => {
                                      const hex = e.target.value;
                                      sameColorIndices.forEach(idx => setValue(`variants.${idx}.colorHex`, hex));
                                    }}
                                    className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                                  />
                                  <input
                                    {...register(`variants.${firstIdx}.colorHex`)}
                                    onChange={(e) => {
                                      const hex = e.target.value;
                                      sameColorIndices.forEach(idx => setValue(`variants.${idx}.colorHex`, hex));
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none font-mono text-xs"
                                    placeholder="#000000"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Sizes Table */}
                            <div className="lg:col-span-3">
                              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                  <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Size</th>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Price</th>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Compare at</th>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">SKU</th>
                                      <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400"></th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {sameColorIndices.map((fieldIdx) => (
                                      <tr key={variantFields[fieldIdx].id} className="group/row hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                          <input
                                            {...register(`variants.${fieldIdx}.size`)}
                                            onChange={(e) => {
                                              const size = e.target.value;
                                              setValue(`variants.${fieldIdx}.size`, size);
                                              // Auto-update SKU when size changes if SKU is empty or follows the pattern
                                              const currentSku = watch(`variants.${fieldIdx}.sku`);
                                              if (!currentSku || currentSku.includes('-')) {
                                                setValue(`variants.${fieldIdx}.sku`, generateSKU(colorName, size));
                                              }
                                            }}
                                            className="w-16 bg-transparent font-black text-slate-900 focus:outline-none uppercase"
                                          />
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-gray-400">$</span>
                                            <input
                                              type="number"
                                              {...register(`variants.${fieldIdx}.price`, { valueAsNumber: true })}
                                              className="w-20 bg-transparent font-black text-slate-900 focus:outline-none"
                                            />
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-gray-400">$</span>
                                            <input
                                              type="number"
                                              {...register(`variants.${fieldIdx}.comparePrice`, { valueAsNumber: true })}
                                              className="w-20 bg-transparent font-medium text-gray-400 focus:outline-none"
                                              placeholder="None"
                                            />
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <input
                                            type="number"
                                            {...register(`variants.${fieldIdx}.stockQuantity`, { valueAsNumber: true })}
                                            className="w-16 bg-transparent font-bold text-slate-900 focus:outline-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4">
                                          <input
                                            {...register(`variants.${fieldIdx}.sku`)}
                                            className="w-full bg-transparent font-mono text-[10px] text-gray-400 focus:outline-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <button
                                            type="button"
                                            onClick={() => removeVariant(fieldIdx)}
                                            className="p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            <MediaManager
              isOpen={mediaManager.isOpen}
              onClose={() => setMediaManager(prev => ({ ...prev, isOpen: false }))}
              onSelect={(url) => {
                if (mediaManager.multiple) {
                  const path = mediaManager.path;
                  const match = path.match(/variants\.(\d+)/);
                  if (match) {
                    const idx = parseInt(match[1]);
                    const colorName = watch(`variants.${idx}.color`);
                    const sameColorIndices = (watchedVariants || []).map((v: any, i: number) => (v.color || 'Black') === colorName ? i : -1).filter((i: number) => i !== -1);

                    sameColorIndices.forEach(i => {
                      const current = watch(`variants.${i}.images`) || [];
                      if (!current.includes(url)) {
                        setValue(`variants.${i}.images`, [...current, url], { shouldDirty: true });
                      }
                    });
                  } else {
                    const current = watch(path as any) || [];
                    setValue(path as any, [...current, url], { shouldDirty: true });
                  }
                } else {
                  setValue(mediaManager.path as any, url, { shouldDirty: true, shouldValidate: true });
                }
                setMediaManager(prev => ({ ...prev, isOpen: false }));
              }}
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
