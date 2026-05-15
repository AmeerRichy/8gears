"use client";

import React from "react";
import Footer from "../components/footer";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FCF8F8] font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0b0b0b] text-white rounded-b-[3rem]">
        <div className="absolute inset-0">
          <div className="absolute -top-36 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-8 text-sm font-bold uppercase tracking-widest">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Get in Touch<span className="text-orange-600">.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Have questions about our products or your order? We're here to help you achieve your perfect glow.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* WhatsApp 1 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-pink-100/20 border border-pink-100 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-[#FDE8EF] rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">💬</div>
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Primary WhatsApp</h3>
            <p className="text-gray-500 font-medium mb-6">Available for orders and instant product inquiries.</p>
            <a
              href="https://wa.me/923334471403"
              target="_blank"
              className="inline-flex items-center gap-2 text-orange-600 font-black text-lg hover:gap-4 transition-all"
            >
              0333-4471403 <span>→</span>
            </a>
          </div>

          {/* WhatsApp 2 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-pink-100/20 border border-pink-100 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-[#FDE8EF] rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📱</div>
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Support Line</h3>
            <p className="text-gray-500 font-medium mb-6">Secondary line for delivery tracking and general support.</p>
            <a
              href="https://wa.me/923084243437"
              target="_blank"
              className="inline-flex items-center gap-2 text-orange-600 font-black text-lg hover:gap-4 transition-all"
            >
              0308-4243437 <span>→</span>
            </a>
          </div>

          {/* Call Support */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-pink-100/20 border border-pink-100 hover:-translate-y-2 transition-all duration-300 group lg:col-span-1 md:col-span-2 lg:md:col-span-1">
            <div className="w-16 h-16 bg-[#FDE8EF] rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📞</div>
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Voice Call</h3>
            <p className="text-gray-500 font-medium mb-6">Call us directly during business hours (10 AM - 8 PM).</p>
            <div className="space-y-2">
              <a href="tel:03334471403" className="block text-black font-black text-lg hover:text-orange-600 transition">0333-4471403</a>
              <a href="tel:03084243437" className="block text-black font-black text-lg hover:text-orange-600 transition">0308-4243437</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form or Map Placeholder Section */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="bg-white p-12 rounded-[3rem] border border-pink-50 shadow-sm text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-8 w-1.5 rounded-full bg-orange-600" />
            <h2 className="text-3xl font-[1000] text-black tracking-tighter">Visit Storefront</h2>
          </div>
          <p className="text-gray-600 mb-10 text-lg font-medium">We're located in the heart of beauty excellence.</p>

          <div className="aspect-video w-full rounded-[2rem] bg-gray-100 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000&auto=format&fit=crop"
              alt="Store"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-white shadow-2xl">
                <p className="text-black font-black">Elegance Essentials HQ</p>
                <p className="text-gray-500 text-sm">Pakistan's Premium Beauty Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
