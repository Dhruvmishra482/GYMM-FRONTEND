// src/components/Hero/Navigation.jsx - Fully Responsive Version
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Rocket, Menu, X, User, LogIn } from "lucide-react";
import imagelogo from "../images/Untitled_design-removebg-preview.png"

const Navigation = memo(({ onOpenAuthModal }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMainPage, setIsMainPage] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  // Memoized navigation items
  const navItems = useMemo(() => [
    { name: "Home", id: "home" },
    { name: "Features", id: "features" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ], []);

  // Memoized sections array for scroll detection
  const sections = useMemo(() => [
    { id: "home", selector: '[data-section="home"]' },
    { id: "features", selector: '[data-section="features"]' },
    { id: "pricing", selector: '[data-section="pricing"]' },
    { id: "contact", selector: '[data-section="contact"]' },
  ], []);

  // Memoized callbacks
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
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
  const scrollToSection = useCallback((sectionId) => {
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
  }, [isMainPage]);

  // Function to check if a nav item is active
  const isActive = useCallback((item) => {
    if (!isMainPage) return false; // No highlighting on other pages
    const itemId = item.toLowerCase();
    return activeSection === itemId;
  }, [isMainPage, activeSection]);

  // Memoized mouse glow style
  const mouseGlowStyle = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,165,0,0.08) 0%, transparent 50%)`,
  }), [mousePos.x, mousePos.y]);

  // Memoized header className - Responsive
  const headerClassName = useMemo(() => 
    `fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-14 sm:h-16 ${
      isAuthPage 
        ? "bg-black" 
        : isScrolled 
          ? "bg-black/20 backdrop-blur-md border-b border-white/10" 
          : "bg-black/10 backdrop-blur-sm"
    }`
  , [isAuthPage, isScrolled]);

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
      const sectionsData = sections.map(section => ({
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

      <div className="px-3 sm:px-4 md:px-6 pt-1 sm:pt-2 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-12 sm:h-14">
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

          {/* Mobile Menu Button - Responsive */}
          <button
            onClick={toggleMobileMenu}
            className="p-1.5 sm:p-2 text-gray-300 transition-colors duration-200 md:hidden hover:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Responsive */}
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

        {/* Mobile Menu Panel - Responsive width */}
        <div
          className={`absolute top-12 sm:top-14 right-0 w-64 sm:w-72 bg-black/30 backdrop-blur-xl border-l border-white/20 h-screen transform transition-transform duration-200 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Mobile Navigation Links - Responsive text */}
            <nav className="space-y-1.5 sm:space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm sm:text-base font-medium py-2 sm:py-2.5 px-3 rounded transition-colors duration-200 ${
                    isActive(item.name)
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Mobile Auth Buttons - Responsive */}
            <div className="pt-3 sm:pt-4 space-y-2 border-t border-gray-700/50">
              <button
                onClick={handleLoginClick}
                className="block w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-center text-gray-400 transition-colors duration-200 rounded hover:text-orange-300 hover:bg-gray-800/30"
              >
                Login
              </button>

              <button
                onClick={handleSignupClick}
                className="block w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-center text-white transition-colors duration-200 bg-orange-500 rounded hover:bg-orange-600"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

// Display name for debugging
Navigation.displayName = 'Navigation';

export default Navigation;