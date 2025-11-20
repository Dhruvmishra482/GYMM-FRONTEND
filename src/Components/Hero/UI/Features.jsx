// Features.jsx - Optimized with Lazy Loading + Advanced Memoization (Fixed)
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  Suspense,
} from "react";
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
FeatureCardSkeleton.displayName = "FeatureCardSkeleton";

// Lazy-loaded feature card component - Modern Clean Design
const LazyFeatureCard = memo(
  ({ feature, index, isVisible, hoveredCard, onCardHover, onCardLeave }) => {
    const isHovered = hoveredCard === feature.id;

    return (
      <div
        className={`relative group cursor-pointer transition-all duration-700 transform w-full ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        } ${!feature.showOnMobile ? "hidden md:block" : ""}`}
        style={{
          transitionDelay: `${index * 150}ms`,
        }}
        onMouseEnter={() => onCardHover(feature.id)}
        onMouseLeave={onCardLeave}
      >
        {/* Modern Clean Card - No Boxes */}
        <div
          className={`
            relative h-full p-8 rounded-3xl border transition-all duration-700
            bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl
            ${
              isHovered
                ? "border-orange-400/50 shadow-2xl shadow-orange-500/20"
                : "border-slate-700/30"
            }
          `}
        >
          {/* Subtle Glow Effect on Hover */}
          <div
            className={`
          absolute -inset-4 rounded-3xl blur-2xl transition-all duration-700
          bg-gradient-to-br ${feature.color}
          ${isHovered ? "opacity-20" : "opacity-0"}
        `}
          />

          {/* Content */}
          <div className="relative z-10 py-8">
            {/* Stats Badge - Floating */}
            <div
              className={`
            inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold mb-6
            bg-gradient-to-r ${feature.color} text-white shadow-lg
            transform transition-all duration-500
            ${isHovered ? "scale-110 shadow-2xl" : ""}
          `}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span>{feature.stats}</span>
            </div>

            {/* Image placeholder - Full Width with Gradient Overlay */}
            {feature.image && (
              <div className="relative mb-8 overflow-hidden rounded-2xl">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20`}
                />
              </div>
            )}

            {/* Title with Gradient Underline */}
            <div className="mb-6">
              <h3
                className={`
              text-4xl font-black mb-3 transition-all duration-500
              ${isHovered ? "text-white" : "text-slate-100"}
            `}
              >
                {feature.title}
              </h3>

              {/* Animated Gradient Line */}
              <div
                className={`
                h-1 rounded-full transition-all duration-500 bg-gradient-to-r ${
                  feature.color
                }
                ${isHovered ? "w-24" : "w-16"}
              `}
              />
            </div>

            <div
              className={`
            text-base font-semibold mb-5 transition-all duration-500
            ${isHovered ? "text-slate-200" : "text-slate-400"}
          `}
            >
              {feature.subtitle}
            </div>

            <p
              className={`
            text-slate-300 text-lg mb-8 leading-relaxed transition-all duration-500
            ${isHovered ? "text-slate-100" : ""}
          `}
            >
              {feature.description}
            </p>

            {/* Feature List - Clean Minimal Style */}
            <ul className="space-y-4">
              {feature.details.map((detail, detailIndex) => (
                <li
                  key={detailIndex}
                  className={`
                  flex items-start transition-all duration-500
                  ${isHovered ? "translate-x-2" : ""}
                `}
                  style={{
                    transitionDelay: `${detailIndex * 100}ms`,
                  }}
                >
                  {/* Simple Checkmark Style */}
                  <svg
                    className={`w-6 h-6 mr-3 mt-0.5 flex-shrink-0 transition-all duration-500 ${
                      isHovered ? "scale-110" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${feature.id}-${detailIndex}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          className={
                            feature.color.includes("cyan")
                              ? "text-cyan-400"
                              : feature.color.includes("purple")
                              ? "text-purple-400"
                              : feature.color.includes("emerald")
                              ? "text-emerald-400"
                              : feature.color.includes("orange")
                              ? "text-orange-400"
                              : feature.color.includes("yellow")
                              ? "text-yellow-400"
                              : "text-green-400"
                          }
                          stopColor="currentColor"
                        />
                        <stop
                          offset="100%"
                          className={
                            feature.color.includes("cyan")
                              ? "text-purple-600"
                              : feature.color.includes("purple")
                              ? "text-red-500"
                              : feature.color.includes("emerald")
                              ? "text-blue-500"
                              : feature.color.includes("orange")
                              ? "text-pink-500"
                              : feature.color.includes("yellow")
                              ? "text-red-500"
                              : "text-teal-500"
                          }
                          stopColor="currentColor"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                      stroke={`url(#gradient-${feature.id}-${detailIndex})`}
                    />
                  </svg>
                  <span
                    className={`text-base font-medium transition-all duration-500 ${
                      isHovered ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
);
LazyFeatureCard.displayName = "LazyFeatureCard";

const Features = memo(() => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Get current location - memoized
  const location = useLocation();
  const showCTA = useMemo(
    () => location.pathname === "/features",
    [location.pathname]
  );

  // Memoized features data with responsive visibility
  const features = useMemo(
    () => [
      {
        id: 1,
        title: "Smart WhatsApp Automation",
        subtitle: "Automated Engagement",
        description:
          "Automated fee reminders, renewal alerts, QR payment links, and bulk messaging to keep your members engaged and payments on track.",
        stats: "100% Automation",
        details: [
          "Automated fee reminders",
          "Renewal alerts & notifications",
          "QR payment links",
          "Bulk messaging campaigns",
        ],
        color: "from-cyan-400 via-blue-500 to-purple-600",
        glowColor: "cyan",
        image: "", // Add your image path here
        showOnMobile: true,
      },
      {
        id: 2,
        title: "AI Workout Plans",
        subtitle: "Personalized Training",
        description:
          "Personalized workout routines powered by AI that adapt to member progress, goals, and fitness levels for maximum results.",
        stats: "Smart Training",
        details: [
          "AI-powered workout generation",
          "Progress-based adaptation",
          "Goal-oriented programs",
          "Real-time adjustments",
        ],
        color: "from-purple-400 via-pink-500 to-red-500",
        glowColor: "purple",
        image: "", // Add your image path here
        showOnMobile: true,
      },
      {
        id: 3,
        title: "AI Crowd Prediction",
        subtitle: "Smart Analytics",
        description:
          "Smart analytics predict peak hours and member flow, helping optimize staff scheduling and equipment availability.",
        stats: "Peak Optimization",
        details: [
          "Peak hour predictions",
          "Member flow analytics",
          "Staff optimization",
          "Equipment planning",
        ],
        color: "from-emerald-400 via-teal-500 to-blue-500",
        glowColor: "emerald",
        image: "", // Add your image path here
        showOnMobile: true,
      },
      {
        id: 4,
        title: "AI-Driven Retention System",
        subtitle: "Member Engagement",
        description:
          "Predict member churn before it happens and automatically trigger re-engagement campaigns to boost retention by up to 40%.",
        stats: "40% Retention Boost",
        details: [
          "Churn prediction",
          "Auto re-engagement campaigns",
          "Behavioral analysis",
          "Retention insights",
        ],
        color: "from-orange-400 via-red-500 to-pink-500",
        glowColor: "orange",
        image: "", // Add your image path here
        showOnMobile: false,
      },
      {
        id: 5,
        title: "Predictive Fee Tracking",
        subtitle: "Revenue Intelligence",
        description:
          "AI-powered insights forecast revenue, identify payment patterns, and send smart reminders to ensure timely fee collection.",
        stats: "Smart Revenue",
        details: [
          "Revenue forecasting",
          "Payment pattern analysis",
          "Smart reminders",
          "Fee collection optimization",
        ],
        color: "from-yellow-400 via-orange-500 to-red-500",
        glowColor: "yellow",
        image: "", // Add your image path here
        showOnMobile: false,
      },
      {
        id: 6,
        title: "AI Diet Plans",
        subtitle: "Nutrition Intelligence",
        description:
          "Generate customized nutrition plans tailored to each member's goals, dietary preferences, and progress tracking.",
        stats: "Personalized Nutrition",
        details: [
          "Custom meal plans",
          "Dietary preference matching",
          "Progress-based adjustments",
          "Nutritional goal tracking",
        ],
        color: "from-green-400 via-emerald-500 to-teal-500",
        glowColor: "green",
        image: "", // Add your image path here
        showOnMobile: false,
      },
    ],
    []
  );

  // Memoized floating orbs
  const floatingOrbs = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      })),
    []
  );

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
  const mouseGlowStyle = useMemo(
    () => ({
      background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,165,0,0.15) 0%, transparent 50%)`,
    }),
    [mousePos.x, mousePos.y]
  );

  // Intersection observer for lazy loading cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.dataset.cardId);
            setVisibleCards((prev) => new Set([...prev, cardId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
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
      const cardElements =
        containerRef.current.querySelectorAll("[data-card-id]");
      cardElements.forEach((card) => observer.observe(card));
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
        <div className="absolute inset-0 opacity-30" style={mouseGlowStyle} />
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
              transform: `translateY(${
                Math.sin(scrollY * 0.001 + orb.id) * 20
              }px)`,
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

      {/* Revolutionary Features Grid - Lazy Loaded with Responsive Design */}
      <section ref={containerRef} className="relative z-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                data-card-id={feature.id}
                className="min-h-[600px] flex"
              >
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
Features.displayName = "Features";

export default Features;
