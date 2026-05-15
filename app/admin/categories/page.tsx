'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { FolderTree, Package, Plus, Trash2, X } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        fetchCategories();
        setIsModalOpen(false);
        setNewCategory({ name: '', description: '' });
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This won\'t delete products in this category, but the category itself will be removed from the master list.')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Master Categories</h1>
            <p className="text-slate-500 font-medium mt-1">Manage the hierarchy of your motorbike gear catalog.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
          >
            <Plus size={20} />
            New Category
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <FolderTree size={28} />
                </div>
                <button 
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">{cat.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{cat.description || 'No description provided.'}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Package size={14} className="text-orange-500" />
                <span>Global Catalog ID: {cat.slug}</span>
              </div>
            </div>
          ))}

          {loading && Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-slate-50 animate-pulse h-[240px] rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Create Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-orange-500/10 font-bold"
                  placeholder="e.g. Helmets, Gloves"
                  value={newCategory.name}
                  onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brief Description</label>
                <textarea 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-orange-500/10 font-bold min-h-[100px]"
                  placeholder="Describe this category..."
                  value={newCategory.description}
                  onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {submitting ? 'CREATING...' : 'ADD TO CATALOG'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}