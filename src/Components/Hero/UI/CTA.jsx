// src/components/Hero/CTA.jsx
import React, { memo, useCallback } from "react";
import { Rocket, ChevronDown } from "lucide-react";

const CTA = memo(({ onOpenAuthModal }) => {
  // Memoized callback for start today click
  const handleStartTodayClick = useCallback(() => {
    if (onOpenAuthModal) {
      onOpenAuthModal("signup");
    }
  }, [onOpenAuthModal]);

  return (
    <section className="relative z-10 py-20">
      <div className="container px-6 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-6xl font-black text-white">
            Ready to{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
              Revolutionize
            </span>{" "}
            Your Gym?
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-xl leading-relaxed text-white/70">
            Lead the fitness revolution. Start free today and power growth like 10,000+ gyms with FitTracker.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button 
              onClick={handleStartTodayClick}
              className="relative px-12 py-5 overflow-hidden text-xl font-bold text-black transition-all duration-300 group bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
            >
              <span className="relative z-10 flex items-center">
                Start Today
                <Rocket className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-orange-500 to-pink-600 group-hover:opacity-100 rounded-2xl"></div>
            </button>

            <button className="px-12 py-5 text-xl font-bold text-white transition-all duration-300 border-2 group border-white/20 hover:border-white hover:bg-white/10 rounded-2xl backdrop-blur-lg">
              Watch Demo
              <ChevronDown className="inline w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>

          <div className="mt-16 text-white/60">
            <p>
              ✨ Strong gyms aren't built by chance, they're built by smart systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

// Display name for debugging
CTA.displayName = 'CTA';

export default CTA;