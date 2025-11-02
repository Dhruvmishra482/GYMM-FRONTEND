// src/components/Hero/CTA.jsx - Fully Responsive Version
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
    <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Heading - Responsive font sizes */}
          <h2 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Ready to{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
              Revolutionize
            </span>{" "}
            Your Gym?
          </h2>

          {/* Description - Responsive text */}
          <p className="max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg md:text-xl leading-relaxed text-white/70 px-4 sm:px-0">
            Lead the fitness revolution. Start free today and power growth like 10,000+ gyms with FitTracker.
          </p>

          {/* Buttons - Fully responsive */}
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 w-full px-4 sm:px-0 sm:flex-row">
            {/* Start Today Button */}
            <button 
              onClick={handleStartTodayClick}
              className="relative w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-4 md:py-5 overflow-hidden text-base sm:text-lg md:text-xl font-bold text-black transition-all duration-300 group bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl sm:rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2 sm:mr-3">Start Today</span>
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-orange-500 to-pink-600 group-hover:opacity-100 rounded-xl sm:rounded-2xl"></div>
            </button>

            {/* Watch Demo Button */}
            <button className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold text-white transition-all duration-300 border-2 group border-white/20 hover:border-white hover:bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-lg active:scale-95">
              <span className="flex items-center justify-center">
                <span className="mr-2 sm:mr-3">Watch Demo</span>
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
            </button>
          </div>

          {/* Footer Message - Responsive text */}
          <div className="mt-12 sm:mt-14 md:mt-16 text-white/60">
            <p className="text-sm sm:text-base md:text-lg px-4 sm:px-0">
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