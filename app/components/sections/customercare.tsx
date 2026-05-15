"use client";

import React from "react";
import { Zap, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    title: "Tactical Logistics",
    desc: "Swift and secure shipping across the nation, ensuring your gear arrives ready for deployment.",
    icon: <Truck size={32} />,
  },
  {
    title: "Elite Protection",
    desc: "Every product is impact-certified and curated from the world's most trusted armor brands.",
    icon: <ShieldCheck size={32} />,
  },
  {
    title: "Rapid Support",
    desc: "Direct communication line to our technical team for fitment, safety, and gear doctrine advice.",
    icon: <Zap size={32} />,
  },
];

export default function CustomerCare() {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-24">
          <div className="flex flex-col items-center gap-3 mb-4">
             <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-8 rounded-full bg-orange-600" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Operational Support</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">
              The 8 GEARS <span className="text-slate-300">Standard</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            We've refined every detail of your mission to ensure protective gear is delivered with absolute precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {features.map((f, i) => (
            <div key={i} className="group relative">
              <div className="flex flex-col items-center text-center">
                {/* Icon Box */}
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-orange-600 shadow-2xl shadow-slate-200 border border-slate-100 mb-10 group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-6 transition-all duration-700 ease-out">
                  {f.icon}
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
                  {f.title}
                </h3>
                
                <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                  {f.desc}
                </p>
                
                {/* Decorative Indicator */}
                <div className="mt-8 w-12 h-1.5 bg-slate-200 rounded-full group-hover:w-24 group-hover:bg-orange-600 transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
