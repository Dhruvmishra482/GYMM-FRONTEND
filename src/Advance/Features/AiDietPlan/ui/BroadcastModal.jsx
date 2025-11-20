// src/Advance/Features/AiDietPlan/Ui/BroadcastModal.jsx
import React, { useState } from 'react';
import { X, Send, Loader2, Users, CheckCircle, XCircle, Eye } from 'lucide-react';
import useDietPlanStore from '../store/useDietPlanStore';

const BroadcastModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const { broadcastDietPlan, previewDietPlanMessage, loading } = useDietPlanStore();
  
  const [filters, setFilters] = useState({
    filterGender: 'All',
    filterStatus: 'All',
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [broadcastResult, setBroadcastResult] = useState(null);

  const handlePreview = async () => {
    try {
      const data = await previewDietPlanMessage(plan._id);
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const handleBroadcast = async () => {
    if (!window.confirm('Are you sure you want to send this diet plan to members?')) {
      return;
    }

    try {
      const result = await broadcastDietPlan(plan._id, filters);
      setBroadcastResult(result);
    } catch (error) {
      console.error('Broadcast failed:', error);
    }
  };

  const handleClose = () => {
    if (broadcastResult) {
      onSuccess();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Broadcast Diet Plan</h2>
            <p className="text-green-100 text-sm mt-1">{plan.planTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {broadcastResult ? (
            /* Success Result */
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Broadcast Completed!
                </h3>
                <p className="text-gray-600">
                  Diet plan has been sent to members
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">
                    {broadcastResult.totalMembers}
                  </p>
                  <p className="text-sm text-gray-600">Total Members</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {broadcastResult.successfulDeliveries}
                  </p>
                  <p className="text-sm text-gray-600">Successful</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {broadcastResult.failedDeliveries}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Success Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {broadcastResult.successRate}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: broadcastResult.successRate }}
                  />
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Done
              </button>
            </div>
          ) : showPreview ? (
            /* Preview */
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Message Preview
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm text-gray-700 max-h-96 overflow-y-auto">
                  {previewData?.message}
                </div>
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                  <span>📝 {previewData?.characterCount} characters</span>
                  <span>💬 ~{previewData?.estimatedSMS} SMS</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleBroadcast}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Confirm & Send
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Filters & Options */
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Select Target Audience
                </h3>

                <div className="space-y-4">
                  {/* Gender Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender Filter
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['All', 'Male', 'Female'].map((gender) => (
                        <button
                          key={gender}
                          onClick={() => setFilters({ ...filters, filterGender: gender })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filters.filterGender === gender
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['All', 'Paid', 'Pending'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilters({ ...filters, filterStatus: status })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filters.filterStatus === status
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2">Plan Details</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Type:</span> {plan.planType}</p>
                  <p><span className="font-medium">Duration:</span> {plan.planDuration}</p>
                  <p><span className="font-medium">Target:</span> {plan.targetAudience}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePreview}
                  className="flex-1 px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>
                <button
                  onClick={handleBroadcast}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Now
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

export default BroadcastModal;