"use client";

import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 sm:p-20 relative overflow-hidden text-white shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-orange-600/5 rounded-full blur-[100px] -ml-20 -mb-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-10 rounded-full bg-orange-600" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Tactical Support</span>
                </div>
                <h2 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic">
                  Need Expert <br /> <span className="text-orange-600">Advice?</span>
                </h2>
              </div>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
                Our armor specialists are active. Get personalized gear fitment advice and technical support instantly.
              </p>

              <div className="flex flex-wrap gap-6">
                <a 
                  href="https://wa.me/923334471403" 
                  target="_blank"
                  className="px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-orange-600 transition-all flex items-center gap-3 shadow-xl shadow-orange-900/20"
                >
                  <MessageSquare size={18} />
                  Initiate Chat
                </a>
                <a 
                  href="tel:03334471403"
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3"
                >
                  <PhoneCall size={18} />
                  Voice Comms
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-md hover:border-orange-600/40 transition-colors">
                <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Command Unit 1</p>
                <p className="text-3xl font-black italic tracking-tighter">0333-4471403</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">Primary Ops & Orders</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-md hover:border-orange-600/40 transition-colors">
                <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Command Unit 2</p>
                <p className="text-3xl font-black italic tracking-tighter">0308-4243437</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">Logistics & Recon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
