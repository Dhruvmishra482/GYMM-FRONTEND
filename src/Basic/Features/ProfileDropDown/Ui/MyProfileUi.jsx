import React, { useMemo, useState, useEffect } from "react";
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
  Calendar,
  Crown,
  Shield,
  Zap,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isActive]);
};

// ==================== COMPONENTS ====================

const LoadingState = React.memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600 mx-auto mb-3" />
      <p className="text-gray-600 text-sm">Loading profile...</p>
    </div>
  </div>
));

LoadingState.displayName = "LoadingState";

const ErrorState = React.memo(({ error, onRefresh }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Failed to Load
        </h2>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>
));

ErrorState.displayName = "ErrorState";

const ProfileHeader = React.memo(() => {
  const isVisible = useFadeIn(0);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className={`bg-white border-b border-gray-200 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">
              Manage your account information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";

const ProfileAvatar = React.memo(({ profile, user }) => {
  const [imageError, setImageError] = useState(false);

  const gymLogo = user?.gymDetails?.gymLogo;
  const profileImage = user?.profileImage;
  const displayImage = gymLogo || profileImage;

  const getInitials = () => {
    const firstName = profile?.firstName || user?.firstName || "";
    const lastName = profile?.lastName || user?.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    return "U";
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-100 shadow-lg">
        {displayImage && !imageError ? (
          <img
            src={displayImage}
            alt={profile?.firstName || "Profile"}
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-white text-2xl font-bold">{getInitials()}</span>
        )}
      </div>
      {profile?.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-md">
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";

const ProfileInfo = React.memo(({ fullName, profile }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h2>
    <p className="text-gray-600 text-sm mb-2 font-medium">Gym Owner</p>
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
        <Shield className="h-3.5 w-3.5 text-green-600" />
        <span className="text-xs text-green-700 font-semibold">
          {profile?.isVerified ? "Verified" : "Pending"}
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
        <Zap className="h-3.5 w-3.5 text-blue-600" />
        <span className="text-xs text-blue-700 font-semibold">Admin</span>
      </div>
    </div>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

const ActionButtons = React.memo(({ isEditing, onRefresh, onEditClick }) => {
  if (isEditing) return null;
  return (
    <div className="flex gap-2">
      <button
        onClick={onRefresh}
        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Refresh"
        aria-label="Refresh profile"
      >
        <RefreshCw className="h-5 w-5" />
      </button>
      <button
        onClick={onEditClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-sm"
        aria-label="Edit profile"
      >
        <Edit3 className="h-4 w-4" />
        Edit Profile
      </button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

const ProfileCompletion = React.memo(({ profileCompletion }) => {
  const message =
    profileCompletion === 100
      ? "Complete!"
      : profileCompletion >= 75
      ? "Almost there"
      : "Keep going";

  const getColor = () => {
    if (profileCompletion === 100) return "from-green-500 to-green-600";
    if (profileCompletion >= 75) return "from-blue-500 to-blue-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <span className="text-sm font-semibold text-gray-900">
            Profile Completion
          </span>
          <span className="text-xs text-gray-500 ml-2 font-medium">
            {message}
          </span>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="text-white font-bold text-sm">
            {profileCompletion}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 bg-gradient-to-r ${getColor()} rounded-full transition-all duration-1000 shadow-sm`}
          style={{ width: `${profileCompletion}%` }}
          role="progressbar"
          aria-valuenow={profileCompletion}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
});

ProfileCompletion.displayName = "ProfileCompletion";

const Alert = React.memo(({ type, message, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div className="mb-4">
      <div
        className={`${
          isSuccess
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        } border-2 rounded-lg p-4 flex items-center justify-between shadow-sm`}
      >
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          )}
          <span
            className={`text-sm font-semibold ${
              isSuccess ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </span>
        </div>
        <button
          onClick={onClose}
          className={`${
            isSuccess
              ? "text-green-600 hover:text-green-800 hover:bg-green-100"
              : "text-red-600 hover:text-red-800 hover:bg-red-100"
          } p-1 rounded transition-colors`}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    icon: Icon,
    isEditing,
    displayValue,
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    if (!isEditing) {
      return (
        <div>
          <label className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider block">
            {label}
          </label>
          <div className="flex items-center gap-3 py-3.5 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <Icon className="h-5 w-5 text-blue-600" />
            <span className="text-gray-900 text-sm font-medium flex-1">
              {displayValue || "Not set"}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider block">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type={type === "password" && showPassword ? "text" : type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full pl-11 pr-4 py-3.5 bg-white border-2 ${
              error
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-blue-500"
            } rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none transition-colors`}
            placeholder={placeholder}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <div
            id={`${name}-error`}
            className="mt-2 flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

const EditActions = React.memo(({ onSave, onCancel, isSaving, hasChanges }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t-2 border-gray-200 mt-6 gap-3">
    <div className="flex gap-3 w-full sm:w-auto">
      <button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-lg text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md disabled:cursor-not-allowed"
        aria-label={isSaving ? "Saving..." : "Save Changes"}
      >
        <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="flex-1 sm:flex-none border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 px-8 py-3 rounded-lg text-sm font-bold inline-flex items-center justify-center gap-2 transition-all"
        aria-label="Cancel editing"
      >
        <X className="h-4 w-4" />
        Cancel
      </button>
    </div>
    {hasChanges && (
      <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 px-4 py-2 rounded-lg shadow-sm">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <span className="text-xs text-amber-800 font-bold">
          Unsaved changes
        </span>
      </div>
    )}
  </div>
));

EditActions.displayName = "EditActions";

const AccountInfo = React.memo(({ profile }) => {
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Account Information
            </h3>
            <p className="text-blue-100 text-xs font-medium">
              Your membership details
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider block">
              Account Type
            </label>
            <div className="flex items-center gap-3 py-3.5 px-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg">
              <Crown className="h-5 w-5 text-green-600" />
              <span className="text-gray-900 text-sm font-bold capitalize">
                {profile?.accountType || "Owner"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider block">
              Member Since
            </label>
            <div className="flex items-center gap-3 py-3.5 px-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-gray-900 text-sm font-medium">
                {memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AccountInfo.displayName = "AccountInfo";

// ==================== MAIN COMPONENT ====================

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
  user,
}) => {
  useBodyScrollLock(isEditing);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "s" &&
        isEditing &&
        hasChanges
      ) {
        e.preventDefault();
        onSave();
      }
      if (e.key === "Escape" && isEditing && !isSaving) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, hasChanges, isSaving, onSave, onCancel]);

  const inputFields = useMemo(
    () => [
      {
        label: "First Name",
        name: "firstName",
        value: formData.firstName,
        error: errors.firstName,
        placeholder: "Enter your first name",
        icon: User,
        displayValue: profile?.firstName,
      },
      {
        label: "Last Name",
        name: "lastName",
        value: formData.lastName,
        error: errors.lastName,
        placeholder: "Enter your last name",
        icon: User,
        displayValue: profile?.lastName,
      },
      {
        label: "Mobile Number",
        name: "mobileNumber",
        type: "tel",
        value: formData.mobileNumber,
        error: errors.mobileNumber,
        placeholder: "Enter 10-digit mobile number",
        icon: Phone,
        displayValue: profile?.mobileNumber,
      },
      {
        label: "Email Address",
        name: "email",
        type: "email",
        value: formData.email,
        error: errors.email,
        placeholder: "Enter your email address",
        icon: Mail,
        displayValue: profile?.email,
      },
    ],
    [formData, errors, profile]
  );

  if (isLoading) return <LoadingState />;
  if (!profile && error)
    return <ErrorState error={error} onRefresh={onRefresh} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
              <ProfileAvatar profile={profile} user={user} />
              <ProfileInfo fullName={fullName} profile={profile} />
            </div>
            <ActionButtons
              isEditing={isEditing}
              onRefresh={onRefresh}
              onEditClick={onEditClick}
            />
          </div>
          <ProfileCompletion profileCompletion={profileCompletion} />
        </div>

        {success && (
          <Alert type="success" message={success} onClose={clearSuccess} />
        )}
        {error && <Alert type="error" message={error} onClose={clearError} />}

        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Personal Information
                </h3>
                <p className="text-blue-100 text-xs font-medium">
                  Manage your personal details
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {inputFields.map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  onChange={onInputChange}
                  isEditing={isEditing}
                />
              ))}
            </div>
            {isEditing && (
              <EditActions
                onSave={onSave}
                onCancel={onCancel}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
            )}
          </div>
        </div>

        {profile && <AccountInfo profile={profile} />}
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
    prevProps.profile?.mobileNumber === nextProps.profile?.mobileNumber &&
    prevProps.user?.profileImage === nextProps.user?.profileImage &&
    prevProps.user?.gymDetails?.gymLogo === nextProps.user?.gymDetails?.gymLogo
  );
});
