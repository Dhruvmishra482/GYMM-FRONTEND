import React, { useState, useRef } from 'react';
import { Crown, Upload, X, Camera, Dumbbell, Sparkles, CheckCircle } from 'lucide-react';

const GymOnboardingModal = ({ isOpen, onComplete, ownerName }) => {
  const [step, setStep] = useState(1);
  const [gymName, setGymName] = useState('');
  const [gymLogo, setGymLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  if (!isOpen) return null;

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setGymLogo(base64String);
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && gymName.trim().length < 3) {
      alert('Please enter a gym name with at least 3 characters');
      return;
    }
    setStep(2);
  };

  const handleComplete = async () => {
    if (!gymName.trim()) {
      alert('Please enter your gym name');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🚀 Starting gym onboarding...', { gymName, hasLogo: !!gymLogo });
      
      // Call the actual onComplete function passed from parent
      await onComplete({ gymName: gymName.trim(), gymLogo });
      
      // Show success animation briefly
      setIsCompleted(true);
      
      // Close modal after brief success display
      setTimeout(() => {
        setIsCompleted(false);
        // Modal will be closed by parent component
      }, 1500);
      
    } catch (error) {
      console.error('❌ Onboarding error:', error);
      alert(error.message || 'Failed to complete setup. Please try again.');
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center min-h-screen py-24 pb-20 overflow-hidden bg-black"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute delay-1000 rounded-full top-40 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute w-64 h-64 rounded-full bottom-40 right-10 bg-gradient-to-br from-orange-500/15 to-yellow-500/15 blur-3xl animate-pulse delay-3000"></div>
          <div className="absolute w-48 h-48 rounded-full top-1/3 left-1/2 bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl animate-pulse delay-4000"></div>
        </div>
        
        <div className="relative w-full max-w-sm p-6 mx-4 text-center bg-white shadow-2xl sm:max-w-md sm:p-8 rounded-3xl">
          <div className="relative mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 sm:w-20 sm:h-20 animate-bounce" />
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full sm:w-20 sm:h-20 bg-green-400/20 animate-ping"></div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">Setup Complete!</h2>
          <p className="mb-4 text-sm text-gray-600 sm:text-base">Welcome to your {gymName} gym management dashboard!</p>
          <div className="text-sm font-medium text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text animate-pulse sm:text-base">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen py-24 pb-20 overflow-hidden bg-black"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full top-40 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute w-64 h-64 rounded-full bottom-40 right-10 bg-gradient-to-br from-orange-500/15 to-yellow-500/15 blur-3xl animate-pulse delay-3000"></div>
        <div className="absolute w-48 h-48 rounded-full top-1/3 left-1/2 bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl animate-pulse delay-4000"></div>
      </div>

      <div className="relative w-full max-w-sm mx-4 overflow-hidden bg-white shadow-2xl sm:max-w-md lg:max-w-lg rounded-2xl sm:rounded-3xl">
        
        {/* Header */}
        <div className="relative p-4 text-white bg-white sm:p-6">
          <div className="flex items-center gap-2 mb-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
              <Crown className="w-4 h-4 text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-transparent sm:text-xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text">IRON THRONE</h1>
              <p className="text-xs text-gray-600 sm:text-sm">Gym Management Setup</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 sm:text-sm">Hi {ownerName}! Let's set up your gym</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-4 bg-white sm:p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 sm:w-16 sm:h-16 sm:mb-4 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 rounded-2xl">
                  <Dumbbell className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">What's your gym name?</h2>
                <p className="text-sm text-gray-600 sm:text-base">This will appear throughout your dashboard</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Enter your gym name..."
                  className="w-full px-3 py-3 text-base font-medium text-center transition-all bg-white border-2 border-gray-200 sm:px-4 sm:py-4 sm:text-lg rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  autoFocus
                />
                
                {gymName && (
                  <div className="p-3 border border-pink-200 sm:p-4 rounded-xl bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50">
                    <p className="mb-2 text-xs font-medium text-gray-600 sm:text-sm">Preview:</p>
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <Crown className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{gymName}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={!gymName.trim() || gymName.trim().length < 3}
                className="flex items-center justify-center w-full gap-2 py-3 sm:py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <span className="text-sm sm:text-base">Continue</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 sm:w-16 sm:h-16 sm:mb-4 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 rounded-2xl">
                  <Camera className="w-6 h-6 text-white sm:w-8 sm:h-8" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">Upload your gym logo</h2>
                <p className="text-sm text-gray-600 sm:text-base">Make your gym stand out with a custom logo (optional)</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Smaller Logo Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-center transition-all bg-white border-2 border-gray-300 border-dashed cursor-pointer sm:p-6 rounded-xl hover:border-pink-400 hover:bg-gradient-to-br hover:from-orange-50 hover:via-pink-50 hover:to-purple-50"
                >
                  {logoPreview ? (
                    <div className="space-y-2 sm:space-y-3">
                      <img 
                        src={logoPreview} 
                        alt="Gym Logo Preview" 
                        className="object-cover w-16 h-16 mx-auto border-4 border-white shadow-lg sm:w-20 sm:h-20 rounded-xl"
                      />
                      <p className="text-xs text-gray-600 sm:text-sm">Click to change logo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 sm:w-10 sm:h-10" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Click to upload logo</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {/* Preview with gym name */}
                <div className="p-3 border border-gray-200 sm:p-4 rounded-xl bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50">
                  <p className="mb-2 text-xs font-medium text-gray-600 sm:mb-3 sm:text-sm">Dashboard Preview:</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="object-cover w-8 h-8 border-2 border-pink-200 rounded-lg sm:w-10 sm:h-10"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500">
                        <Crown className="w-4 h-4 text-white sm:w-5 sm:h-5" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-800 sm:text-base">{gymName}</div>
                      <div className="text-xs text-gray-600 sm:text-sm">Gym Management</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-gray-700 transition-all bg-gray-100 hover:bg-gray-200 rounded-xl text-sm sm:text-base hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 font-semibold text-white transition-all duration-300 flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 rounded-full sm:w-5 sm:h-5 border-white/30 border-t-white animate-spin"></div>
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymOnboardingModal;