// src/Advance/Features/BulkAnnouncement/Ui/SendAnnouncementModal.jsx

import { useState } from 'react';
import { X, Send, Eye, Loader, Users, AlertCircle } from 'lucide-react';
import { sendAnnouncement, previewAnnouncementMessage } from '../service/announcementService';

const SendAnnouncementModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    announcementType: 'General',
    priority: 'Medium',
    filterGender: 'All',
    filterPaymentStatus: 'All'
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const announcementTypes = [
    'General',
    'Holiday',
    'Event',
    'Maintenance',
    'Fees Reminder',
    'New Class',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreview = async () => {
    if (!formData.title || !formData.message) {
      alert('Please fill in title and message first');
      return;
    }

    try {
      setPreviewLoading(true);
      const response = await previewAnnouncementMessage(
        formData.title,
        formData.message,
        formData.priority
      );
      
      if (response.success) {
        setPreviewMessage(response.data.message);
        setShowPreview(true);
      }
    } catch (error) {
      alert(error.message || 'Failed to preview message');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    if (!window.confirm('Are you sure you want to send this announcement to all members?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await sendAnnouncement(formData);
      
      if (response.success) {
        alert(`Announcement sent successfully!\nTotal: ${response.data.totalMembers} members\nSuccessful: ${response.data.successfulDeliveries}\nFailed: ${response.data.failedDeliveries}`);
        onSuccess();
      }
    } catch (error) {
      alert(error.message || 'Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Send Announcement</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Gym Closed Tomorrow"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your announcement message here..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
                maxLength={1500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/1500 characters
              </p>
            </div>

            {/* Type and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Type
                </label>
                <select
                  name="announcementType"
                  value={formData.announcementType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {announcementTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Member Filters
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="filterGender"
                    value={formData.filterGender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Members</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    name="filterPaymentStatus"
                    value={formData.filterPaymentStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Members</option>
                    <option value="Paid">Paid Only</option>
                    <option value="Pending">Pending Only</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  This announcement will be sent to all members matching the selected filters via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Message Preview</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {previewMessage}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={handlePreview}
              disabled={previewLoading || !formData.title || !formData.message}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {previewLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Preview
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to All
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendAnnouncementModal;