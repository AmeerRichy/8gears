'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Package, 
  TrendingUp, 
  Eye, 
  ShieldCheck, 
  PlusCircle, 
  ArrowUpRight,
  LayoutGrid
} from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const totalViews = products.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);
    const categoryCount = new Set(products.map(p => p.category)).size;
    const outOfStock = products.filter(p => p.variants.some((v: any) => v.stockQuantity === 0)).length;
    
    return {
      totalProducts: products.length,
      totalViews,
      categoryCount,
      outOfStock
    };
  }, [products]);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Hero Welcome */}
        <header className="relative bg-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-orange-600/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest mb-4">
                <ShieldCheck size={16} />
                <span>8 GEARS CONTROL PROTOCOL</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                Welcome back, Commander.
              </h1>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                Your inventory is synchronized with the global cluster. You have {stats.totalProducts} active units live.
              </p>
            </div>
            <Link 
              href="/admin/products/new"
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-900/40 flex items-center gap-3 active:scale-95"
            >
              <PlusCircle size={22} />
              Add New Product
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            sub="Active Catalog Items" 
            icon={<Package className="text-blue-500" />} 
          />
          <StatCard 
            title="Total Traffic" 
            value={stats.totalViews} 
            sub="Lifetime Product Views" 
            icon={<Eye className="text-emerald-500" />} 
          />
          <StatCard 
            title="Categories" 
            value={stats.categoryCount} 
            sub="Active Product Segments" 
            icon={<LayoutGrid className="text-purple-500" />} 
          />
          <StatCard 
            title="Low Stock" 
            value={stats.outOfStock} 
            sub="Items needing attention" 
            icon={<TrendingUp className={`text-red-500 ${stats.outOfStock > 0 ? 'animate-pulse' : ''}`} />} 
          />
        </div>

        {/* Recent Products & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recently Added</h3>
              <Link href="/admin/products" className="text-sm font-bold text-orange-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden">
                      {product.variants?.[0]?.images?.[0] && (
                        <img src={product.variants[0].images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{product.title}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase">{product.category}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/products/edit/${product._id}`}
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-bold italic">No products found. Start by adding one!</div>
              )}
            </div>
          </div>

          <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-orange-900/20">
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tighter leading-none">Global Performance Index</h3>
              <p className="text-orange-100 font-medium text-sm">Your store is currently operating at optimal capacity. All systems functional.</p>
            </div>
            <div className="mt-10 py-6 border-y border-white/20">
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-black leading-none tracking-tighter">100%</span>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-200 mb-1">Reliability</span>
                </div>
            </div>
            <button className="mt-8 w-full bg-white text-orange-600 py-4 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-all active:scale-95">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</div>
      </div>
      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</div>
    </div>
  );
}
