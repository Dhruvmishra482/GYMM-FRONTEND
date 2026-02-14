// AnnouncementForm.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAnnouncementStore } from "../store/announcementStore";
import { toast } from "react-hot-toast";
import { Send, Eye, RefreshCcw, Save, AlertCircle } from "lucide-react"; // Import icons, add Save

const AnnouncementForm = ({ initialData, onClose, onSuccess }) => {
  const {
    sendAnnouncement,
    updateAnnouncement, // Add updateAnnouncement
    previewAnnouncementMessage,
    loading,
    error,
    previewMessage,
    clearError,
  } = useAnnouncementStore();

  const isEditing = useMemo(() => !!initialData, [initialData]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    announcementType: "General",
    priority: "Medium",
    filterGender: "All",
    filterPaymentStatus: "All",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        message: initialData.message || "",
        announcementType: initialData.announcementType || "General",
        priority: initialData.priority || "Medium",
        filterGender: initialData.filters?.gender || "All",
        filterPaymentStatus: initialData.filters?.paymentStatus || "All",
      });
    } else {
      setFormData({
        title: "",
        message: "",
        announcementType: "General",
        priority: "Medium",
        filterGender: "All",
        filterPaymentStatus: "All",
      });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) clearError();
  }, [formErrors, error, clearError]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.message.trim()) errors.message = "Message is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let res;
    if (isEditing) {
      res = await updateAnnouncement(initialData._id, formData);
    } else {
      res = await sendAnnouncement(formData);
    }

    if (res.success) {
      setFormData({
        title: "",
        message: "",
        announcementType: "General",
        priority: "Medium",
        filterGender: "All",
        filterPaymentStatus: "All",
      });
      setFormErrors({});
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }
  }, [formData, isEditing, initialData, sendAnnouncement, updateAnnouncement, validateForm, onClose, onSuccess]);

  const handlePreviewMessage = useCallback(async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and Message are required to preview.");
      return;
    }
    await previewAnnouncementMessage({
      title: formData.title,
      message: formData.message,
      priority: formData.priority,
    });
  }, [formData, previewAnnouncementMessage]);

  const isSubmitting = loading;

  const baseInputClass = "w-full p-3 bg-gray-700/50 border border-amber-600 rounded-lg text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-inner";
  const labelClass = "block text-sm font-medium text-orange-200 mb-1";
  const errorClass = "mt-1 text-xs font-medium flex items-center gap-1 text-red-400";

  // Memoized options for select fields
  const announcementTypeOptions = useMemo(() => ([
    { value: "General", label: "General" },
    { value: "Emergency", label: "Emergency" },
    { value: "Promotion", label: "Promotion" },
    { value: "Update", label: "Update" },
  ]), []);

  const priorityOptions = useMemo(() => ([
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ]), []);

  const genderOptions = useMemo(() => ([
    { value: "All", label: "All Members" },
    { value: "Male", label: "Male Only" },
    { value: "Female", label: "Female Only" },
  ]), []);

  const paymentStatusOptions = useMemo(() => ([
    { value: "All", label: "All Statuses" },
    { value: "Paid", label: "Paid Members" },
    { value: "Pending", label: "Pending Payments" },
  ]), []);

  return (
    <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-700/50 text-white">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-yellow-300 mb-6 pb-3 border-b border-amber-700/50">
        {isEditing ? "Edit Announcement" : "Send Bulk Announcement"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Announcement Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., Gym Holiday Hours, New Class Alert"
            disabled={isSubmitting}
          />
          {formErrors.title && <p className={errorClass}>{formErrors.title}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className={labelClass}>
            Message Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter the detailed message for your members. You can include placeholders like {memberName} and {gymName}."
            disabled={isSubmitting}
          ></textarea>
          {formErrors.message && <p className={errorClass}>{formErrors.message}</p>}
        </div>

        {/* Type & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="announcementType" className={labelClass}>
              Announcement Type
            </label>
            <select
              id="announcementType"
              name="announcementType"
              value={formData.announcementType}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {announcementTypeOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className={labelClass}>
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="filterGender" className={labelClass}>
              Filter by Gender
            </label>
            <select
              id="filterGender"
              name="filterGender"
              value={formData.filterGender}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterPaymentStatus" className={labelClass}>
              Filter by Payment Status
            </label>
            <select
              id="filterPaymentStatus"
              name="filterPaymentStatus"
              value={formData.filterPaymentStatus}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview Message */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-inner p-4 border border-amber-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-yellow-300">Message Preview</h3>
            <button
              type="button"
              onClick={handlePreviewMessage}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="mr-2 h-4 w-4" />
              {loading && !previewMessage ? 'Generating...' : 'Generate Preview'}
            </button>
          </div>
          {previewMessage ? (
            <div className="bg-gray-700/50 p-4 rounded-lg border border-yellow-600 text-white">
              <p className="whitespace-pre-wrap text-amber-100">{previewMessage.message}</p>
              <p className="mt-3 text-sm text-yellow-300">
                Characters: {previewMessage.characterCount} | Estimated SMS Parts: {previewMessage.estimatedSMS}
              </p>
            </div>
          ) : (
            <p className="text-orange-300 italic">Click "Generate Preview" to see how your message will look.</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <RefreshCcw className="animate-spin mr-3 h-5 w-5" />
            ) : isEditing ? (
              <Save className="mr-3 h-5 w-5" />
            ) : (
              <Send className="mr-3 h-5 w-5" />
            )}
            {isSubmitting ? (isEditing ? 'Updating...' : 'Sending...') : (isEditing ? 'Update Announcement' : 'Send Announcement')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
