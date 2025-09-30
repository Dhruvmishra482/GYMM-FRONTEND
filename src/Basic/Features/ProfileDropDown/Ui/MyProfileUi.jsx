import React, { useMemo, useCallback } from "react";
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
  ArrowLeft
} from 'lucide-react';

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized Loading State Component
const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
      </div>
      <div className="bg-white rounded-lg p-6 shadow-md border border-blue-100">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Iron Throne Gym
        </h2>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized Error State Component
const ErrorState = React.memo(({ error, onRefresh }) => {
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-md border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

// Memoized Header Component
const ProfileHeader = React.memo(({ onBack }) => {
  const isVisible = useFadeIn(0);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className={`bg-gradient-to-r from-white via-blue-50 to-white shadow-md border-b border-blue-100 sticky top-0 z-40 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-sm text-gray-600">Manage your account information</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

// Memoized Profile Avatar Component
const ProfileAvatar = React.memo(() => (
  <div className="relative">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
      <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center">
        <User className="h-8 w-8 text-blue-600" />
      </div>
    </div>
    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
      <Crown className="h-3 w-3 text-white" />
    </div>
  </div>
));

ProfileAvatar.displayName = 'ProfileAvatar';

// Memoized Profile Info Component
const ProfileInfo = React.memo(({ fullName, profile }) => (
  <div>
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
        {fullName}
      </h2>
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
    <p className="text-gray-600 mb-2">Gym Owner</p>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-600 font-medium">
          {profile?.isVerified ? 'Verified Account' : 'Pending Verification'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-blue-500" />
        <span className="text-sm text-blue-600 font-medium">Admin Access</span>
      </div>
    </div>
  </div>
));

ProfileInfo.displayName = 'ProfileInfo';

// Memoized Action Buttons Component
const ActionButtons = React.memo(({ isEditing, onRefresh, onEditClick }) => {
  if (isEditing) return null;

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleEdit = useCallback(() => {
    onEditClick();
  }, [onEditClick]);

  return (
    <div className="flex gap-3">
      <button
        onClick={handleRefresh}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105"
        title="Refresh"
      >
        <RefreshCw className="h-5 w-5" />
      </button>
      <button
        onClick={handleEdit}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-md"
      >
        <Edit3 className="h-4 w-4" />
        Edit Profile
      </button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// Memoized Profile Completion Component
const ProfileCompletion = React.memo(({ profileCompletion }) => {
  const barColorClass = useMemo(() => {
    if (profileCompletion === 100) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (profileCompletion >= 75) return 'bg-gradient-to-r from-blue-400 to-purple-500';
    if (profileCompletion >= 50) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-rose-500';
  }, [profileCompletion]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        </div>
        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {profileCompletion}%
        </span>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${barColorClass}`}
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});

ProfileCompletion.displayName = 'ProfileCompletion';

// Memoized Alert Component
const Alert = React.memo(({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  const bgClass = isSuccess ? 'from-green-50 to-emerald-50' : 'from-red-50 to-pink-50';
  const borderClass = isSuccess ? 'border-green-200' : 'border-red-200';
  const iconBgClass = isSuccess ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
  const textClass = isSuccess ? 'text-green-700' : 'text-red-700';
  const hoverClass = isSuccess ? 'hover:text-green-800' : 'hover:text-red-800';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
      <div className={`bg-gradient-to-r ${bgClass} border ${borderClass} rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-r ${iconBgClass} rounded-full flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className={`${textClass} font-medium`}>{message}</span>
          </div>
          <button 
            onClick={handleClose} 
            className={`${textClass} ${hoverClass} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';
// Memoized Input Field Component
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
  const handleChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  return (
    <div>
      <label className="flex items-center text-gray-700 font-medium mb-2">
        <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
        {label} *
      </label>
      {isEditing ? (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 ${
              error 
                ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                : `border-gray-300 focus:ring-${iconColor.split('-')[1]}-500 focus:border-${iconColor.split('-')[1]}-500 hover:border-${iconColor.split('-')[1]}-400`
            }`}
            placeholder={placeholder}
          />
          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-600 animate-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className={`flex items-center gap-3 py-3 px-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg border border-gray-200`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-gray-900 font-medium">{displayValue || 'Not set'}</span>
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

// Memoized Edit Actions Component
const EditActions = React.memo(({ onSave, onCancel, isSaving, hasChanges }) => {
  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:hover:scale-100"
        >
          <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-lg border border-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-orange-700 font-medium">You have unsaved changes</span>
        </div>
      )}
    </div>
  );
});

EditActions.displayName = 'EditActions';

// Memoized Account Info Component
const AccountInfo = React.memo(({ profile }) => {
  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return 'Not available';
    return new Date(profile.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [profile?.createdAt]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-medium">Account Information</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <Crown className="h-4 w-4 mr-2 text-yellow-500" />
              Account Type
            </label>
            <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <UserCheck className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800 font-bold capitalize">{profile.accountType || 'Owner'}</span>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
              Member Since
            </label>
            <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-gray-200">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span className="text-gray-900 font-medium">{memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AccountInfo.displayName = 'AccountInfo';

const MyProfileUI = ({
  // Data
  profile,
  formData,
  errors,

  // States
  isLoading,
  isEditing,
  isSaving,
  error,
  success,

  // Computed values
  fullName,
  profileCompletion,
  hasChanges,

  // Event handlers
  onEditClick,
  onCancel,
  onSave,
  onInputChange,
  onRefresh,
  clearError,
  clearSuccess,
}) => {
  // Memoize handlers
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

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (!profile && error) {
    return <ErrorState error={error} onRefresh={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <ProfileHeader />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-md border border-blue-100 p-6 mb-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
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

        {/* Alert Messages */}
        {success && (
          <Alert type="success" message={success} onClose={handleClearSuccess} />
        )}

        {error && (
          <Alert type="error" message={error} onClose={handleClearError} />
        )}

        {/* Personal Information Form */}
        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-medium">Personal Information</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Enter your first name"
                icon={User}
                iconColor="text-blue-500"
                gradientFrom="from-gray-50"
                gradientTo="to-blue-50"
                isEditing={isEditing}
                displayValue={profile?.firstName}
              />

              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Enter your last name"
                icon={User}
                iconColor="text-purple-500"
                gradientFrom="from-gray-50"
                gradientTo="to-purple-50"
                isEditing={isEditing}
                displayValue={profile?.lastName}
              />

              <InputField
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                error={errors.mobileNumber}
                placeholder="Enter 10-digit mobile number"
                icon={Phone}
                iconColor="text-green-500"
                gradientFrom="from-gray-50"
                gradientTo="to-green-50"
                isEditing={isEditing}
                displayValue={profile?.mobileNumber}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
                icon={Mail}
                iconColor="text-orange-500"
                gradientFrom="from-gray-50"
                gradientTo="to-orange-50"
                isEditing={isEditing}
                displayValue={profile?.email}
              />
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

        {/* Account Information */}
        {profile && <AccountInfo profile={profile} />}
      </div>
    </div>
  );
};

export default React.memo(MyProfileUI);