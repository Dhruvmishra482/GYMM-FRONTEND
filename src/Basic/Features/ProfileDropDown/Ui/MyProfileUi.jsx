import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Calendar,
  Crown,
  Shield,
  Zap,
  Star,
  ArrowLeft,
  Sparkles,
  Award,
  Activity,
  Heart,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Users
} from 'lucide-react';

// ==================== CUSTOM HOOKS ====================

const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

const useBodyScrollLock = (isActive) => {
  useEffect(() => {
    if (!isActive) return;
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isActive]);
};

// ==================== MEMOIZED COMPONENTS ====================

const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
    
    <div className="text-center relative z-10">
      <div className="relative mb-8">
        <div className="animate-spin rounded-full h-20 w-20 md:h-24 md:w-24 border-4 border-transparent border-t-purple-400 border-r-pink-400 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Crown className="h-8 w-8 md:h-10 md:w-10 text-yellow-400 animate-bounce" />
        </div>
      </div>
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 flex items-center gap-2 md:gap-3 justify-center">
          <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-yellow-400 animate-pulse" />
          Iron Throne Gym
        </h2>
        <p className="text-purple-200 text-base md:text-lg">Preparing your royal profile...</p>
        <div className="mt-4 md:mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

const ErrorState = React.memo(({ error, onRefresh }) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-rose-900 to-pink-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="text-center max-w-md mx-auto relative z-10">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
            <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">Profile Load Failed</h2>
          <p className="text-red-200 mb-8 md:mb-10 text-base md:text-lg">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 hover:from-red-600 hover:via-rose-600 hover:to-pink-700 text-white px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl transition-all duration-300 flex items-center gap-2 md:gap-3 mx-auto shadow-2xl hover:shadow-3xl hover:scale-105 font-bold text-base md:text-lg group"
          >
            <RefreshCw className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.error === nextProps.error;
});

ErrorState.displayName = 'ErrorState';

const ProfileHeader = React.memo(() => {
  const isVisible = useFadeIn(0);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className={`backdrop-blur-xl bg-white/80 border-b border-white/30 sticky top-0 z-50 transition-all duration-500 shadow-xl ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleBack}
              className="group p-2 md:p-2.5 text-gray-700 hover:text-purple-600 bg-white/50 hover:bg-purple-100 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-1.5 md:gap-2">
                <Crown className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-yellow-500" />
                My Profile
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 font-medium hidden sm:block">Manage your royal account & settings</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-purple-200">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                <span className="text-xs md:text-sm font-bold text-purple-900">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

const ProfileAvatar = React.memo(() => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-xl md:blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
    <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl ring-2 md:ring-4 ring-white/50">
      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center">
        <User className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 text-purple-600" />
      </div>
    </div>
    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce ring-2 md:ring-4 ring-white">
      <Crown className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
    </div>
    <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg ring-2 md:ring-4 ring-white">
      <CheckCircle className="h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
    </div>
  </div>
));

ProfileAvatar.displayName = 'ProfileAvatar';

const ProfileInfo = React.memo(({ fullName, profile }) => {
  const verificationStatus = useMemo(() => 
    profile?.isVerified ? 'Verified Account' : 'Pending Verification',
    [profile?.isVerified]
  );

  const verificationColor = useMemo(() => 
    profile?.isVerified ? 'text-emerald-600' : 'text-orange-600',
    [profile?.isVerified]
  );

  return (
    <div>
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
          {fullName}
        </h2>
        <div className="flex gap-0.5 md:gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <p className="text-gray-700 font-bold text-base md:text-lg lg:text-xl">Gym Owner</p>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
          <span className="text-purple-900 font-bold text-xs md:text-sm">Premium</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-emerald-200 md:border-2 shadow-sm">
          <Shield className="h-3 w-3 md:h-4 md:w-4 text-emerald-500" />
          <span className={`text-xs md:text-sm ${verificationColor} font-bold`}>
            {verificationStatus}
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-200 md:border-2 shadow-sm">
          <Zap className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
          <span className="text-xs md:text-sm text-purple-600 font-bold">Admin Access</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-orange-200 md:border-2 shadow-sm">
          <Award className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
          <span className="text-xs md:text-sm text-orange-600 font-bold">Elite Member</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.fullName === nextProps.fullName &&
    prevProps.profile?.isVerified === nextProps.profile?.isVerified
  );
});

ProfileInfo.displayName = 'ProfileInfo';

const ActionButtons = React.memo(({ isEditing, onRefresh, onEditClick }) => {
  if (isEditing) return null;

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleEdit = useCallback(() => {
    onEditClick();
  }, [onEditClick]);

  return (
    <div className="flex gap-2 md:gap-3">
      <button
        onClick={handleRefresh}
        className="group p-2 md:p-2.5 text-gray-700 hover:text-purple-600 bg-white/50 hover:bg-purple-100 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
        title="Refresh"
        aria-label="Refresh profile"
      >
        <RefreshCw className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-180 transition-transform duration-500" />
      </button>
      <button
        onClick={handleEdit}
        className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-3 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 hover:scale-105 shadow-lg hover:shadow-xl font-semibold md:font-bold text-xs md:text-sm lg:text-base overflow-hidden group"
        aria-label="Edit profile"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <Edit3 className="h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 relative z-10" />
        <span className="relative z-10">Edit</span>
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.isEditing === nextProps.isEditing;
});

ActionButtons.displayName = 'ActionButtons';

const ProfileCompletion = React.memo(({ profileCompletion }) => {
  const barColorClass = useMemo(() => {
    if (profileCompletion === 100) return 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500';
    if (profileCompletion >= 75) return 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500';
    if (profileCompletion >= 50) return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500';
    return 'bg-gradient-to-r from-red-400 via-rose-500 to-pink-500';
  }, [profileCompletion]);

  const statusMessage = useMemo(() => {
    if (profileCompletion === 100) return 'Perfect! Your profile is complete';
    if (profileCompletion >= 75) return 'Almost there! Just a few more details';
    if (profileCompletion >= 50) return 'Good progress! Keep going';
    return 'Let\'s complete your profile';
  }, [profileCompletion]);

  return (
    <div className="mt-6 md:mt-8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl shadow-lg">
            <Crown className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <span className="text-base md:text-lg font-black text-gray-800 block">Profile Completion</span>
            <span className="text-xs md:text-sm text-gray-600 font-medium">{statusMessage}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg md:shadow-xl">
          <span className="text-lg md:text-xl font-black">{profileCompletion}%</span>
        </div>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-4 md:h-5 overflow-hidden shadow-inner">
          <div 
            className={`h-4 md:h-5 rounded-full transition-all duration-1000 ease-out ${barColorClass} shadow-lg relative overflow-hidden`}
            style={{ width: `${profileCompletion}%` }}
            role="progressbar"
            aria-valuenow={profileCompletion}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.profileCompletion === nextProps.profileCompletion;
});

ProfileCompletion.displayName = 'ProfileCompletion';

const Alert = React.memo(({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  
  const alertConfig = useMemo(() => ({
    bgClass: isSuccess ? 'from-emerald-500 to-green-600' : 'from-red-500 to-pink-600',
    Icon: isSuccess ? CheckCircle : AlertCircle
  }), [isSuccess]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="mb-4 md:mb-6 animate-in slide-in-from-top-4 duration-500">
      <div className={`bg-gradient-to-r ${alertConfig.bgClass} rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl md:shadow-2xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <alertConfig.Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-white font-bold text-sm md:text-lg">{message}</span>
          </div>
          <button 
            onClick={handleClose} 
            className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:rotate-90"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.message === nextProps.message
  );
});

Alert.displayName = 'Alert';

const InputField = React.memo(({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  isEditing,
  displayValue
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  const colorName = useMemo(() => iconColor.split('-')[1], [iconColor]);

  const inputClasses = useMemo(() => {
    if (error) {
      return 'w-full px-4 py-3 md:px-6 md:py-4 border-2 rounded-lg md:rounded-xl focus:ring-4 transition-all duration-300 border-red-500 focus:ring-red-200 bg-red-50 text-gray-900 font-medium md:font-semibold placeholder-red-300 text-sm md:text-base';
    }
    return `w-full px-4 py-3 md:px-6 md:py-4 border-2 rounded-lg md:rounded-xl focus:ring-4 transition-all duration-300 border-gray-200 focus:ring-${colorName}-200 focus:border-${colorName}-500 hover:border-${colorName}-300 bg-white text-gray-900 font-medium md:font-semibold placeholder-gray-400 text-sm md:text-base`;
  }, [error, colorName]);

  const displayClasses = useMemo(() => 
    `flex items-center gap-3 md:gap-4 py-4 px-4 md:py-5 md:px-6 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg md:rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`,
    [gradientFrom, gradientTo]
  );

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="group">
      <label className="flex items-center text-gray-800 font-bold md:font-black mb-2 md:mb-3 text-xs md:text-sm uppercase tracking-wide">
        <div className={`p-1.5 md:p-2 ${iconColor.replace('text', 'bg').replace('500', '100')} rounded-lg mr-2`}>
          <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />
        </div>
        {label} *
      </label>
      {isEditing ? (
        <div className="relative">
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={handleChange}
            className={inputClasses}
            placeholder={placeholder}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
            </button>
          )}
          {error && (
            <div 
              id={`${name}-error`}
              className="mt-2 md:mt-3 flex items-center gap-2 md:gap-3 text-red-600 bg-red-50 p-3 md:p-4 rounded-lg md:rounded-xl animate-in slide-in-from-top-2 duration-300 border-2 border-red-200"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="text-xs md:text-sm font-bold">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={displayClasses}>
          <div className={`p-1.5 md:p-2 ${iconColor.replace('text', 'bg').replace('500', '100')} rounded-lg`}>
            <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />
          </div>
          <span className="text-gray-900 font-semibold md:font-bold flex-1 text-sm md:text-base">{displayValue || 'Not set'}</span>
          <Lock className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.displayValue === nextProps.displayValue &&
    prevProps.name === nextProps.name
  );
});

InputField.displayName = 'InputField';

const EditActions = React.memo(({ onSave, onCancel, isSaving, hasChanges }) => {
  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between pt-6 md:pt-8 border-t-2 border-gray-200 mt-6 md:mt-8 gap-3 md:gap-4">
      <div className="flex gap-3 md:gap-4 w-full md:w-auto">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="flex-1 md:flex-none relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 md:px-10 md:py-5 rounded-lg md:rounded-xl font-bold md:font-black transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 disabled:hover:scale-100 shadow-lg md:shadow-xl hover:shadow-2xl overflow-hidden group disabled:cursor-not-allowed text-sm md:text-lg"
          aria-label={isSaving ? 'Saving...' : 'Save Changes'}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          <Save className={`h-5 w-5 md:h-6 md:w-6 relative z-10 ${isSaving ? 'animate-spin' : ''}`} />
          <span className="relative z-10">{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>

        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="flex-1 md:flex-none border-2 border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed px-6 py-3 md:px-10 md:py-5 rounded-lg md:rounded-xl font-bold md:font-black transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 shadow-md text-sm md:text-lg"
          aria-label="Cancel editing"
        >
          <X className="h-5 w-5 md:h-6 md:w-6" />
          Cancel
        </button>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg animate-in fade-in duration-300">
          <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-xs md:text-sm font-black">Unsaved changes</span>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.hasChanges === nextProps.hasChanges
  );
});

EditActions.displayName = 'EditActions';

const AccountInfo = React.memo(({ profile }) => {
  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return 'Not available';
    return new Date(profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [profile?.createdAt]);

  const accountType = useMemo(() => 
    profile?.accountType || 'Owner',
    [profile?.accountType]
  );

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border-2 border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-300">
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-6 md:p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-white/30 rounded-lg md:rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
            <Shield className="h-5 w-5 md:h-7 md:w-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-black">Account Information</h3>
            <p className="text-white/80 font-medium mt-0.5 md:mt-1 text-sm md:text-base">Your membership details</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label className="flex items-center text-gray-800 font-bold md:font-black mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg mr-2">
                <Crown className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              </div>
              Account Type
            </label>
            <div className="flex items-center gap-3 md:gap-4 py-4 px-4 md:py-5 md:px-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg md:rounded-xl border-2 border-yellow-300 shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg">
                <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
              <span className="text-yellow-900 font-black capitalize text-lg md:text-xl flex-1">{accountType}</span>
              <div className="flex gap-0.5 md:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center text-gray-800 font-bold md:font-black mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide">
              <div className="p-1.5 md:p-2 bg-indigo-100 rounded-lg mr-2">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
              </div>
              Member Since
            </label>
            <div className="flex items-center gap-3 md:gap-4 py-4 px-4 md:py-5 md:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg md:rounded-xl border-2 border-indigo-300 shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-1.5 md:p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
              </div>
              <span className="text-gray-900 font-black text-base md:text-xl">{memberSince}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 md:p-6 rounded-xl md:rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <span className="font-bold text-gray-700 text-sm md:text-base">Membership</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-purple-900">Premium</p>
            <p className="text-xs md:text-sm text-purple-600 font-medium mt-1">Lifetime Access</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 md:p-6 rounded-xl md:rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <span className="font-bold text-gray-700 text-sm md:text-base">Status</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-blue-900">Active</p>
            <p className="text-xs md:text-sm text-blue-600 font-medium mt-1">All Systems Go</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 md:p-6 rounded-xl md:rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <span className="font-bold text-gray-700 text-sm md:text-base">Security</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-green-900">Protected</p>
            <p className="text-xs md:text-sm text-green-600 font-medium mt-1">2FA Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.profile?.createdAt === nextProps.profile?.createdAt &&
    prevProps.profile?.accountType === nextProps.profile?.accountType
  );
});

AccountInfo.displayName = 'AccountInfo';

const QuickActions = React.memo(() => {
  const actions = [
    { icon: Heart, label: 'Favorites', count: '12', color: 'from-red-500 to-pink-600', bgColor: 'from-red-50 to-pink-50' },
    { icon: BarChart3, label: 'Reports', count: '8', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50' },
    { icon: Users, label: 'Members', count: '24', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50' },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border-2 border-white/30 p-6 md:p-8">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg md:rounded-xl shadow-lg">
          <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900">Quick Actions</h3>
          <p className="text-gray-600 font-medium text-sm md:text-base">Access your frequent tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`bg-gradient-to-br ${action.bgColor} p-5 md:p-6 rounded-xl md:rounded-2xl border-2 border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group`}
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${action.color} rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <p className="text-gray-700 font-bold mb-1 text-sm md:text-base">{action.label}</p>
            <p className="text-2xl md:text-3xl font-black text-gray-900">{action.count}</p>
          </button>
        ))}
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

const MyProfileUI = ({
  profile,
  formData,
  errors,
  isLoading,
  isEditing,
  isSaving,
  error,
  success,
  fullName,
  profileCompletion,
  hasChanges,
  onEditClick,
  onCancel,
  onSave,
  onInputChange,
  onRefresh,
  clearError,
  clearSuccess,
}) => {
  useBodyScrollLock(isEditing);

  const handleEditClick = useCallback(() => {
    onEditClick();
  }, [onEditClick]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  const handleInputChange = useCallback((e) => {
    onInputChange(e);
  }, [onInputChange]);

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleClearSuccess = useCallback(() => {
    clearSuccess();
  }, [clearSuccess]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditing && hasChanges) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape' && isEditing && !isSaving) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, hasChanges, isSaving, handleSave, handleCancel]);

  const inputFields = useMemo(() => [
    {
      label: "First Name",
      name: "firstName",
      value: formData.firstName,
      error: errors.firstName,
      placeholder: "Enter your first name",
      icon: User,
      iconColor: "text-blue-500",
      gradientFrom: "from-blue-50",
      gradientTo: "to-indigo-50",
      displayValue: profile?.firstName
    },
    {
      label: "Last Name",
      name: "lastName",
      value: formData.lastName,
      error: errors.lastName,
      placeholder: "Enter your last name",
      icon: User,
      iconColor: "text-purple-500",
      gradientFrom: "from-purple-50",
      gradientTo: "to-pink-50",
      displayValue: profile?.lastName
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "tel",
      value: formData.mobileNumber,
      error: errors.mobileNumber,
      placeholder: "Enter 10-digit mobile number",
      icon: Phone,
      iconColor: "text-green-500",
      gradientFrom: "from-green-50",
      gradientTo: "to-emerald-50",
      displayValue: profile?.mobileNumber
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      value: formData.email,
      error: errors.email,
      placeholder: "Enter your email address",
      icon: Mail,
      iconColor: "text-orange-500",
      gradientFrom: "from-orange-50",
      gradientTo: "to-red-50",
      displayValue: profile?.email
    }
  ], [formData, errors, profile]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!profile && error) {
    return <ErrorState error={error} onRefresh={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <ProfileHeader />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        <div className="backdrop-blur-xl bg-white/80 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border-2 border-white/40 p-6 md:p-10 mb-6 md:mb-10 hover:shadow-3xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 w-full lg:w-auto">
              <ProfileAvatar />
              <ProfileInfo fullName={fullName} profile={profile} />
            </div>
            
            <ActionButtons 
              isEditing={isEditing} 
              onRefresh={handleRefresh} 
              onEditClick={handleEditClick} 
            />
          </div>

          <ProfileCompletion profileCompletion={profileCompletion} />
        </div>

        {success && (
          <Alert type="success" message={success} onClose={handleClearSuccess} />
        )}

        {error && (
          <Alert type="error" message={error} onClose={handleClearError} />
        )}

        <div className="backdrop-blur-xl bg-white/80 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border-2 border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500 mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-6" style={{ animationDelay: '100ms' }}>
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 md:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white/30 rounded-lg md:rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <User className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-black">Personal Information</h3>
                <p className="text-white/80 font-medium mt-0.5 md:mt-1 text-sm md:text-base">Manage your personal details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {inputFields.map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
              ))}
            </div>

            {isEditing && (
              <EditActions
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
            )}
          </div>
        </div>

        <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '150ms' }}>
          <QuickActions />
        </div>

        {profile && (
          <div className="animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '200ms' }}>
            <AccountInfo profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MyProfileUI, (prevProps, nextProps) => {
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.error === nextProps.error &&
    prevProps.success === nextProps.success &&
    prevProps.fullName === nextProps.fullName &&
    prevProps.profileCompletion === nextProps.profileCompletion &&
    prevProps.hasChanges === nextProps.hasChanges &&
    JSON.stringify(prevProps.formData) === JSON.stringify(nextProps.formData) &&
    JSON.stringify(prevProps.errors) === JSON.stringify(nextProps.errors) &&
    prevProps.profile?.firstName === nextProps.profile?.firstName &&
    prevProps.profile?.lastName === nextProps.profile?.lastName &&
    prevProps.profile?.email === nextProps.profile?.email &&
    prevProps.profile?.mobileNumber === nextProps.profile?.mobileNumber
  );
});