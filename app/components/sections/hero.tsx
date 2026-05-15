"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const router = useRouter();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Fade in video after 2 seconds to hide the initial YouTube splash/controls
    const timer = setTimeout(() => setVideoLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[750px] bg-slate-950 overflow-hidden">
      {/* 
        HIDING YOUTUBE CONTROLS: 
        We use a massive scale (200%) and negative margins to push 
        the YouTube UI (title bar, controls, logo) outside the visible viewport.
      */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-slate-950">
        <div className={cn(
          "relative w-full h-full transition-opacity duration-1000",
          videoLoaded ? "opacity-60" : "opacity-0"
        )}>
          <iframe
            src="https://www.youtube.com/embed/cAm7jrnwgwo?autoplay=1&mute=1&controls=0&loop=1&playlist=cAm7jrnwgwo&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&vq=hd1080&disablekb=1"
            className="absolute top-1/2 left-1/2 w-[250vw] h-[250vh] min-w-[200%] min-h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
        
        {/* Advanced Cinematic Overlays */}
        <div className="absolute inset-0 bg-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
        
        {/* Tactical Grain Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex items-center justify-start px-8 sm:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* Tactical Tagline */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            Operational Readiness Protocol
          </div>

          {/* Aggressive Heading */}
          <h1 className="mt-8 text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.85] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Conquer the <br />
            <span className="text-orange-600 drop-shadow-[0_0_40px_rgba(234,88,12,0.4)]">Unknown.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-10 text-lg sm:text-xl text-slate-300 max-w-xl font-medium leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Professional-grade armor, carbon-fiber protection, and tactical gear engineered for those who demand absolute performance.
          </p>

          {/* Action Hub */}
          <div className="mt-12 flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <button
              onClick={() => router.push("/category?cat=all")}
              className="group relative flex items-center gap-4 px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-widest
                         bg-orange-600 text-white shadow-2xl shadow-orange-900/40 
                         transition-all duration-300 cursor-pointer border border-orange-500 overflow-hidden
                         hover:bg-white hover:text-orange-600 hover:scale-[1.05]
                         active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Deploy Gear <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={() => router.push("/about")}
              className="px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-widest
                         bg-transparent text-white border border-white/20
                         backdrop-blur-sm transition-all duration-300
                         hover:bg-white/10 hover:border-white/40"
            >
              System Doctrine
            </button>
          </div>

          {/* Operational Metrics */}
          <div className="mt-20 grid grid-cols-2 sm:flex items-center gap-12 animate-in fade-in duration-1000">
            <div className="flex flex-col">
              <span className="text-white font-black text-3xl tracking-tighter italic">100%</span>
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Impact Armor</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-white font-black text-3xl tracking-tighter italic">LEVEL-2</span>
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Protection</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-white font-black text-3xl tracking-tighter italic">24/7</span>
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Dispatch Hub</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  );
};

export default Hero;
