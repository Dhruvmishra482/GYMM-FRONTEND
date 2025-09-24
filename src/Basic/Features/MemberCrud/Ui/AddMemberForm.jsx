import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Dumbbell,
  CreditCard,
  Camera,
  Upload,
  X,
  ArrowLeft,
  Check,
  Lock,
  AlertTriangle,
} from "lucide-react";

// Enhanced Photo Upload Component
const PhotoUploadField = ({ formData, handleChange }) => {
  const [previewUrl, setPreviewUrl] = useState(formData.photoUrl || '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  

  // Sync previewUrl with formData changes (when user types name)
  useEffect(() => {
    setPreviewUrl(formData.photoUrl || '');
  }, [formData.photoUrl]);

  const getFallbackImage = (name) => {
    const colors = ['3b82f6', '8b5cf6', '06b6d4', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
    const colorIndex = name ? name.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || 'New Member'
    )}&background=${bgColor}&color=fff&size=200&rounded=true&bold=true`;
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target.result;
        setPreviewUrl(base64Url);
        handleChange({ target: { name: 'photoUrl', value: base64Url } });
        setShowUploadModal(false);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setIsUploading(false);
      alert('Error processing image file. Please try again.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }

    setIsUploading(true);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      setPreviewUrl(urlInput);
      handleChange({ target: { name: 'photoUrl', value: urlInput } });
      setShowUploadModal(false);
      setIsUploading(false);
      setUrlInput('');
    };
    
    img.onerror = () => {
      setIsUploading(false);
      alert('Failed to load image from URL. Please check the URL and try again.');
    };
    
    img.src = urlInput;
  };

  const handleRemovePhoto = () => {
    setPreviewUrl('');
    handleChange({ target: { name: 'photoUrl', value: '' } });
    setShowUploadModal(false);
    setUrlInput('');
  };

  const handleDirectUrlChange = (e) => {
    const url = e.target.value;
    handleChange(e);
    if (url) {
      setPreviewUrl(url);
    }
  };

  return (
    <div className="group md:col-span-2">
      <label className="flex items-center mb-4 font-medium text-gray-700">
        <Camera className="w-4 h-4 mr-2 text-violet-500" />
        Member Photo (Optional)
      </label>
      
      {/* Photo Preview and Upload Section */}
      <div className="flex items-start gap-6 p-4 border bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-violet-100">
        {/* Photo Preview */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 overflow-hidden transition-all duration-200 rounded-full shadow-lg border-3 border-violet-200 group-hover:border-violet-400">
            <img
              src={previewUrl || getFallbackImage(formData.name)}
              alt="Member preview"
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
              onError={(e) => {
                e.target.src = getFallbackImage(formData.name);
              }}
            />
          </div>
          
          {/* Upload Button Overlay */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="absolute flex items-center justify-center w-8 h-8 text-white transition-all duration-200 rounded-full shadow-lg -bottom-1 -right-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-110"
            title="Upload/Change Photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Options */}
        <div className="flex-1 space-y-4">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Add Member Photo</h4>
            <p className="mb-3 text-sm text-gray-600">
              Upload a photo or paste an image URL to make member identification easier.
            </p>
          </div>

          {/* Quick URL Input */}
          <div>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl || ''}
              onChange={handleDirectUrlChange}
              placeholder="Paste image URL here (e.g., https://example.com/photo.jpg)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-violet-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              Upload File
            </button>
            {previewUrl && previewUrl !== getFallbackImage(formData.name) && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-4 py-2 text-sm font-medium text-red-600 transition-colors border border-red-200 rounded-lg bg-red-50 hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-5 text-white bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white to-transparent"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Upload Photo</h3>
                    <p className="mt-1 text-sm text-violet-100">{formData.name || 'New Member'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadMethod('file');
                    setUrlInput('');
                  }}
                  className="p-3 transition-all duration-200 rounded-lg hover:bg-white hover:bg-opacity-20 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5">
              {/* Upload Method Tabs */}
              <div className="flex gap-2 p-1 mb-5 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    uploadMethod === 'file'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    uploadMethod === 'url'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    Image URL
                  </div>
                </button>
              </div>

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div className="space-y-4">
                  <div
                    className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 scale-105'
                        : 'border-gray-300 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        dragActive 
                          ? 'bg-gradient-to-br from-violet-500 to-purple-600 scale-110' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-violet-100 hover:to-purple-100'
                      }`}>
                        <Upload className={`w-8 h-8 transition-colors duration-300 ${
                          dragActive ? 'text-white' : 'text-gray-400 hover:text-violet-500'
                        }`} />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-700">
                          {dragActive ? 'Drop your image here!' : 'Drag & drop your image'}
                        </p>
                        <p className="text-sm text-gray-500">
                          or click the button below to browse
                        </p>
                        <p className="text-xs text-gray-400">
                          Supports JPG, PNG, GIF up to 5MB
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="mt-3 px-6 py-2.5 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Choose File
                          </div>
                        )}
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Image URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 pr-12 transition-all duration-300 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-violet-100 focus:border-violet-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <Camera className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleUrlSubmit}
                      disabled={!urlInput.trim() || isUploading}
                      className="flex items-center justify-center w-full gap-2 px-5 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Loading Image...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Use This URL
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Current Photo Preview */}
              {previewUrl && previewUrl !== getFallbackImage(formData.name) && (
                <div className="p-4 mt-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                  <h4 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    Current Photo Preview
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover w-16 h-16 border-white shadow-lg border-3 rounded-xl"
                        onError={(e) => {
                          e.target.src = getFallbackImage(formData.name);
                        }}
                      />
                      <div className="absolute flex items-center justify-center w-5 h-5 bg-green-500 rounded-full -top-1 -right-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Photo looks great!</p>
                      <p className="mb-1 text-xs text-gray-600">Ready to use for member profile</p>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-xs font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
                      >
                        Remove this photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-5 mt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadMethod('file');
                    setUrlInput('');
                  }}
                  className="flex-1 px-4 py-2.5 text-gray-700 font-medium transition-all duration-300 bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddMemberForm = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
}) => {
  // Function to calculate next due date based on plan duration and joining date
  const calculateNextDueDate = (joiningDate, planDuration) => {
    if (!joiningDate || !planDuration) return '';

    const joiningDateObj = new Date(joiningDate);
    let nextDueDate = new Date(joiningDateObj);

    // Add months based on plan duration
    switch (planDuration) {
      case '1 month':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case '3 month':
        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
        break;
      case '6 month':
        nextDueDate.setMonth(nextDueDate.getMonth() + 6);
        break;
      case '1 year':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        break;
      default:
        return '';
    }

    // Format date as YYYY-MM-DD for input field
    return nextDueDate.toISOString().split('T')[0];
  };

  // Enhanced handleChange to calculate next due date automatically
  const enhancedHandleChange = (e) => {
    const { name, value } = e.target;
    
    // Call the original handleChange
    handleChange(e);
    
    // If joining date or plan duration changes, recalculate next due date
    if (name === 'joiningDate' || name === 'planDuration') {
      const joiningDate = name === 'joiningDate' ? value : formData.joiningDate;
      const planDuration = name === 'planDuration' ? value : formData.planDuration;
      
      const nextDueDate = calculateNextDueDate(joiningDate, planDuration);
      if (nextDueDate) {
        // Update next due date automatically
        setTimeout(() => {
          handleChange({ target: { name: 'nextDueDate', value: nextDueDate } });
        }, 0);
      }
    }
  };

  const nextDueDateValue = calculateNextDueDate(formData.joiningDate, formData.planDuration);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Gradient */}
      <div className="sticky top-0 z-40 border-b border-blue-100 shadow-md bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="max-w-4xl px-6 py-5 mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Add New Member
              </h1>
              <p className="text-sm text-gray-600">Register a new gym member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl px-6 py-8 mx-auto">
        {/* Welcome Card */}
        <div className="p-6 mb-8 transition-all duration-300 border border-blue-100 rounded-lg shadow-md bg-gradient-to-r from-white to-blue-50 hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 rounded-lg shadow-md bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-transparent bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text">
                Welcome New Member
              </h2>
              <p className="text-gray-600">Fill in the details below to register a new gym member</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="overflow-hidden transition-all duration-300 bg-white border border-blue-100 rounded-lg shadow-md hover:shadow-lg">
          <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-purple-600">
            <h3 className="text-lg font-medium">Member Information</h3>
            <p className="mt-1 text-blue-100">Please provide accurate information for the new member</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={enhancedHandleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-sm"
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={enhancedHandleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 hover:shadow-sm"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-purple-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={enhancedHandleChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 hover:shadow-sm"
                />
              </div>

              {/* Age */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={enhancedHandleChange}
                  placeholder="Enter age"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 hover:shadow-sm"
                />
              </div>

              {/* Gender */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-indigo-500" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={enhancedHandleChange}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Joining Date */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                  Joining Date *
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={enhancedHandleChange}
                  required
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400 hover:shadow-sm"
                />
              </div>

              {/* Plan Duration */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2 text-pink-500" />
                  Plan Duration *
                </label>
                <select
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={enhancedHandleChange}
                  required
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-pink-400 hover:shadow-sm"
                >
                  <option value="">Select Plan</option>
                  <option value="1 month">1 month</option>
                  <option value="3 month">3 months</option>
                  <option value="6 month">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>

              {/* Fees Amount */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                  Fees Amount *
                </label>
                <input
                  type="number"
                  name="feesAmount"
                  value={formData.feesAmount}
                  onChange={enhancedHandleChange}
                  required
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-400 hover:shadow-sm"
                />
              </div>

              {/* Next Due Date - Auto-calculated and Read-only */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-red-500" />
                  Next Due Date *
                  <Lock className="w-3 h-3 ml-2 text-gray-400" title="Auto-calculated based on plan duration" />
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="nextDueDate"
                    value={nextDueDateValue || formData.nextDueDate}
                    readOnly
                    required
                    className="w-full px-4 py-3 text-gray-600 transition-all duration-200 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {formData.joiningDate && formData.planDuration && (
                  <p className="mt-1 text-xs text-gray-500">
                    Automatically calculated from joining date + {formData.planDuration}
                  </p>
                )}
                {(!formData.joiningDate || !formData.planDuration) && (
                  <p className="mt-1 text-xs text-amber-600">
                    Please select joining date and plan duration first
                  </p>
                )}
              </div>

              {/* Payment Status */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2 text-cyan-500" />
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={enhancedHandleChange}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 hover:shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Payment Method - NEW FIELD */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={enhancedHandleChange}
                  className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-sm"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Last Paid On */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                  Last Paid On
                </label>
                <input
                  type="date"
                  name="lastPaidOn"
                  value={formData.lastPaidOn}
                  onChange={enhancedHandleChange}
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-400 hover:shadow-sm"
                />
              </div>

              {/* Emergency Contact - NEW FIELD */}
              <div className="group">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={enhancedHandleChange}
                  placeholder="Emergency contact number"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-400 hover:shadow-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contact person in case of emergency
                </p>
              </div>

              {/* Address */}
              <div className="group md:col-span-2">
                <label className="flex items-center mb-2 font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={enhancedHandleChange}
                  required
                  placeholder="Enter full address"
                  rows="3"
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:border-rose-400 hover:shadow-sm"
                />
              </div>

              {/* Enhanced Photo Upload Field */}
              <PhotoUploadField formData={formData} handleChange={enhancedHandleChange} />
            </div>

            {/* Submit Button */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full border-t-transparent animate-spin"></div>
                    Adding Member...
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-5 h-5" />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-4">
          <div className="p-4 text-center transition-all duration-300 border border-blue-100 rounded-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <User className="w-6 h-6 text-white" />
            </div>
            <h4 className="mb-1 font-medium text-gray-900">Personal Info</h4>
            <p className="text-sm text-gray-600">Basic member details and contact information</p>
          </div>

          <div className="p-4 text-center transition-all duration-300 border border-green-100 rounded-lg bg-gradient-to-br from-white to-green-50 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h4 className="mb-1 font-medium text-gray-900">Plan & Payment</h4>
            <p className="text-sm text-gray-600">Membership plan and payment details</p>
          </div>

          <div className="p-4 text-center transition-all duration-300 border border-red-100 rounded-lg bg-gradient-to-br from-white to-red-50 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h4 className="mb-1 font-medium text-gray-900">Emergency Info</h4>
            <p className="text-sm text-gray-600">Emergency contact for safety</p>
          </div>

          <div className="p-4 text-center transition-all duration-300 border border-purple-100 rounded-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h4 className="mb-1 font-medium text-gray-900">Gym Access</h4>
            <p className="text-sm text-gray-600">Ready to start their fitness journey</p>
          </div>
        </div>

        {/* Auto-calculation Info Card */}
        <div className="p-4 mt-6 text-center transition-all duration-300 border rounded-lg border-amber-100 bg-gradient-to-br from-white to-amber-50 hover:shadow-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h4 className="mb-1 font-medium text-gray-900">Smart Date Calculation</h4>
          <p className="text-sm text-gray-600">
            Next due date is automatically calculated based on joining date and selected plan duration
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddMemberForm;