import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User, Mail, Phone, Calendar, MapPin, Award, Star,
  ChevronLeft, Search, Settings, Crown, Shield, Flame,
} from "lucide-react";

// ============================================
// ADVANCED ANIMATION HOOKS
// ============================================

// Intersection Observer for viewport visibility
const useInViewport = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isInView];
};

// Staggered animation hook
const useStaggerAnimation = (itemCount, delay = 100) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timers = [];
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * delay);
      timers.push(timer);
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [itemCount, delay]);

  return visibleItems;
};

// Smooth scroll animation
const useSmoothScroll = () => {
  return useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);
};

// Card flip animation state
const useCardFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const flip = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(prev => !prev);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  }, [isAnimating]);

  return { isFlipped, isAnimating, flip };
};

// Parallax scroll effect
const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

// Hover animation state
const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
};

// ============================================
// VIRTUALIZATION HOOK
// ============================================

const useVirtualization = (items, containerHeight = 600, itemHeight = 100) => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
    
    return {
      start: Math.max(0, startIndex - 2),
      end: Math.min(items.length, endIndex + 2),
    };
  }, [scrollTop, containerHeight, itemHeight, items.length]);

  const visibleItems = useMemo(() => 
    items.slice(visibleRange.start, visibleRange.end).map((item, idx) => ({
      ...item,
      virtualIndex: visibleRange.start + idx,
    })),
    [items, visibleRange]
  );

  return {
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.start * itemHeight,
  };
};

// ============================================
// MEMOIZED ANIMATED COMPONENTS
// ============================================

const AnimatedBackgroundElement = memo(({ className, icon: Icon, style }) => {
  const [ref, isInView] = useInViewport();
  
  return (
    <div ref={ref}>
      <Icon 
        className={`${className} transition-opacity duration-1000 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
      />
    </div>
  );
});

AnimatedBackgroundElement.displayName = 'AnimatedBackgroundElement';

const BackgroundElements = memo(() => {
  const parallaxOffset = useParallax(0.3);

  return (
    <>
      <div className="absolute inset-0">
        <AnimatedBackgroundElement
          className="absolute top-10 left-10 w-16 h-16 text-orange-400/20 animate-pulse"
          icon={Crown}
          style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
        />
        <AnimatedBackgroundElement
          className="absolute top-20 right-20 w-20 h-20 text-red-400/20 animate-pulse delay-700"
          icon={Shield}
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        />
        <AnimatedBackgroundElement
          className="absolute bottom-20 left-20 w-18 h-18 text-orange-500/20 animate-pulse delay-1000"
          icon={Flame}
          style={{ transform: `translateY(${parallaxOffset * 0.4}px)` }}
        />
        <AnimatedBackgroundElement
          className="absolute bottom-10 right-10 w-14 h-14 text-red-400/20 animate-pulse delay-500"
          icon={Crown}
          style={{ transform: `translateY(${parallaxOffset * 0.6}px)` }}
        />
      </div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-orange-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </>
  );
});

BackgroundElements.displayName = 'BackgroundElements';

const SearchScreen = memo(({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onKeyPress,
  isLoaded 
}) => {
  const [titleRef, titleInView] = useInViewport();
  const [inputRef, inputInView] = useInViewport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundElements />

      <div
        className={`bg-gradient-to-b from-orange-900/40 to-red-900/40 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-500/30 p-8 w-full max-w-md transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        <div ref={titleRef} className={`text-center mb-8 transition-all duration-700 ${
          titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center transform rotate-3 shadow-lg relative animate-bounce-slow">
            <Crown className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Flame className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2 animate-fade-in">
            IRON THRONE
          </h1>
          <p className="text-orange-300/70 text-sm font-medium tracking-wide">
            ELITE GYM DOMINION
          </p>
          <p className="text-orange-400/60 text-xs mt-2">
            MEMBERS ONLY ACCESS
          </p>
        </div>

        <div ref={inputRef} className={`space-y-6 transition-all duration-700 delay-300 ${
          inputInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              onKeyPress={onKeyPress}
              placeholder="Enter member phone or name..."
              className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-orange-500/30 rounded-xl text-orange-100 placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 focus:scale-[1.02]"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400/50" />
          </div>

          <button
            onClick={onSearch}
            disabled={!searchQuery.trim()}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 uppercase tracking-wider"
          >
            CLAIM THE THRONE
          </button>
        </div>

        <div className="text-center mt-6 opacity-70 animate-pulse">
          <p className="text-orange-400/60 text-xs">
            FORGED IN IRON • BUILT FOR LEGENDS
          </p>
        </div>
      </div>
    </div>
  );
});

SearchScreen.displayName = 'SearchScreen';

const CardFront = memo(({ memberData }) => {
  const [cardRef, cardInView] = useInViewport();

  return (
    <div ref={cardRef} className="absolute inset-0 w-full h-full backface-hidden">
      <div className={`w-full h-full bg-gradient-to-br from-orange-800 via-red-800 to-slate-800 rounded-2xl shadow-2xl border border-orange-500/30 p-6 relative overflow-hidden transition-all duration-700 ${
        cardInView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <Crown className="absolute top-4 right-4 w-24 h-24 text-orange-400 animate-pulse" />
          <Flame className="absolute bottom-4 left-4 w-20 h-20 text-red-400 animate-pulse delay-500" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-orange-300 text-sm font-bold tracking-wide">
                IRON THRONE
              </h3>
              <p className="text-orange-400/80 text-xs">ELITE MEMBER</p>
            </div>
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-400/30 animate-fade-in">
              <Crown className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-bold">
                {memberData.planDuration.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-white text-2xl font-bold">{memberData.name}</h2>
            <p className="text-orange-300/80 text-sm">Phone: {memberData.phoneNo}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-orange-300/70 text-sm">
                <Award className="w-4 h-4" />
                <span>₹{memberData.feesAmount.toLocaleString()}</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  memberData.paymentStatus === "Paid"
                    ? "bg-green-500/20 text-green-300 border border-green-400/30"
                    : "bg-red-500/20 text-red-300 border border-red-400/30"
                }`}
              >
                {memberData.paymentStatus.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/5 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></div>
      </div>
    </div>
  );
});

CardFront.displayName = 'CardFront';

const CardBack = memo(({ memberData, formatDate }) => (
  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
    <div className="w-full h-full bg-gradient-to-br from-red-800 via-orange-800 to-slate-800 rounded-2xl shadow-2xl border border-red-500/30 p-6 relative overflow-hidden">
      <div className="relative z-10 h-full">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-orange-400/30 transform transition-transform duration-300 hover:scale-110">
            <img
              src={memberData.avatar}
              alt="Member Avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="text-white text-lg font-bold">{memberData.name}</h3>
          <p className="text-orange-300/70 text-sm">
            {memberData.age} years • {memberData.gender}
          </p>
        </div>

        <div className="space-y-2 text-orange-200/80 text-sm">
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="truncate">{memberData.email}</span>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="truncate">{memberData.address}</span>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Joined: {formatDate(memberData.joiningDate)}</span>
          </div>
          <div className="flex items-center space-x-3 transition-transform duration-200 hover:translate-x-1">
            <Calendar className="w-4 h-4 text-red-400" />
            <span>Due: {formatDate(memberData.nextDueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

CardBack.displayName = 'CardBack';

const StatCard = memo(({ stat, index, isVisible }) => {
  const [hoverRef, isHovered] = useHoverAnimation();

  return (
    <div
      ref={hoverRef}
      className={`bg-gradient-to-br ${stat.bg} backdrop-blur-md rounded-2xl p-6 border border-orange-500/20 transform transition-all duration-500 hover:shadow-xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${isHovered ? 'scale-110 -rotate-1' : 'scale-100'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 transform transition-transform duration-300 ${
          isHovered ? 'rotate-12 scale-110' : 'rotate-3'
        }`}
      >
        <stat.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-orange-300/80 text-sm font-medium mb-2">
        {stat.label}
      </h3>
      <p className="text-white text-xl font-bold">{stat.value}</p>
    </div>
  );
});

StatCard.displayName = 'StatCard';

const PaymentAlert = memo(({ daysUntilDue }) => {
  const [alertRef, alertInView] = useInViewport();

  if (daysUntilDue > 7) return null;

  return (
    <div ref={alertRef} className={`mt-8 max-w-2xl mx-auto transition-all duration-700 ${
      alertInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div
        className={`p-4 rounded-xl border ${
          daysUntilDue <= 0
            ? "bg-red-900/30 border-red-500/30 text-red-200"
            : "bg-yellow-900/30 border-yellow-500/30 text-yellow-200"
        } backdrop-blur-md animate-fade-in`}
      >
        <div className="flex items-center space-x-3">
          <Flame
            className={`w-5 h-5 ${
              daysUntilDue <= 0 ? "text-red-400 animate-pulse" : "text-yellow-400 animate-pulse"
            }`}
          />
          <span className="font-medium">
            {daysUntilDue <= 0
              ? "Payment Overdue! Throne privileges suspended."
              : `Payment due in ${daysUntilDue} days. Secure your throne!`}
          </span>
        </div>
      </div>
    </div>
  );
});

PaymentAlert.displayName = 'PaymentAlert';

// ============================================
// MAIN COMPONENT
// ============================================

const MemberCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { isFlipped, isAnimating, flip } = useCardFlip();
  const navigate = useNavigate();
  const location = useLocation();
  const visibleStats = useStaggerAnimation(3, 150);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const memberData = useMemo(() => ({
    name: "Alexandra Johnson",
    phoneNo: "+1 (555) 123-4567",
    age: 28,
    gender: "Female",
    email: "alexandra.johnson@email.com",
    joiningDate: new Date("2022-03-15"),
    planDuration: "6 month",
    feesAmount: 15000,
    nextDueDate: new Date("2025-09-15"),
    paymentStatus: "Paid",
    lastPaidOn: new Date("2025-03-15"),
    address: "123 Fitness Street, New York, NY 10001",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
  }), []);

  const daysUntilDue = useMemo(() => {
    const today = new Date();
    const dueDate = new Date(memberData.nextDueDate);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [memberData.nextDueDate]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setShowCard(true);
    }
  }, [searchQuery]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  const handleBackToSearch = useCallback(() => {
    setShowCard(false);
  }, []);

  const statCards = useMemo(() => [
    {
      label: "Plan Amount",
      value: `₹${memberData.feesAmount.toLocaleString()}`,
      icon: Award,
      color: "from-orange-500 to-red-500",
      bg: "from-orange-900/30 to-red-900/30",
    },
    {
      label: "Days Until Due",
      value: daysUntilDue > 0 ? `${daysUntilDue} days` : "Overdue",
      icon: Calendar,
      color:
        daysUntilDue > 7
          ? "from-green-500 to-emerald-500"
          : daysUntilDue > 0
          ? "from-yellow-500 to-orange-500"
          : "from-red-500 to-red-600",
      bg:
        daysUntilDue > 7
          ? "from-green-900/30 to-emerald-900/30"
          : daysUntilDue > 0
          ? "from-yellow-900/30 to-orange-900/30"
          : "from-red-900/30 to-red-900/30",
    },
    {
      label: "Last Payment",
      value: formatDate(memberData.lastPaidOn).split(",")[0],
      icon: Star,
      color: "from-purple-500 to-pink-500",
      bg: "from-purple-900/30 to-pink-900/30",
    },
  ], [memberData, daysUntilDue, formatDate]);

  if (!showCard) {
    return (
      <SearchScreen
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        isLoaded={isLoaded}
      />
    );
  }

  const openProfileModal = useCallback(() => {
    navigate("/my-profile", { state: { background: location } });
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 p-4 relative overflow-hidden">
      <BackgroundElements />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <button
            onClick={handleBackToSearch}
            className="flex items-center space-x-2 text-orange-300/70 hover:text-orange-300 transition-all duration-300 hover:translate-x-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
          <div className="flex space-x-3">
            <button
              onClick={openProfileModal}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl border border-orange-500/20 hover:from-orange-500 hover:to-red-500 transition-all duration-300 hover:scale-105"
            >
              View Profile
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="perspective-1000">
            <div
              className={`relative w-96 h-72 transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              } ${isAnimating ? 'pointer-events-none' : ''}`}
              onClick={flip}
            >
              <CardFront memberData={memberData} />
              <CardBack memberData={memberData} formatDate={formatDate} />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-orange-400/60 text-sm animate-pulse">
            Click the throne card to reveal member secrets
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {statCards.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              index={index}
              isVisible={visibleStats.includes(index)}
            />
          ))}
        </div>

        <PaymentAlert daysUntilDue={daysUntilDue} />
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(3deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(MemberCard);