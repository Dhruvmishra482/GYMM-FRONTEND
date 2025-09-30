// Features.jsx - Optimized with Lazy Loading + Advanced Memoization (Fixed)
import React, { useState, useEffect, useRef, useCallback, useMemo, memo, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Shield,
  BarChart3,
  CreditCard,
  Calendar,
  Apple,
  Target,
  Zap,
  Sparkles,
  Rocket,
} from "lucide-react";

// Loading fallback component
const FeatureCardSkeleton = memo(() => (
  <div className="relative h-[400px] p-8 rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl animate-pulse">
    <div className="w-16 h-6 bg-slate-700 rounded-full mb-6"></div>
    <div className="w-20 h-20 bg-slate-700 rounded-2xl mb-6"></div>
    <div className="w-3/4 h-8 bg-slate-700 rounded mb-2"></div>
    <div className="w-1/2 h-4 bg-slate-700 rounded mb-4"></div>
    <div className="w-full h-16 bg-slate-700 rounded mb-6"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-3 h-3 bg-slate-700 rounded-full mr-3"></div>
          <div className="w-2/3 h-3 bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
));
FeatureCardSkeleton.displayName = 'FeatureCardSkeleton';

// Lazy-loaded feature card component
const LazyFeatureCard = memo(({ feature, index, isVisible, hoveredCard, onCardHover, onCardLeave }) => {
  const Icon = feature.icon;
  const isHovered = hoveredCard === feature.id;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-700 transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => onCardHover(feature.id)}
      onMouseLeave={onCardLeave}
    >
      {/* Main Card */}
      <div
        className={`
        relative h-full p-8 rounded-3xl border transition-all duration-700 transform
        ${
          isHovered
            ? `scale-105 border-${feature.glowColor}-400/50 shadow-2xl shadow-${feature.glowColor}-500/25`
            : "border-slate-700/30 hover:border-slate-600/50"
        }
        bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl
      `}
      >
        {/* Animated Background */}
        <div
          className={`
          absolute inset-0 rounded-3xl opacity-0 transition-all duration-700
          bg-gradient-to-br ${feature.color}
          ${isHovered ? "opacity-10" : ""}
        `}
        />

        {/* Glow Effect */}
        <div
          className={`
          absolute -inset-1 rounded-3xl blur-xl transition-all duration-700
          bg-gradient-to-br ${feature.color}
          ${isHovered ? "opacity-30" : "opacity-0"}
        `}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Stats Badge */}
          <div
            className={`
            inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold mb-6
            bg-gradient-to-r ${feature.color} text-white
            transform transition-all duration-500
            ${isHovered ? "scale-110 animate-pulse" : ""}
          `}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span>{feature.stats}</span>
          </div>

          {/* Icon */}
          <div
            className={`
            relative mb-6 transform transition-all duration-700
            ${isHovered ? "scale-125 rotate-12" : ""}
          `}
          >
            <div
              className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${feature.color} shadow-lg
              transform transition-all duration-500
              ${isHovered ? "rotate-12 shadow-2xl" : ""}
            `}
            >
              <Icon className="w-10 h-10 text-white" />
              {isHovered && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
              )}
            </div>

            {/* Icon glow */}
            <div
              className={`
              absolute inset-0 rounded-2xl blur-lg transition-all duration-500
              bg-gradient-to-br ${feature.color}
              ${isHovered ? "opacity-50 scale-150" : "opacity-0"}
            `}
            />
          </div>

          {/* Title */}
          <h3
            className={`
            text-3xl font-black mb-2 transition-all duration-500
            ${isHovered ? "text-white scale-105" : "text-slate-200"}
          `}
          >
            {feature.title}
          </h3>

          <div
            className={`
            text-sm font-semibold mb-4 transition-all duration-500
            bg-gradient-to-r ${
              feature.color
            } bg-clip-text text-transparent
            ${isHovered ? "scale-105" : ""}
          `}
          >
            {feature.subtitle}
          </div>

          <p
            className={`
            text-slate-300 mb-6 leading-relaxed transition-all duration-500
            ${isHovered ? "text-slate-100" : ""}
          `}
          >
            {feature.description}
          </p>

          {/* Feature List */}
          <ul
            className={`
            space-y-3 transform transition-all duration-700
            ${isHovered ? "translate-x-2" : ""}
          `}
          >
            {feature.details.map((detail, detailIndex) => (
              <li
                key={detailIndex}
                className={`
                  flex items-center text-sm transition-all duration-500
                  ${isHovered ? "text-white" : "text-slate-400"}
                `}
                style={{
                  transitionDelay: `${detailIndex * 100}ms`,
                }}
              >
                <div
                  className={`
                  w-3 h-3 rounded-full mr-3 transition-all duration-500
                  bg-gradient-to-r ${feature.color}
                  ${isHovered ? "scale-150 animate-pulse" : ""}
                `}
                />
                <span className="font-medium">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
LazyFeatureCard.displayName = 'LazyFeatureCard';

const Features = memo(() => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Get current location - memoized
  const location = useLocation();
  const showCTA = useMemo(() => location.pathname === "/features", [location.pathname]);

  // Memoized features data
  const features = useMemo(() => [
    {
      id: 1,
      icon: Shield,
      title: "Smart Authentication",
      subtitle: "AI-Powered Security",
      description:
        "Next-gen biometric authentication with quantum encryption and behavioral analysis",
      stats: "99.9% Security",
      details: [
        "Biometric facial recognition",
        "Quantum encryption",
        "AI behavioral analysis",
        "Zero-trust architecture",
      ],
      color: "from-cyan-400 via-blue-500 to-purple-600",
      glowColor: "cyan",
    },
    {
      id: 2,
      icon: BarChart3,
      title: "Holographic Dashboard",
      subtitle: "3D Data Visualization",
      description:
        "Immersive 3D dashboards with real-time holographic data projections and AR integration",
      stats: "Real-time Analytics",
      details: [
        "3D data visualization",
        "AR integration",
        "Predictive analytics",
        "Voice commands",
      ],
      color: "from-purple-400 via-pink-500 to-red-500",
      glowColor: "purple",
    },
    {
      id: 3,
      icon: Users,
      title: "Neural Member Profiles",
      subtitle: "AI-Driven Insights",
      description:
        "Deep learning algorithms create comprehensive member DNA with predictive modeling",
      stats: "10K+ Members",
      details: [
        "AI personality mapping",
        "Predictive health insights",
        "Genomic integration",
        "Behavioral patterns",
      ],
      color: "from-emerald-400 via-teal-500 to-blue-500",
      glowColor: "emerald",
    },
    {
      id: 4,
      icon: Calendar,
      title: "Quantum Scheduling",
      subtitle: "Time Manipulation",
      description:
        "Quantum computing optimizes schedules across multiple dimensions and realities",
      stats: "Infinite Capacity",
      details: [
        "Quantum optimization",
        "Multi-dimensional booking",
        "Time-travel scheduling",
        "Parallel universe sync",
      ],
      color: "from-orange-400 via-red-500 to-pink-500",
      glowColor: "orange",
    },
    {
      id: 5,
      icon: CreditCard,
      title: "Blockchain Payments",
      subtitle: "Crypto Evolution",
      description:
        "Revolutionary DeFi integration with smart contracts and multi-chain compatibility",
      stats: "Zero Fees",
      details: [
        "Smart contracts",
        "Multi-chain support",
        "NFT memberships",
        "Yield farming rewards",
      ],
      color: "from-yellow-400 via-orange-500 to-red-500",
      glowColor: "yellow",
    },
    {
      id: 6,
      icon: Apple,
      title: "DNA Nutrition AI",
      subtitle: "Genetic Optimization",
      description:
        "Personalized nutrition based on genetic markers, microbiome analysis, and cosmic alignment",
      stats: "Perfect Health",
      details: [
        "Genetic meal planning",
        "Microbiome analysis",
        "Cosmic nutrition sync",
        "Molecular gastronomy",
      ],
      color: "from-green-400 via-emerald-500 to-teal-500",
      glowColor: "green",
    },
  ], []);

  // Memoized floating orbs
  const floatingOrbs = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${i * 0.5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }))
  , []);

  // Memoized callbacks
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  const handleCardHover = useCallback((cardId) => {
    setHoveredCard(cardId);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  // Memoized mouse glow style
  const mouseGlowStyle = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,165,0,0.15) 0%, transparent 50%)`,
  }), [mousePos.x, mousePos.y]);

  // Intersection observer for lazy loading cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.dataset.cardId);
            setVisibleCards(prev => new Set([...prev, cardId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const mainObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      mainObserver.observe(containerRef.current);
      
      // Observe individual cards for lazy loading
      const cardElements = containerRef.current.querySelectorAll('[data-card-id]');
      cardElements.forEach(card => observer.observe(card));
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      mainObserver.disconnect();
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={mouseGlowStyle}
        />
        {/* Floating orbs - Lazy loaded and memoized */}
        {floatingOrbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute w-32 h-32 rounded-full blur-xl animate-pulse bg-gradient-to-r from-orange-500/10 to-purple-500/10"
            style={{
              left: orb.left,
              top: orb.top,
              animationDelay: orb.animationDelay,
              animationDuration: orb.animationDuration,
              transform: `translateY(${Math.sin(scrollY * 0.001 + orb.id) * 20}px)`,
            }}
          />
        ))}
      </div>

      {/* Mind-blowing Hero */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-7xl">
          <div className="relative">
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 mb-8 space-x-2 border rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border-orange-500/30">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                <span className="font-semibold text-orange-300">
                  Revolutionary Features
                </span>
                <Zap className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>

              <h1 className="mb-8 text-6xl font-black leading-none md:text-8xl lg:text-9xl">
                <span className="text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 via-pink-400 to-purple-400 bg-clip-text animate-pulse">
                  FEATURES
                </span>
                <div className="mt-4 text-2xl font-light md:text-4xl text-slate-300">
                  that will{" "}
                  <span className="font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text animate-bounce">
                    BLOW YOUR MIND
                  </span>
                </div>
              </h1>

              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-2xl font-light leading-relaxed md:text-3xl text-slate-300">
                  Experience the{" "}
                  <span className="font-bold text-orange-400">
                    next evolution
                  </span>{" "}
                  of gym management with
                  <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    {" "}
                    AI-powered features
                  </span>{" "}
                  that seem like magic
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Features Grid - Lazy Loaded */}
      <section
        ref={containerRef}
        className="relative z-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.id} data-card-id={feature.id}>
                {visibleCards.has(feature.id) ? (
                  <LazyFeatureCard
                    feature={feature}
                    index={index}
                    isVisible={isVisible}
                    hoveredCard={hoveredCard}
                    onCardHover={handleCardHover}
                    onCardLeave={handleCardLeave}
                  />
                ) : (
                  <FeatureCardSkeleton />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Epic CTA - Conditionally rendered */}
      {showCTA && (
        <section className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="relative">
              {/* Background Effects */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl animate-pulse" />

              <div className="relative z-10">
                <div className="inline-flex items-center px-6 py-3 mb-8 space-x-2 border rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border-orange-500/30">
                  <Rocket className="w-5 h-5 text-orange-400 animate-bounce" />
                  <span className="font-semibold text-orange-300">
                    Ready for Takeoff?
                  </span>
                </div>

                <h2 className="mb-8 text-5xl font-black md:text-7xl">
                  <span className="text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 via-pink-400 to-purple-400 bg-clip-text">
                    EXPERIENCE THE FUTURE
                  </span>
                </h2>

                <p className="max-w-4xl mx-auto mb-12 text-2xl leading-relaxed text-slate-300">
                  Join the{" "}
                  <span className="font-bold text-orange-400">
                    fitness revolution
                  </span>{" "}
                  and witness how AI transforms your gym into a{" "}
                  <span className="font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                    next-generation powerhouse
                  </span>
                </p>

                <div className="flex flex-col justify-center gap-6 sm:flex-row">
                  <Link to="/signup" className="relative inline-block group">
                    <span className="relative flex items-center justify-center px-12 py-6 text-xl font-black text-white transition-all duration-500 transform rounded-full shadow-2xl group bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 hover:scale-110 hover:rotate-1 hover:shadow-orange-500/50">
                      <Target className="w-6 h-6 mr-3 group-hover:animate-spin" />
                      LAUNCH NOW
                      <Sparkles className="w-6 h-6 ml-3 group-hover:animate-bounce" />
                    </span>
                    <div className="absolute inset-0 transition-opacity rounded-full opacity-50 pointer-events-none bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 blur-xl group-hover:opacity-100 animate-pulse" />
                  </Link>

                  <button className="relative px-12 py-6 text-xl font-black text-purple-400 transition-all duration-500 transform border-2 border-purple-500 rounded-full group hover:text-white hover:border-purple-400 hover:scale-110 hover:-rotate-1 hover:bg-purple-500/20">
                    <span className="flex items-center justify-center">
                      <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                      WATCH MAGIC
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
});

// Display name for debugging
Features.displayName = 'Features';

export default Features;