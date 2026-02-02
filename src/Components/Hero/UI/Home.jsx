// src/components/Hero/Home.jsx - With Right Side Image
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Play, Rocket, Zap, Sparkles, Target } from "lucide-react";
// Import your background image
import heroBackground from "../../Images/ChatGPT Image Jan 10, 2026, 01_03_57 AM.png"; // Update path to your Image 2

const FeaturePill = memo(({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative flex items-center px-4 sm:px-6 py-3 space-x-2 transition-all duration-300 transform border rounded-full bg-black/30 backdrop-blur-md border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10">
        <Icon className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-semibold text-orange-300">
          {feature.text}
        </span>
      </div>
    </div>
  );
});

FeaturePill.displayName = "FeaturePill";

const Home = memo(({ onOpenAuthModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const containerRef = useRef(null);

  const handleGetStartedClick = useCallback(() => {
    onOpenAuthModal?.("signup");
  }, [onOpenAuthModal]);

  const handleWatchDemoClick = useCallback(() => {
    // Add your demo video logic here
    console.log("Watch Demo clicked");
  }, []);

  const handleMouseEnter = useCallback((type) => {
    setIsHovered(type);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Immediate visibility for hero section
    setIsVisible(true);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const featurePills = useMemo(
    () => [
      { icon: Target, text: "Smart Analytics" },
      { icon: Sparkles, text: "Equipment AI" },
    ],
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative flex items-center min-h-screen overflow-hidden bg-black px-4 sm:px-6"
    >
      {/* Background with gradient blobs - keeping original */}
      <div className="absolute inset-0">
        <div className="absolute rounded-full top-12 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute delay-1000 rounded-full top-28 sm:top-40 right-6 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute rounded-full bottom-12 sm:bottom-20 left-1/4 sm:left-1/3 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Subtle animated particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30 hidden sm:block">
        <div
          className="absolute w-1 h-1 rounded-full animate-ping top-20 left-1/4 bg-orange-400"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute w-1 h-1 rounded-full animate-ping top-40 right-1/3 bg-cyan-400"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute w-1 h-1 rounded-full animate-ping bottom-32 left-1/3 bg-pink-400"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Hero Badge */}
            <div
              className={`inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600/20 to-pink-600/20 backdrop-blur-sm border border-orange-500/40 rounded-full px-5 py-2.5 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">
                Revolutionary Gym Management
              </span>
              <Zap className="w-4 h-4 text-pink-400" />
            </div>

            {/* Main Title */}
            <h1
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight transform transition-all duration-1000 delay-200 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <span className="text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-500 bg-clip-text">
                FitTracker
              </span>
            </h1>

            {/* Subtitle */}
            <div
              className={`space-y-3 transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <p className="text-lg md:text-xl text-gray-300">
                Experience the{" "}
                <span className="font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
                  next evolution
                </span>{" "}
                of gym management with
              </p>
              <p className="text-xl md:text-2xl font-bold">
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                  AI-powered systems
                </span>{" "}
                <span className="text-gray-200">that seem like magic</span>
              </p>
            </div>

            {/* Feature Pills */}
            <div
              className={`flex flex-wrap gap-3 transform transition-all duration-1000 delay-600 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {featurePills.map((feature, index) => (
                <FeaturePill key={index} feature={feature} index={index} />
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-800 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              {/* Get Started Button */}
              <button
                className="relative w-full sm:w-auto px-6 sm:px-10 py-4 text-base font-bold text-white transition-all transform rounded-full group bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
                onMouseEnter={() => handleMouseEnter("primary")}
                onMouseLeave={handleMouseLeave}
                onClick={handleGetStartedClick}
              >
                <div className="absolute inset-0 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 group-hover:opacity-100 blur-xl" />
                <div className="relative flex items-center justify-center space-x-2">
                  <Play
                    className={`w-5 h-5 transition-all duration-300 ${
                      isHovered === "primary" ? "scale-110" : ""
                    }`}
                  />
                  <span>GET STARTED</span>
                  <Rocket
                    className={`w-5 h-5 transition-all duration-300 ${
                      isHovered === "primary" ? "translate-x-1" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Watch Demo Button */}
              <button
                className="relative w-full sm:w-auto px-6 sm:px-10 py-4 text-base font-bold text-gray-200 transition-all transform bg-black/40 border-2 border-gray-500/50 rounded-full group hover:border-white/80 hover:bg-black/60 backdrop-blur-md hover:text-white"
                onMouseEnter={() => handleMouseEnter("secondary")}
                onMouseLeave={handleMouseLeave}
                onClick={handleWatchDemoClick}
              >
                <span className="relative flex items-center justify-center space-x-2">
                  <Sparkles
                    className={`w-5 h-5 transition-all duration-300 ${
                      isHovered === "secondary" ? "rotate-180" : ""
                    }`}
                  />
                  <span>WATCH DEMO</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Background glow effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute w-64 h-64 rounded-full -top-10 -right-10 bg-cyan-500/20 blur-3xl animate-pulse"
                  style={{ animationDuration: "4s" }}
                />
                <div
                  className="absolute w-48 h-48 rounded-full bottom-10 -left-10 bg-purple-500/20 blur-3xl animate-pulse"
                  style={{ animationDuration: "5s", animationDelay: "1s" }}
                />
              </div>

              {/* Image Container with Animation */}
              <div
                className={`relative transform pt-10 transition-all duration-1000 delay-1000 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-20 opacity-0"
                }`}
              >
                {/* Replace src with your heroBackground import */}
                <img
                  src={heroBackground}
                  alt="FitTracker Dashboard"
                  className="relative z-10 w-full max-w-[420px] sm:scale-110 md:scale-125 lg:scale-150 rounded-2xl mx-auto"
                />
              
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
});

Home.displayName = "Home";

export default Home;
