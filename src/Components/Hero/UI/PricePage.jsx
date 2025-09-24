import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Rocket,
  Users,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedPlans, setExpandedPlans] = useState({});

  // Billing options configuration
  const billingOptions = [
    { key: "monthly", label: "Monthly", suffix: "/mo", popular: false },
    { key: "quarterly", label: "3 Months", suffix: "/3mo", popular: false },
    { key: "half-yearly", label: "6 Months", suffix: "/6mo", popular: true },
    { key: "yearly", label: "1 Year", suffix: "/yr", popular: false }
  ];

  // Toggle expanded features for a specific plan
  const togglePlanExpansion = (planIndex) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planIndex]: !prev[planIndex]
    }));
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated number counter
  const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const start = Date.now();
      const end = start + duration;

      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        setCount(Math.floor(progress * value));

        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, duration]);

    return count;
  };

  // Pricing configuration based on billing period
  const pricingConfig = {
    Basic: {
      monthly: { price: 399, savings: 0 },
      quarterly: { price: 1097, savings: 100 },
      "half-yearly": { price: 2095, savings: 299 },
      yearly: { price: 3990, savings: 798 }
    },
    Advanced: {
      monthly: { price: 699, savings: 0 },
      quarterly: { price: 1897, savings: 200 },
      "half-yearly": { price: 3595, savings: 599 },
      yearly: { price: 6990, savings: 1398 }
    },
    Enterprise: {
      monthly: { price: 999, savings: 0 },
      quarterly: { price: 2697, savings: 300 },
      "half-yearly": { price: 5095, savings: 899 },
      yearly: { price: 9990, savings: 1998 }
    }
  };

  const plans = [
    {
      name: "Basic",
      tagline: "Start Your Gym Journey",
      description:
        "Perfect for small gyms and personal trainers who want to digitize and automate their operations.",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-cyan-400 via-blue-500 to-purple-600",
      glowColor: "cyan",
      features: [
        { name: "Up to 150 members", included: true, highlight: false },
        { name: "Member dashboard with profiles & photos", included: true, highlight: false },
        { name: "Add & search active members", included: true, highlight: false },
        { name: "Due notifications to owner", included: true, highlight: true },
        { name: "Basic fee tracking & payment status", included: true, highlight: false },
        { name: "Member contact details & emergency info", included: true, highlight: false },
        { name: "Basic analytics reports", included: true, highlight: false },
        { name: "Data backup & security", included: true, highlight: false },
        { name: "24/7 chat & email support", included: true, highlight: false },
      ],
      popular: false,
      buttonText: "Start Your Journey",
    },
    {
      name: "Advanced",
      tagline: "Scale Your Fitness Business",
      description:
        "For growing gyms that want automation, smart reminders, and advanced reporting.",
      icon: <Crown className="w-8 h-8" />,
      color: "from-orange-400 via-red-500 to-pink-600",
      glowColor: "orange",
      features: [
        { name: "Up to 400 members", included: true, highlight: false },
        { name: "Powered by every feature of the Basic Plan, and more", included: true, highlight: true },
        { name: "Automated WhatsApp notifications", included: true, highlight: true },
        { name: "Predictive fee tracking & insights", included: true, highlight: true },
        { name: "Inactive member alerts (track who hasn't visited)", included: true, highlight: true },
        { name: "Advanced analytics (growth + revenue trends)", included: true, highlight: true },
        { name: "AI Diet Plan based on progress & attendance", included: true, highlight: true },
        { name: "Basic AI workout recommendations", included: true, highlight: true },
        { name: "Bulk WhatsApp messaging for announcements", included: true, highlight: true },
        { name: "Equipment maintenance reminders", included: true, highlight: false },
        { name: "Expense tracking (basic)", included: true, highlight: false },
        { name: "Priority phone + chat support", included: true, highlight: false },
        { name: "24/7 chat & email support", included: true, highlight: false },
      ],
      popular: false,
      buttonText: "Unleash Your Potential",
    },
    {
      name: "Enterprise",
      tagline: "For fitness empires that want AI + automation at the highest level",
      description:
        "Everything in Advanced Plan plus the most powerful tools to run multiple gyms, maximize member engagement, and boost revenue.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-purple-400 via-pink-500 to-red-500",
      glowColor: "purple",
      features: [
        { name: "Unlimited members (no cap)", included: true, highlight: true },
        { name: "Powered by every feature of the Advanced Plan, and more", included: true, highlight: true },
        { name: "Manage multiple branches/locations from one dashboard", included: true, highlight: true },
        { name: "Automated daily WhatsApp reports (joins, renewals, dues, inactive)", included: true, highlight: true },
        { name: "Smart WhatsApp fee reminders (3 days before + due date with QR)", included: true, highlight: true },
        { name: "AI-powered crowd prediction & time-slot optimization", included: true, highlight: true },
        { name: "Member birthday & anniversary notifications", included: true, highlight: false },
        { name: "Advanced AI workout plans with progress tracking", included: true, highlight: true },
        { name: "Personalized nutrition tracking with meal suggestions", included: true, highlight: true },
        { name: "Full inactive/old member history with re-activation campaigns", included: true, highlight: true },
        { name: "Advanced expense & profit tracking", included: true, highlight: true },
        { name: "Automated class scheduling & booking system", included: true, highlight: true },
        { name: "Advanced security & compliance features", included: true, highlight: true },
        { name: "Dedicated success manager (priority WhatsApp + phone support)", included: true, highlight: true },
        { name: "Early access to new premium features", included: true, highlight: true },
        { name: "24/7 chat & email support", included: true, highlight: false },
      ],
      popular: true,
      buttonText: "Claim Your Throne",
    },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "AI-Powered Member Experience",
      description:
        "Automatically generate personalized diet and workout plans, updated as members progress – boosting satisfaction and results.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Growth & Retention",
      description:
        "Predict churn, re-engage inactive members with WhatsApp reminders, and increase member retention rates by up to 40%.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Automated WhatsApp Engagement",
      description:
        "Send fee reminders, direct QR payment links, daily progress updates, and re-activation campaigns – all through WhatsApp automation.",
    },
  ];

  return (
    <div className="relative min-h-screen py-6 overflow-hidden bg-black">
      <style jsx>{`
        .enhanced-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 146, 60, 0.6) transparent;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin: 4px 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, 
            rgba(251, 146, 60, 0.8) 0%,
            rgba(249, 115, 22, 0.9) 50%,
            rgba(236, 72, 153, 0.8) 100%
          );
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, 
            rgba(251, 146, 60, 1) 0%,
            rgba(249, 115, 22, 1) 50%,
            rgba(236, 72, 153, 1) 100%
          );
          transform: scaleY(1.1);
          box-shadow: 
            0 4px 8px rgba(249, 115, 22, 0.3),
            0 0 12px rgba(236, 72, 153, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, 
            rgba(234, 88, 12, 1) 0%,
            rgba(220, 38, 127, 1) 50%,
            rgba(192, 38, 211, 1) 100%
          );
          transform: scaleY(0.95);
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Smooth scroll behavior */
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        
        /* Custom fade effect for scrollable content */
        .scroll-fade-top {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 10%
          );
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          z-index: 10;
        }
        
        .scroll-fade-bottom {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 10%
          );
          pointer-events: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          z-index: 10;
        }
      `}</style>
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1), transparent 40%)`,
          }}
        ></div>
        {/* Floating orbs */}
        <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-3xl animate-pulse"></div>
        <div
          className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/30 to-pink-500/30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute rounded-full top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-500/30 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 text-center">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 mb-8 border rounded-full bg-white/10 backdrop-blur-lg border-white/20">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-medium text-white/90">
                Transform Your Fitness Business in 2025
              </span>
            </div>

            <h1 className="mb-8 font-black leading-tight text-7xl md:text-8xl">
              <span className="text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text">
                Pricing That
              </span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text">
                Powers Growth
              </span>
            </h1>

            <p className="max-w-4xl mx-auto mb-12 text-2xl leading-relaxed text-white/70">
              Revolutionary gym management that grows with your ambition. From
              boutique studios to fitness empires, we've got the perfect plan to
              supercharge your success.
            </p>

            {/* Stats */}
            <div className="grid max-w-4xl gap-8 mx-auto mb-16 md:grid-cols-3">
              <div className="p-6 border bg-white/5 backdrop-blur-lg rounded-2xl border-white/10">
                <div className="mb-2 text-4xl font-bold text-orange-400">
                  <AnimatedNumber value={10} />+
                </div>
                <div className="text-white/70">Gyms Transformed</div>
              </div>
              <div className="p-6 border bg-white/5 backdrop-blur-lg rounded-2xl border-white/10">
                <div className="mb-2 text-4xl font-bold text-cyan-400">
                  $<AnimatedNumber value={10} />
                  K+
                </div>
                <div className="text-white/70">Revenue Generated</div>
              </div>
              <div className="p-6 border bg-white/5 backdrop-blur-lg rounded-2xl border-white/10">
                <div className="mb-2 text-4xl font-bold text-pink-400">
                  <AnimatedNumber value={95} />%
                </div>
                <div className="text-white/70">Retention Rate</div>
              </div>
            </div>

            {/* Enhanced 4-Option Billing Toggle */}
            <div className="flex items-center justify-center mb-16">
              <div className="p-2 border rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
                  {billingOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setBillingPeriod(option.key)}
                      className={`relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        billingPeriod === option.key
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-black shadow-lg transform scale-105"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {option.label}
                      {option.popular && (
                        <span className="absolute -top-2 -right-1 px-2 py-0.5 text-xs font-bold text-black bg-green-400 rounded-full transform -rotate-12">
                          SAVE
                        </span>
                      )}
                      {billingPeriod === option.key && option.key !== "monthly" && (
                        <div className="absolute text-xs font-medium text-green-400 transform -translate-x-1/2 -bottom-6 left-1/2 whitespace-nowrap">
                          {option.key === "quarterly" && "Save 10%"}
                          {option.key === "half-yearly" && "Save 15%"}
                          {option.key === "yearly" && "Save 20%"}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards - Improved with Expandable Features */}
      <section className="relative z-10 pb-20">
        <div className="container px-6 mx-auto">
          <div className="grid gap-8 mx-auto lg:grid-cols-3 max-w-7xl">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  plan.popular ? "lg:scale-105 lg:-translate-y-2" : ""
                } ${hoveredCard === index ? "scale-102" : ""} ${
                  expandedPlans[index] ? "h-auto" : ""
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${plan.color} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                ></div>

                <div
                  className={`relative bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border transition-all duration-500 flex flex-col min-h-full ${
                    plan.popular
                      ? "border-orange-400/50 bg-gradient-to-b from-orange-500/20 via-black/40 to-black/40"
                      : "border-white/20 group-hover:border-white/40"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute transform -translate-x-1/2 -top-4 left-1/2">
                      <div className="flex items-center px-6 py-2 text-sm font-bold text-black rounded-full shadow-xl bg-gradient-to-r from-orange-400 to-pink-500">
                        <Crown className="w-4 h-4 mr-1" />
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}
                    >
                      <div className="text-white scale-75">{plan.icon}</div>
                    </div>

                    <h3 className="mb-1 text-2xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <p className="mb-2 text-lg font-semibold text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
                      {plan.tagline}
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-white/60">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center mb-1">
                        <span className="text-4xl font-black text-transparent bg-gradient-to-r from-white to-white/80 bg-clip-text">
                          ₹{pricingConfig[plan.name][billingPeriod]?.price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-lg text-white/60">
                          {billingOptions.find(opt => opt.key === billingPeriod)?.suffix}
                        </span>
                      </div>
                      {billingPeriod !== "monthly" && pricingConfig[plan.name][billingPeriod]?.savings > 0 && (
                        <div className="text-sm font-semibold text-green-400">
                          Save ₹{pricingConfig[plan.name][billingPeriod].savings.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features List with Expandable Functionality */}
                  <div className="flex-grow mb-6">
                    {/* Always show first 5 features */}
                    <div className="mb-3 space-y-3">
                      {plan.features.slice(0, 5).map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className={`flex items-start text-sm transition-all duration-300 ${
                            feature.highlight
                              ? "bg-gradient-to-r from-orange-400/20 to-transparent rounded-lg p-2 -ml-2"
                              : ""
                          }`}
                        >
                          {feature.included ? (
                            <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                          <span
                            className={`${
                              feature.included ? "text-white" : "text-gray-500"
                            } ${
                              feature.highlight ? "font-semibold" : ""
                            } text-sm leading-relaxed flex-1`}
                          >
                            {feature.name}
                            {feature.highlight && (
                              <Sparkles className="inline w-3 h-3 ml-1 text-orange-400" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    

                    {/* Expandable additional features with enhanced scrollable container */}
                    <div className={`transition-all duration-500 ${
                      expandedPlans[index] ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="relative">
                        {/* Fade gradients for better visual indication */}
                        <div className="scroll-fade-top"></div>
                        <div className="scroll-fade-bottom"></div>
                        
                        {/* Enhanced scrollable container */}
                        <div className="pr-3 space-y-3 overflow-y-auto enhanced-scrollbar smooth-scroll max-h-80">
                          {plan.features.slice(5).map((feature, featureIndex) => (
                            <div
                              key={featureIndex + 5}
                              className={`flex items-start text-sm transition-all duration-300 hover:translate-x-1 ${
                                feature.highlight
                                  ? "bg-gradient-to-r from-orange-400/20 to-transparent rounded-lg p-2 -ml-2"
                                  : ""
                              }`}
                            >
                              {feature.included ? (
                                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-lg shadow-green-400/30">
                                  <Check className="w-3 h-3 text-black" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                  <X className="w-3 h-3 text-gray-400" />
                                </div>
                              )}
                              <span
                                className={`${
                                  feature.included ? "text-white" : "text-gray-500"
                                } ${
                                  feature.highlight ? "font-semibold" : ""
                                } text-sm leading-relaxed flex-1`}
                              >
                                {feature.name}
                                {feature.highlight && (
                                  <Sparkles className="inline w-3 h-3 ml-1 text-orange-400 animate-pulse" />
                                )}
                              </span>
                            </div>
                          ))}
                          
                          {/* Invisible padding element for better scroll experience */}
                          <div className="h-2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    {plan.features.length > 5 && (
                      <button
                        onClick={() => togglePlanExpansion(index)}
                        className="flex items-center justify-center w-full pt-3 mt-4 text-sm text-center text-orange-400 transition-colors duration-300 border-t hover:text-orange-300 group border-white/10"
                      >
                        <span className="mr-2 font-medium">
                          {expandedPlans[index] 
                            ? "Show Less Features" 
                            : `+ ${plan.features.length - 5} More Features`
                          }
                        </span>
                        {expandedPlans[index] ? (
                          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                        )}
                      </button>
                    )}
                  </div>

                  <button
                    className={`group w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden mt-auto ${
                      plan.popular
                        ? "bg-gradient-to-r from-orange-400 to-pink-500 text-black hover:from-orange-500 hover:to-pink-600 shadow-xl shadow-orange-500/30"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container px-6 mx-auto">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-black text-white">
              Why Industry Leaders Choose
              <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
                {" "}
                FitTracker
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-white/70">
              Cutting-edge technology meets intuitive design. Experience the
              future of gym management.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 transition-all duration-500 border cursor-pointer group bg-white/5 backdrop-blur-lg rounded-3xl border-white/10 hover:border-orange-400/50 hover:scale-105"
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 transition-transform duration-300 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl group-hover:scale-110">
                  <div className="text-black">{feature.icon}</div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-white/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;