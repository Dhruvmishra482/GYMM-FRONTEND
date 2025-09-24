// src/components/Hero/HeroMain.jsx
import React, { useState } from "react";
import Navigation from "./Navigation";
import Home from "./Home";
import MainFeatures from "./MainFeatures";
import CTA from "./CTA";
import PricingPage from "./PricePage";
import ContactUs from "../../../Basic/Features/ContactUs/ContactUs";
import AuthModal from "../../../Auth/Ui/AuthModel";
import Stats from "./Stats";


const HeroMain = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  const handleOpenAuthModal = (tab = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen text-white bg-black">
      <Navigation onOpenAuthModal={handleOpenAuthModal} />

      {/* Home Section */}
      <div data-section="home">
        <Home onOpenAuthModal={handleOpenAuthModal} />
        {/* <Stats /> */}
      </div>

      {/* Features Section */}
      <div data-section="features">
        <MainFeatures />
      </div>

      {/* Pricing Section */}
      <div data-section="pricing">
        <PricingPage />
      </div>

      {/* Contact Section */}
      <div data-section="contact">
        <ContactUs />
      </div>

      <CTA onOpenAuthModal={handleOpenAuthModal} />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default HeroMain;