// src/components/Hero/Navigation.jsx
import React, { useState, useEffect } from "react";
import { Rocket, Menu, X, User, LogIn } from "lucide-react";
import imagelogo from "../images/Untitled_design-removebg-preview.png"


const Navigation = ({ onOpenAuthModal }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMainPage, setIsMainPage] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/login" || currentPath === "/signup") {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enhanced scroll detection for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on the main page or a separate page
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isOnMainPage = currentPath === "/" || currentPath === "/home";
    setIsMainPage(isOnMainPage);

    if (!isOnMainPage) {
      setActiveSection(""); // Clear active section if not on main page
    } else {
      // Check if there's a hash in the URL and scroll to that section
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          scrollToSection(hash);
          setActiveSection(hash);
        }, 100);
      }
    }
  }, []);

  // Scroll detection to highlight active section (only on main page)
  useEffect(() => {
    if (!isMainPage) return; // Don't run scroll detection on other pages

    const handleScroll = () => {
      const sections = [
        {
          id: "home",
          element: document.querySelector('[data-section="home"]'),
        },
        {
          id: "features",
          element: document.querySelector('[data-section="features"]'),
        },
        {
          id: "pricing",
          element: document.querySelector('[data-section="pricing"]'),
        },
        {
          id: "contact",
          element: document.querySelector('[data-section="contact"]'),
        },
      ];

      const scrollPosition = window.scrollY + 100; // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainPage]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Enhanced smooth scrolling function OR navigate to main page
  const scrollToSection = (sectionId) => {
    // If we're not on the main page, navigate to main page with hash
    if (!isMainPage) {
      window.location.href = `/home#${sectionId}`;
      return;
    }

    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      const headerHeight = 56; // Account for fixed header height
      const elementPosition = element.offsetTop - headerHeight;

      // Smooth scroll with enhanced easing
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Update URL hash without triggering page reload
      window.history.replaceState(null, null, `#${sectionId}`);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after click
  };

  // Function to check if a nav item is active
  const isActive = (item) => {
    if (!isMainPage) return false; // No highlighting on other pages
    const itemId = item.toLowerCase();
    return activeSection === itemId;
  };

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Features", id: "features" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ];

  // Handle auth modal opening - FIXED: Now passes correct tab
  const handleLoginClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal("login"); // Pass "login" tab
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignupClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal("signup"); // Pass "signup" tab
    }
    setIsMobileMenuOpen(false);
  };

  return (
   <header 
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16
    ${isAuthPage 
      ? "bg-black" 
      : isScrolled 
        ? "bg-black/20 backdrop-blur-md border-b border-white/10" 
        : "bg-black/10 backdrop-blur-sm"
    }`}
>

      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,165,0,0.08) 0%, transparent 50%)`,
        }}
      />

      <div className="px-4 pt-2 mx-auto max-w-7xl lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo Section - Minimal */}
          <button
            onClick={() =>
              isMainPage
                ? scrollToSection("home")
                : (window.location.href = "/home")
            }
            className="flex items-center space-x-2 group"
          >
             <img src={imagelogo} alt="FitTracker Logo" className="w-auto h-20"/>
            
            <span className="hidden text-xl font-bold text-white sm:block">
              FitTracker
            </span>
          </button>

          {/* Desktop Navigation - Clean */}
          <nav className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`text-xl font-medium transition-colors duration-200 ${
                  isActive(item.name)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons - Minimal */}
          <div className="items-center hidden space-x-3 md:flex">
            <button
              onClick={handleLoginClick}
              className="text-xl font-medium text-gray-300 hover:text-white transition-colors duration-200 px-3 py-1.5"
            >
              Login
            </button>
            
            <button
              onClick={handleSignupClick}
              className="bg-white/90 backdrop-blur-sm text-black text-xl font-medium px-4 py-1.5 rounded-full hover:bg-white transition-all duration-200"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button - Minimal */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 transition-colors duration-200 md:hidden hover:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Clean */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Panel - More transparent */}
        <div
          className={`absolute top-14 right-0 w-64 bg-black/30 backdrop-blur-xl border-l border-white/20 h-screen transform transition-transform duration-200 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm font-medium py-2 px-3 rounded transition-colors duration-200 ${
                    isActive(item.name)
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="pt-4 space-y-2 border-t border-gray-700/50">
              <button
                onClick={handleLoginClick}
                className="block w-full px-3 py-2 text-sm font-medium text-center text-gray-400 transition-colors duration-200 rounded hover:text-orange-300 hover:bg-gray-800/30"
              >
                Login
              </button>

              <button
                onClick={handleSignupClick}
                className="block w-full px-3 py-2 text-sm font-medium text-center text-white transition-colors duration-200 bg-orange-500 rounded hover:bg-orange-600"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;