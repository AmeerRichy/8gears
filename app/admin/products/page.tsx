'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, ExternalLink, Package, Filter, ArrowUpDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) return null;

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? All variants and data will be permanently removed.')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-1 bg-orange-600 rounded-full"></span>
              <span className="text-orange-600 font-black uppercase tracking-widest text-[10px]">8 GEARS Systems</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Product Inventory</h1>
            <p className="text-slate-500 mt-1 font-medium italic text-sm">Manage your professional motorbike gear and variants</p>
          </div>
          <Link
            href="/admin/products/new"
            className="group relative inline-flex items-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:bg-orange-600 shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
            { label: 'Total Stock', value: products.reduce((acc, p) => acc + p.variants.reduce((vAcc: number, v: any) => vAcc + v.stockQuantity, 0), 0), icon: ArrowUpDown, color: 'green' },
            { label: 'Active Categories', value: categories.length - 1, icon: Filter, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={cn(
                "p-4 rounded-2xl",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'green' && "bg-green-50 text-green-600",
                stat.color === 'orange' && "bg-orange-50 text-orange-600",
              )}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search catalog by title or brand..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none font-black text-slate-700 min-w-[200px]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-6">Product Details</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Variants</th>
                  <th className="px-8 py-6">Stock Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-6 h-24">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                            <div className="h-3 bg-slate-50 rounded w-1/6"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Package className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Gear Found</h3>
                        <p className="text-slate-500 font-medium">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const totalStock = product.variants.reduce((acc: number, v: any) => acc + v.stockQuantity, 0);
                    return (
                      <tr key={product._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 mr-5 border border-slate-100 shadow-sm transition-transform group-hover:rotate-2 duration-300">
                              {product.variants[0]?.images[0] ? (
                                <img src={product.variants[0].images[0]} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                  <Package size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 text-lg leading-tight tracking-tighter">{product.title}</div>
                              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-orange-100/50">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex -space-x-2">
                            {Array.from(new Set(product.variants.map((v: any) => v.color))).slice(0, 3).map((color: any, idx) => (
                              <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-black text-white shadow-sm" title={color}>
                                {color.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {new Set(product.variants.map((v: any) => v.color)).size > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                                +{new Set(product.variants.map((v: any) => v.color)).size - 3}
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-tight">{product.variants.length} total SKUs</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-xs font-black px-3 py-1.5 rounded-lg w-fit border",
                              totalStock > 20 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                              totalStock > 0 ? "bg-amber-50 text-amber-600 border-amber-100" : 
                              "bg-red-50 text-red-600 border-red-100"
                            )}>
                              {totalStock} UNIT{totalStock !== 1 ? 'S' : ''}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">Global Inventory</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/product/${product.slug}`}
                              target="_blank"
                              className="p-2.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                              title="Preview Storefront"
                            >
                              <ExternalLink size={18} />
                            </Link>
                            <Link
                              href={`/admin/products/edit/${product._id}`}
                              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Edit Details"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}