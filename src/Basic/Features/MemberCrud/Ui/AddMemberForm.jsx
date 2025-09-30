// imageProcessor.worker.js
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'PROCESS_IMAGE':
      try {
        const { file, maxSize } = data;
        
        // Read file as data URL
        const reader = new FileReaderSync();
        const dataUrl = reader.readAsDataURL(file);
        
        // Create image bitmap for processing
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        
        // Compress if needed
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions if image is too large
        let width = bitmap.width;
        let height = bitmap.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
          canvas.width = width;
          canvas.height = height;
        }
        
        ctx.drawImage(bitmap, 0, 0, width, height);
        
        // Convert to blob with quality compression
        const compressedBlob = await canvas.convertToBlob({
          type: 'image/jpeg',
          quality: 0.85
        });
        
        // Convert blob to base64
        const compressedDataUrl = await blobToBase64(compressedBlob);
        
        self.postMessage({
          type: 'IMAGE_PROCESSED',
          data: {
            dataUrl: compressedDataUrl,
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            dimensions: { width, height }
          }
        });
      } catch (error) {
        self.postMessage({
          type: 'IMAGE_ERROR',
          error: error.message
        });
      }
      break;

    case 'VALIDATE_URL':
      try {
        const { url } = data;
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.startsWith('image/')) {
          self.postMessage({
            type: 'URL_VALID',
            data: { valid: true, contentType }
          });
        } else {
          throw new Error('URL does not point to an image');
        }
      } catch (error) {
        self.postMessage({
          type: 'URL_INVALID',
          error: error.message
        });
      }
      break;
  }
});

// Helper function
async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
  User, Phone, Mail, Calendar, DollarSign, MapPin, Users,
  Dumbbell, CreditCard, Camera, Upload, X, ArrowLeft,
  Check, Lock, AlertTriangle,
} from "lucide-react";

// Custom hook for Web Worker
const useImageWorker = () => {
  const workerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize worker
    const workerCode = `
      self.addEventListener('message', async (e) => {
        const { type, data } = e.data;
        
        if (type === 'PROCESS_IMAGE') {
          try {
            const { dataUrl, maxSize } = data;
            
            // Create image from data URL
            const img = await createImageBitmap(await (await fetch(dataUrl)).blob());
            
            let width = img.width;
            let height = img.height;
            
            // Resize if needed
            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height);
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            }
            
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
            const reader = new FileReader();
            
            reader.onloadend = () => {
              self.postMessage({
                type: 'IMAGE_PROCESSED',
                data: { dataUrl: reader.result, size: blob.size }
              });
            };
            
            reader.readAsDataURL(blob);
          } catch (error) {
            self.postMessage({ type: 'IMAGE_ERROR', error: error.message });
          }
        }
      });
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const processImage = useCallback((dataUrl, maxSize = 1200) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setIsProcessing(true);

      const handleMessage = (e) => {
        if (e.data.type === 'IMAGE_PROCESSED') {
          setIsProcessing(false);
          workerRef.current.removeEventListener('message', handleMessage);
          resolve(e.data.data);
        } else if (e.data.type === 'IMAGE_ERROR') {
          setIsProcessing(false);
          workerRef.current.removeEventListener('message', handleMessage);
          reject(new Error(e.data.error));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({
        type: 'PROCESS_IMAGE',
        data: { dataUrl, maxSize }
      });
    });
  }, []);

  return { processImage, isProcessing };
};

// Memoized fallback image generator
const useFallbackImage = (name) => {
  return useMemo(() => {
    const colors = ['3b82f6', '8b5cf6', '06b6d4', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
    const colorIndex = name ? name.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || 'New Member'
    )}&background=${bgColor}&color=fff&size=200&rounded=true&bold=true`;
  }, [name]);
};

// Memoized Photo Preview Component
const PhotoPreview = memo(({ src, alt, onError, onClick }) => (
  <div className="relative flex-shrink-0">
    <div className="w-24 h-24 overflow-hidden transition-all duration-200 rounded-full shadow-lg border-3 border-violet-200 group-hover:border-violet-400">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
        onError={onError}
        loading="lazy"
      />
    </div>
    
    <button
      type="button"
      onClick={onClick}
      className="absolute flex items-center justify-center w-8 h-8 text-white transition-all duration-200 rounded-full shadow-lg -bottom-1 -right-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-110"
      title="Upload/Change Photo"
    >
      <Camera className="w-4 h-4" />
    </button>
  </div>
));

PhotoPreview.displayName = 'PhotoPreview';

// Memoized Upload Modal Component
const UploadModal = memo(({ 
  isOpen, 
  onClose, 
  memberName, 
  uploadMethod, 
  setUploadMethod,
  onFileSelect,
  onUrlSubmit,
  urlInput,
  setUrlInput,
  isUploading,
  dragActive,
  onDrop,
  onDragOver,
  onDragLeave,
  previewUrl,
  onRemovePhoto,
  fileInputRef,
  fallbackImage
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
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
                <p className="mt-1 text-sm text-violet-100">{memberName || 'New Member'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
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
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
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
                  onChange={(e) => onFileSelect(e.target.files[0])}
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
                  onClick={onUrlSubmit}
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
          {previewUrl && previewUrl !== fallbackImage && (
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
                      e.target.src = fallbackImage;
                    }}
                    loading="lazy"
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
                    onClick={onRemovePhoto}
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
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 font-medium transition-all duration-300 bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UploadModal.displayName = 'UploadModal';

// Main Photo Upload Component with Web Worker
const PhotoUploadField = memo(({ formData, handleChange }) => {
  const [previewUrl, setPreviewUrl] = useState(formData.photoUrl || '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const { processImage, isProcessing } = useImageWorker();
  const fallbackImage = useFallbackImage(formData.name);

  useEffect(() => {
    setPreviewUrl(formData.photoUrl || '');
  }, [formData.photoUrl]);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        
        // Process image in Web Worker
        const processed = await processImage(dataUrl, 1200);
        
        setPreviewUrl(processed.dataUrl);
        handleChange({ target: { name: 'photoUrl', value: processed.dataUrl } });
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing image file. Please try again.');
    }
  }, [processImage, handleChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      setPreviewUrl(urlInput);
      handleChange({ target: { name: 'photoUrl', value: urlInput } });
      setShowUploadModal(false);
      setUrlInput('');
    };
    
    img.onerror = () => {
      alert('Failed to load image from URL. Please check the URL and try again.');
    };
    
    img.src = urlInput;
  }, [urlInput, handleChange]);

  const handleRemovePhoto = useCallback(() => {
    setPreviewUrl('');
    handleChange({ target: { name: 'photoUrl', value: '' } });
    setShowUploadModal(false);
    setUrlInput('');
  }, [handleChange]);

  const handleDirectUrlChange = useCallback((e) => {
    const url = e.target.value;
    handleChange(e);
    if (url) {
      setPreviewUrl(url);
    }
  }, [handleChange]);

  const handlePhotoError = useCallback((e) => {
    e.target.src = fallbackImage;
  }, [fallbackImage]);

  const handleOpenModal = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowUploadModal(false);
    setUploadMethod('file');
    setUrlInput('');
  }, []);

  return (
    <div className="group md:col-span-2">
      <label className="flex items-center mb-4 font-medium text-gray-700">
        <Camera className="w-4 h-4 mr-2 text-violet-500" />
        Member Photo (Optional)
      </label>
      
      <div className="flex items-start gap-6 p-4 border bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-violet-100">
        <PhotoPreview
          src={previewUrl || fallbackImage}
          alt="Member preview"
          onError={handlePhotoError}
          onClick={handleOpenModal}
        />

        <div className="flex-1 space-y-4">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Add Member Photo</h4>
            <p className="mb-3 text-sm text-gray-600">
              Upload a photo or paste an image URL to make member identification easier.
            </p>
          </div>

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

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              Upload File
            </button>
            {previewUrl && previewUrl !== fallbackImage && (
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

      <UploadModal
        isOpen={showUploadModal}
        onClose={handleCloseModal}
        memberName={formData.name}
        uploadMethod={uploadMethod}
        setUploadMethod={setUploadMethod}
        onFileSelect={handleFileSelect}
        onUrlSubmit={handleUrlSubmit}
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        isUploading={isProcessing}
        dragActive={dragActive}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        previewUrl={previewUrl}
        onRemovePhoto={handleRemovePhoto}
        fileInputRef={fileInputRef}
        fallbackImage={fallbackImage}
      />
    </div>
  );
});

PhotoUploadField.displayName = 'PhotoUploadField';

// Continue with Part 2 for the main form component...
// Memoized Form Field Component
const FormField = memo(({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  placeholder = "", 
  options = null,
  iconColor = "blue-500",
  rows = null,
  readOnly = false,
  helpText = null,
  warningText = null
}) => {
  const handleChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className="group">
      <label className="flex items-center mb-2 font-medium text-gray-700">
        <Icon className={`w-4 h-4 mr-2 text-${iconColor}`} />
        {label} {required && "*"}
        {readOnly && <Lock className="w-3 h-3 ml-2 text-gray-400" />}
      </label>
      
      {type === "select" && options ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={readOnly}
          className={`w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-${iconColor} focus:border-${iconColor} hover:border-${iconColor.replace('500', '400')} hover:shadow-sm ${
            readOnly ? 'cursor-not-allowed bg-gray-50 text-gray-600' : ''
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          rows={rows || 3}
          className={`w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-${iconColor} focus:border-${iconColor} hover:border-${iconColor.replace('500', '400')} hover:shadow-sm`}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${iconColor} focus:border-${iconColor} hover:border-${iconColor.replace('500', '400')} hover:shadow-sm ${
              readOnly ? 'cursor-not-allowed bg-gray-50 text-gray-600' : ''
            }`}
          />
          {readOnly && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      )}
      
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {warningText && (
        <p className="mt-1 text-xs text-amber-600">{warningText}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// Memoized Info Card Component
const InfoCard = memo(({ icon: Icon, title, description, gradient }) => (
  <div className={`p-4 text-center transition-all duration-300 border rounded-lg bg-gradient-to-br from-white ${gradient} hover:shadow-md`}>
    <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${gradient.replace('to-', 'to-').split(' ')[1]}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h4 className="mb-1 font-medium text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
));

InfoCard.displayName = 'InfoCard';

// Main Form Component with all optimizations
const AddMemberForm = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
}) => {
  // Memoized date calculation
  const calculateNextDueDate = useCallback((joiningDate, planDuration) => {
    if (!joiningDate || !planDuration) return '';

    const joiningDateObj = new Date(joiningDate);
    let nextDueDate = new Date(joiningDateObj);

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

    return nextDueDate.toISOString().split('T')[0];
  }, []);

  // Memoized next due date
  const nextDueDateValue = useMemo(() => 
    calculateNextDueDate(formData.joiningDate, formData.planDuration),
    [formData.joiningDate, formData.planDuration, calculateNextDueDate]
  );

  // Enhanced handleChange with auto-calculation
  const enhancedHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    handleChange(e);
    
    if (name === 'joiningDate' || name === 'planDuration') {
      const joiningDate = name === 'joiningDate' ? value : formData.joiningDate;
      const planDuration = name === 'planDuration' ? value : formData.planDuration;
      
      const nextDueDate = calculateNextDueDate(joiningDate, planDuration);
      if (nextDueDate) {
        setTimeout(() => {
          handleChange({ target: { name: 'nextDueDate', value: nextDueDate } });
        }, 0);
      }
    }
  }, [formData.joiningDate, formData.planDuration, handleChange, calculateNextDueDate]);

  // Memoized form fields configuration
  const personalFields = useMemo(() => [
    {
      icon: User,
      label: "Full Name",
      name: "name",
      type: "text",
      value: formData.name,
      required: true,
      placeholder: "Enter full name",
      iconColor: "blue-500"
    },
    {
      icon: Phone,
      label: "Phone Number",
      name: "phoneNo",
      type: "tel",
      value: formData.phoneNo,
      required: true,
      placeholder: "Enter phone number",
      iconColor: "green-500"
    },
    {
      icon: Mail,
      label: "Email Address",
      name: "email",
      type: "email",
      value: formData.email,
      required: false,
      placeholder: "Enter email address",
      iconColor: "purple-500"
    },
    {
      icon: Calendar,
      label: "Age",
      name: "age",
      type: "number",
      value: formData.age,
      required: false,
      placeholder: "Enter age",
      iconColor: "orange-500"
    },
    {
      icon: Users,
      label: "Gender",
      name: "gender",
      type: "select",
      value: formData.gender,
      required: false,
      iconColor: "indigo-500",
      options: [
        { value: "", label: "Select Gender" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Others", label: "Others" }
      ]
    }
  ], [formData.name, formData.phoneNo, formData.email, formData.age, formData.gender]);

  const planFields = useMemo(() => [
    {
      icon: Calendar,
      label: "Joining Date",
      name: "joiningDate",
      type: "date",
      value: formData.joiningDate,
      required: true,
      iconColor: "teal-500"
    },
    {
      icon: CreditCard,
      label: "Plan Duration",
      name: "planDuration",
      type: "select",
      value: formData.planDuration,
      required: true,
      iconColor: "pink-500",
      options: [
        { value: "", label: "Select Plan" },
        { value: "1 month", label: "1 month" },
        { value: "3 month", label: "3 months" },
        { value: "6 month", label: "6 months" },
        { value: "1 year", label: "1 year" }
      ]
    },
    {
      icon: DollarSign,
      label: "Fees Amount",
      name: "feesAmount",
      type: "number",
      value: formData.feesAmount,
      required: true,
      placeholder: "Enter amount",
      iconColor: "emerald-500"
    },
    {
      icon: Calendar,
      label: "Next Due Date",
      name: "nextDueDate",
      type: "date",
      value: nextDueDateValue || formData.nextDueDate,
      required: true,
      readOnly: true,
      iconColor: "red-500",
      helpText: formData.joiningDate && formData.planDuration 
        ? `Automatically calculated from joining date + ${formData.planDuration}`
        : null,
      warningText: !formData.joiningDate || !formData.planDuration
        ? "Please select joining date and plan duration first"
        : null
    },
    {
      icon: CreditCard,
      label: "Payment Status",
      name: "paymentStatus",
      type: "select",
      value: formData.paymentStatus,
      required: false,
      iconColor: "cyan-500",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Paid", label: "Paid" }
      ]
    },
    {
      icon: CreditCard,
      label: "Payment Method",
      name: "paymentMethod",
      type: "select",
      value: formData.paymentMethod,
      required: false,
      iconColor: "blue-500",
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Card", label: "Card" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Other", label: "Other" }
      ]
    },
    {
      icon: Calendar,
      label: "Last Paid On",
      name: "lastPaidOn",
      type: "date",
      value: formData.lastPaidOn,
      required: false,
      iconColor: "amber-500"
    },
    {
      icon: AlertTriangle,
      label: "Emergency Contact",
      name: "emergencyContact",
      type: "tel",
      value: formData.emergencyContact,
      required: false,
      placeholder: "Emergency contact number",
      iconColor: "red-500",
      helpText: "Contact person in case of emergency"
    }
  ], [
    formData.joiningDate, 
    formData.planDuration, 
    formData.feesAmount,
    formData.nextDueDate,
    formData.paymentStatus,
    formData.paymentMethod,
    formData.lastPaidOn,
    formData.emergencyContact,
    nextDueDateValue
  ]);

  const infoCards = useMemo(() => [
    {
      icon: User,
      title: "Personal Info",
      description: "Basic member details and contact information",
      gradient: "to-blue-50 border-blue-100"
    },
    {
      icon: CreditCard,
      title: "Plan & Payment",
      description: "Membership plan and payment details",
      gradient: "to-green-50 border-green-100"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Info",
      description: "Emergency contact for safety",
      gradient: "to-red-50 border-red-100"
    },
    {
      icon: Dumbbell,
      title: "Gym Access",
      description: "Ready to start their fitness journey",
      gradient: "to-purple-50 border-purple-100"
    }
  ], []);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleFormSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-blue-100 shadow-md bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="max-w-4xl px-6 py-5 mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-100 hover:scale-105"
              type="button"
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

          <form onSubmit={handleFormSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Fields */}
              {personalFields.map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  onChange={enhancedHandleChange}
                />
              ))}

              {/* Plan Fields */}
              {planFields.map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  onChange={enhancedHandleChange}
                />
              ))}

              {/* Address */}
              <FormField
                icon={MapPin}
                label="Address"
                name="address"
                type="textarea"
                value={formData.address}
                onChange={enhancedHandleChange}
                required={true}
                placeholder="Enter full address"
                iconColor="rose-500"
                rows={3}
              />

              {/* Photo Upload */}
              <PhotoUploadField formData={formData} handleChange={enhancedHandleChange} />
            </div>

            {/* Submit Button */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <button
                type="submit"
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
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>

        {/* Auto-calculation Info */}
        <InfoCard
          icon={Lock}
          title="Smart Date Calculation"
          description="Next due date is automatically calculated based on joining date and selected plan duration"
          gradient="to-amber-50 border-amber-100"
        />
      </div>
    </div>
  );
};

export default memo(AddMemberForm);