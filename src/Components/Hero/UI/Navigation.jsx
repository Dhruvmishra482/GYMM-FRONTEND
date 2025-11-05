// src/components/Hero/Navigation.jsx - Fully Responsive Version with Improved Mobile Menu
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Rocket, Menu, X, User, LogIn } from "lucide-react";
import imagelogo from "../images/Untitled_design-removebg-preview.png";

const Navigation = memo(({ onOpenAuthModal }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMainPage, setIsMainPage] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  // Memoized navigation items
  const navItems = useMemo(
    () => [
      { name: "Home", id: "home" },
      { name: "Features", id: "features" },
      { name: "Pricing", id: "pricing" },
      { name: "Contact", id: "contact" },
    ],
    []
  );

  // Memoized sections array for scroll detection
  const sections = useMemo(
    () => [
      { id: "home", selector: '[data-section="home"]' },
      { id: "features", selector: '[data-section="features"]' },
      { id: "pricing", selector: '[data-section="pricing"]' },
      { id: "contact", selector: '[data-section="contact"]' },
    ],
    []
  );

  // Memoized callbacks
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLoginClick = useCallback(() => {
    if (onOpenAuthModal) {
      onOpenAuthModal("login");
    }
    setIsMobileMenuOpen(false);
  }, [onOpenAuthModal]);

  const handleSignupClick = useCallback(() => {
    if (onOpenAuthModal) {
      onOpenAuthModal("signup");
    }
    setIsMobileMenuOpen(false);
  }, [onOpenAuthModal]);

  // Enhanced smooth scrolling function OR navigate to main page
  const scrollToSection = useCallback(
    (sectionId) => {
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
    },
    [isMainPage]
  );

  // Function to check if a nav item is active
  const isActive = useCallback(
    (item) => {
      if (!isMainPage) return false; // No highlighting on other pages
      const itemId = item.toLowerCase();
      return activeSection === itemId;
    },
    [isMainPage, activeSection]
  );

  // Memoized mouse glow style
  const mouseGlowStyle = useMemo(
    () => ({
      background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,165,0,0.08) 0%, transparent 50%)`,
    }),
    [mousePos.x, mousePos.y]
  );

  // Memoized header className - Responsive
  const headerClassName = useMemo(
    () =>
      `fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-14 sm:h-16 ${
        isAuthPage
          ? "bg-black"
          : isScrolled
          ? "bg-black/20 backdrop-blur-md border-b border-white/10"
          : "bg-black/10 backdrop-blur-sm"
      }`,
    [isAuthPage, isScrolled]
  );

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/login" || currentPath === "/signup") {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Enhanced scroll detection for header background
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
  }, [scrollToSection]);

  // Scroll detection to highlight active section (only on main page)
  useEffect(() => {
    if (!isMainPage) return; // Don't run scroll detection on other pages

    const handleSectionScroll = () => {
      const sectionsData = sections.map((section) => ({
        ...section,
        element: document.querySelector(section.selector),
      }));

      const scrollPosition = window.scrollY + 100; // Offset for better UX

      for (let i = sectionsData.length - 1; i >= 0; i--) {
        const section = sectionsData[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleSectionScroll);
    handleSectionScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleSectionScroll);
  }, [isMainPage, sections]);

  return (
    <header className={headerClassName}>
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={mouseGlowStyle}
      />

      <div className="pt-1 sm:pt-2">
        <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 md:px-6">
          {/* Logo Section - Responsive */}
          <button
            onClick={() =>
              isMainPage
                ? scrollToSection("home")
                : (window.location.href = "/home")
            }
            className="flex items-center space-x-1 sm:space-x-2 group"
          >
            <img
              src={imagelogo}
              alt="FitTracker Logo"
              className="w-auto h-14 sm:h-16 md:h-18 lg:h-20"
            />

            <span className="hidden sm:block text-base md:text-lg lg:text-xl font-bold text-white">
              FitTracker
            </span>
          </button>

          {/* Desktop Navigation - Responsive spacing */}
          <nav className="items-center hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`text-base lg:text-lg xl:text-xl font-medium transition-colors duration-200 ${
                  isActive(item.name)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons - Responsive */}
          <div className="items-center hidden md:flex space-x-2 lg:space-x-3">
            <button
              onClick={handleLoginClick}
              className="text-base lg:text-lg xl:text-xl font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 lg:px-3 py-1 lg:py-1.5"
            >
              Login
            </button>

            <button
              onClick={handleSignupClick}
              className="bg-white/90 backdrop-blur-sm text-black text-base lg:text-lg xl:text-xl font-medium px-3 lg:px-4 py-1 lg:py-1.5 rounded-full hover:bg-white transition-all duration-200"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button - Enhanced with Animation */}
          <button
            onClick={toggleMobileMenu}
            className="relative p-2 text-gray-300 transition-all duration-300 md:hidden hover:text-white hover:bg-white/10 rounded-lg group"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 animate-in spin-in-180 duration-300" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 animate-in fade-in duration-300" />
              )}
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-lg bg-orange-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Premium Design */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Animated Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-orange-900/30 backdrop-blur-md"
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Panel - Premium Glassmorphism */}
        <div
          className={`absolute top-12 sm:top-14 right-0 w-72 sm:w-80 max-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-2xl border-l-2 border-t-2 border-orange-500/30 rounded-bl-3xl shadow-2xl transform transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? "translate-x-0 scale-100"
              : "translate-x-full scale-95"
          }`}
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(251, 146, 60, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Decorative gradient line at top */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>

          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-6rem)]">
            {/* Mobile Navigation Links - Enhanced */}
            <nav className="space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative block w-full text-left text-sm sm:text-base font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.name)
                      ? "text-white bg-gradient-to-r from-orange-500/30 to-orange-600/20 border-l-4 border-orange-500 shadow-lg shadow-orange-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10 hover:border-l-4 hover:border-orange-400/50"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {isActive(item.name) && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </nav>

            {/* Divider with gradient */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs font-medium text-orange-400/60 bg-black/50 rounded-full">
                  Account
                </span>
              </div>
            </div>

            {/* Mobile Auth Buttons - Premium Styling */}
            <div className="space-y-3">
              <button
                onClick={handleLoginClick}
                className="group relative block w-full px-5 py-3.5 text-sm sm:text-base font-semibold text-center text-gray-200 transition-all duration-300 rounded-xl border-2 border-white/20 hover:border-orange-400/50 hover:text-white overflow-hidden transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </div>
              </button>

              <button
                onClick={handleSignupClick}
                className="group relative block w-full px-5 py-3.5 text-sm sm:text-base font-bold text-center text-white transition-all duration-300 rounded-xl overflow-hidden transform hover:scale-105 shadow-lg hover:shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  boxShadow:
                    "0 10px 25px -5px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span>Sign up</span>
                </div>
              </button>
            </div>

            {/* Decorative footer text */}
            <div className="pt-4 text-center">
              <p className="text-xs text-gray-500">
                Join{" "}
                <span className="text-orange-400 font-semibold">
                  FitTracker
                </span>{" "}
                today
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

// Display name for debugging
Navigation.displayName = "Navigation";

export default Navigation;
