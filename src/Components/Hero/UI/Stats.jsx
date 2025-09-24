import React, { useEffect, useState, useRef } from "react";
import { Dumbbell, Users, Shield, Target } from "lucide-react";

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const stats = [
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
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={statsRef}
      className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-800 relative overflow-hidden"
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-24 h-24 rounded-full blur-xl animate-pulse bg-gradient-to-r from-orange-500/10 to-purple-500/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`text-center group transform transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              } hover:scale-110`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="relative mb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br ${s.color} shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div
                className={`text-4xl font-black mb-2 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
              >
                {s.number}
              </div>
              <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;
