// Stats.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
import React, { useEffect, useState, useRef, useCallback, useMemo, memo, Suspense, lazy, useTransition, startTransition } from "react";
import { Dumbbell, Users, Shield, Target } from "lucide-react";

// Lazy load animated counter component
const AnimatedCounter = lazy(() => Promise.resolve({
  default: memo(({ value, duration = 2000, isVisible }) => {
    const [count, setCount] = useState(0);
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
      if (!isVisible) return;

      // Extract numeric part and suffix
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      
      const start = Date.now();
      const end = start + duration;

      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const currentCount = Math.floor(progress * numericValue);
        setCount(currentCount);
        setDisplayValue(currentCount + suffix);

        if (progress === 1) {
          clearInterval(timer);
          setDisplayValue(value); // Ensure final value matches exactly
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, duration, isVisible]);

    return <span>{displayValue}</span>;
  })
}));

// Loading skeleton for individual stat cards
const StatCardSkeleton = memo(() => (
  <div className="text-center animate-pulse">
    <div className="relative mb-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-700"></div>
    </div>
    <div className="w-20 h-10 bg-slate-700 rounded mx-auto mb-2"></div>
    <div className="w-16 h-4 bg-slate-700 rounded mx-auto"></div>
  </div>
));
StatCardSkeleton.displayName = 'StatCardSkeleton';

// Individual stat card component for better memoization
const StatCard = memo(({ stat, index, isVisible }) => {
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = stat.icon;

  const handleHover = useCallback((hovered) => {
    startTransition(() => {
      setIsHovered(hovered);
    });
  }, []);

  // Memoized card styles
  const cardStyle = useMemo(() => ({
    transitionDelay: `${index * 200}ms`
  }), [index]);

  const cardClassName = useMemo(() => 
    `text-center group transform transition-all duration-700 ${
      isVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-10 opacity-0"
    } hover:scale-110 ${isPending ? 'opacity-70' : 'opacity-100'}`
  , [isVisible, isPending]);

  const iconContainerClassName = useMemo(() => 
    `w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ${
      isHovered ? 'shadow-2xl' : ''
    }`
  , [stat.color, isHovered]);

  const numberClassName = useMemo(() => 
    `text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`
  , [stat.color]);

  return (
    <div
      className={cardClassName}
      style={cardStyle}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="relative mb-4">
        <div className={iconContainerClassName}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {/* Glow effect on hover */}
        {isHovered && (
          <div 
            className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} opacity-30 blur-xl animate-pulse`}
          />
        )}
      </div>
      <div className={numberClassName}>
        <Suspense fallback={<span>{stat.number}</span>}>
          <AnimatedCounter 
            value={stat.number} 
            duration={2000 + index * 200} 
            isVisible={isVisible}
          />
        </Suspense>
      </div>
      <div className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
        {stat.label}
      </div>
    </div>
  );
});
StatCard.displayName = 'StatCard';

const Stats = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const statsRef = useRef(null);

  // Memoized stats data
  const stats = useMemo(() => [
    {
      number: "500+",
      label: "Gyms Powered",
      color: "from-orange-400 to-red-500",
      icon: Dumbbell,
    },
    {
      number: "50K+",
      label: "Active Members",
      color: "from-green-400 to-emerald-500",
      icon: Users,
    },
    {
      number: "99.9%",
      label: "Uptime",
      color: "from-blue-400 to-cyan-500",
      icon: Shield,
    },
    {
      number: "24/7",
      label: "Support",
      color: "from-purple-400 to-pink-500",
      icon: Target,
    },
  ], []);

  // Memoized floating orbs for background animation
  const floatingOrbs = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${i * 0.5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }))
  , []);

  // Memoized intersection observer callback
  const handleIntersection = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      startTransition(() => {
        setIsVisible(true);
      });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersection,
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => observer.disconnect();
  }, [handleIntersection]);

  // Memoized section className
  const sectionClassName = useMemo(() => 
    `py-20 bg-gradient-to-br from-slate-900 via-black to-slate-800 relative overflow-hidden transition-opacity duration-300 ${
      isPending ? 'opacity-90' : 'opacity-100'
    }`
  , [isPending]);

  return (
    <section
      ref={statsRef}
      className={sectionClassName}
    >
      {/* Lazy loaded floating orbs */}
      <Suspense fallback={null}>
        {floatingOrbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute w-24 h-24 rounded-full blur-xl animate-pulse bg-gradient-to-r from-orange-500/10 to-purple-500/10"
            style={{
              left: orb.left,
              top: orb.top,
              animationDelay: orb.animationDelay,
              animationDuration: orb.animationDuration,
            }}
          />
        ))}
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <Suspense key={index} fallback={<StatCardSkeleton />}>
            <StatCard 
              stat={stat} 
              index={index} 
              isVisible={isVisible}
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
});

// Display name for debugging
Stats.displayName = 'Stats';

export default Stats;