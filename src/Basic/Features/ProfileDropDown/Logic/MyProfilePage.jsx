// pages/MyProfile.jsx
import React, { useState, useEffect } from "react";

import MyProfileUI from "../Ui/MyProfileUi";

import {
  getOwnerProfile,
  updateOwnerProfile,
  validateProfileData,
} from "../../MemberCrud/Service/memberService";

const MyProfile = () => {
  // State management
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch owner profile
  const fetchProfile = async () => {
    try {
      console.log("🔄 Fetching owner profile...");
      setIsLoading(true);
      setError("");

      const result = await getOwnerProfile();

      if (result.success) {
        console.log("✅ Profile fetched successfully:", result.data);
        setProfile(result.data);
        setFormData({
          firstName: result.data.firstName || "",
          lastName: result.data.lastName || "",
          mobileNumber: result.data.mobileNumber || "",
          email: result.data.email || "",
        });
      } else {
        console.error("❌ Failed to fetch profile:", result.message);
        setError(result.message || "Failed to fetch profile");

        // Handle session expiry
        if (result.needsLogin) {
          console.log("🔒 Session expired, redirecting to login");
          handleSessionExpiry();
        }
      }
    } catch (err) {
      console.error("❌ Network error while fetching profile:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle session expiry
  const handleSessionExpiry = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Start editing mode
  const handleEditClick = () => {
    console.log("✏️ Starting edit mode");
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  // Cancel editing
  const handleCancel = () => {
    console.log("❌ Cancelling edit mode");
    // Reset form data to original values
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      mobileNumber: profile?.mobileNumber || "",
      email: profile?.email || "",
    });
    setErrors({});
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed: ${name} = ${value}`);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general error when user starts editing
    if (error) {
      setError("");
    }
  };

  // Validate form data
  const validateForm = () => {
    console.log("🔍 Validating form data:", formData);
    const validation = validateProfileData(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      console.log("❌ Form validation failed:", validation.errors);
    } else {
      console.log("✅ Form validation passed");
    }

    return validation.isValid;
  };

  // Save profile changes
  const handleSave = async () => {
    console.log("💾 Attempting to save profile changes...");

    if (!validateForm()) {
      console.log("❌ Form validation failed, not saving");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      console.log("📤 Sending profile update request:", formData);
      const result = await updateOwnerProfile(formData);

      if (result.success) {
        console.log("✅ Profile updated successfully:", result.data);
        setProfile(result.data);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");

        // Update form data with the returned data (in case server formatted anything)
        setFormData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          mobileNumber: result.data.mobileNumber,
          email: result.data.email,
        });
      } else {
        console.error("❌ Profile update failed:", result.message);
        setError(result.message || "Failed to update profile");

        // Handle validation errors from server
        if (result.validationErrors && result.validationErrors.length > 0) {
          console.log("📋 Server validation errors:", result.validationErrors);
          const serverErrors = {};
          result.validationErrors.forEach((error, index) => {
            serverErrors[`server_${index}`] = error;
          });
          setErrors((prev) => ({ ...prev, ...serverErrors }));
        }

        // Handle session expiry
        if (result.needsLogin) {
          console.log("🔒 Session expired during update");
          handleSessionExpiry();
        }
      }
    } catch (err) {
      console.error("❌ Network error during profile update:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh profile data
  const handleRefresh = async () => {
    console.log("🔄 Refreshing profile data...");
    await fetchProfile();
  };

  // Get full name for display
  const getFullName = () => {
    if (!profile) return "Loading...";
    return (
      `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
      "No name set"
    );
  };

  // Get profile completion percentage
  const getProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.mobileNumber,
      profile.email,
    ];
    const completed = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Check if profile has changes
  const hasChanges = () => {
    if (!profile) return false;
    return (
      formData.firstName !== (profile.firstName || "") ||
      formData.lastName !== (profile.lastName || "") ||
      formData.mobileNumber !== (profile.mobileNumber || "") ||
      formData.email !== (profile.email || "")
    );
  };

  // Props to pass to UI component
  const uiProps = {
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
    fullName: getFullName(),
    profileCompletion: getProfileCompletion(),
    hasChanges: hasChanges(),

    // Event handlers
    onEditClick: handleEditClick,
    onCancel: handleCancel,
    onSave: handleSave,
    onInputChange: handleInputChange,
    onRefresh: handleRefresh,

    // Utility functions
    clearError: () => setError(""),
    clearSuccess: () => setSuccess(""),
  };

  return <MyProfileUI {...uiProps} />;
};

export default MyProfile;
