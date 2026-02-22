import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAnnouncementStore } from "../store/announcementStore";
import { toast } from "react-hot-toast";
import { Send, Eye, RefreshCcw, Save, AlertCircle } from "lucide-react";

const AnnouncementForm = ({ initialData, onClose, onSuccess }) => {
  const {
    sendAnnouncement,
    updateAnnouncement,
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
      return;
    }

    setFormData({
      title: "",
      message: "",
      announcementType: "General",
      priority: "Medium",
      filterGender: "All",
      filterPaymentStatus: "All",
    });
  }, [initialData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (error) clearError();
    },
    [formErrors, error, clearError]
  );

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.message.trim()) errors.message = "Message is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const res = isEditing
        ? await updateAnnouncement(initialData._id, formData)
        : await sendAnnouncement(formData);

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
    },
    [
      formData,
      isEditing,
      initialData,
      sendAnnouncement,
      updateAnnouncement,
      validateForm,
      onClose,
      onSuccess,
    ]
  );

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

  const baseInputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";
  const errorClass = "mt-1 flex items-center gap-1 text-xs font-medium text-red-600";

  const announcementTypeOptions = useMemo(
    () => [
      { value: "General", label: "General" },
      { value: "Emergency", label: "Emergency" },
      { value: "Promotion", label: "Promotion" },
      { value: "Update", label: "Update" },
    ],
    []
  );

  const priorityOptions = useMemo(
    () => [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
    []
  );

  const genderOptions = useMemo(
    () => [
      { value: "All", label: "All Members" },
      { value: "Male", label: "Male Only" },
      { value: "Female", label: "Female Only" },
    ],
    []
  );

  const paymentStatusOptions = useMemo(
    () => [
      { value: "All", label: "All Statuses" },
      { value: "Paid", label: "Paid Members" },
      { value: "Pending", label: "Pending Payments" },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-md sm:p-6">
      <h2 className="mb-6 border-b border-blue-100 pb-3 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-3xl">
        {isEditing ? "Edit Announcement" : "Send Bulk Announcement"}
      </h2>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className={`${baseInputClass} ${
              formErrors.title ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="e.g., Gym Holiday Hours, New Class Alert"
            disabled={isSubmitting}
          />
          {formErrors.title && (
            <p className={errorClass}>
              <AlertCircle className="h-3.5 w-3.5" />
              {formErrors.title}
            </p>
          )}
        </div>

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
            className={`${baseInputClass} ${
              formErrors.message ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="Enter the detailed message for your members. You can include placeholders like {memberName} and {gymName}."
            disabled={isSubmitting}
          />
          {formErrors.message && (
            <p className={errorClass}>
              <AlertCircle className="h-3.5 w-3.5" />
              {formErrors.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
              {announcementTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Message Preview</h3>
            <button
              type="button"
              onClick={handlePreviewMessage}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              {loading && !previewMessage ? "Generating..." : "Generate Preview"}
            </button>
          </div>

          {previewMessage ? (
            <div className="rounded-lg border border-blue-100 bg-white p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {previewMessage.message}
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Characters: {previewMessage.characterCount} | Estimated SMS
                Parts: {previewMessage.estimatedSMS}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">
              Click "Generate Preview" to see how your message will look.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Save className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Sending..."
              : isEditing
              ? "Update Announcement"
              : "Send Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
