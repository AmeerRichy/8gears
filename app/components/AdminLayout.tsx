'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Settings, 
  ShieldCheck,
  Truck,
  MessageSquare
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) return null;

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: Truck },
    { name: 'Leads', href: '/admin/leads', icon: LayoutDashboard },
    { name: 'Subscribers', href: '/admin/subscribers', icon: MessageSquare },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-8 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">8G</span>
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">8 GEARS</span>
            </Link>
            <div className="mt-4 flex items-center gap-2 px-1">
              <ShieldCheck size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Admin Mode</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold group
                  ${isActive(item.href) 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={22} className={isActive(item.href) ? 'text-white' : 'text-slate-500 group-hover:text-orange-500 transition-colors'} />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            ))}

            <div className="pt-8">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4">Utilities</p>
              <Link
                href="/"
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold group"
              >
                <ExternalLink size={22} className="text-slate-500 group-hover:text-orange-500" />
                <span className="tracking-tight">View Live Store</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold group"
              >
                <Settings size={22} className="text-slate-500 group-hover:text-orange-500" />
                <span className="tracking-tight">System Settings</span>
              </Link>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-800">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-all font-bold group"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">
              {pathname === '/admin' ? 'System Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-black text-slate-900">{session.user?.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Administrator</span>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">
              {session.user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
