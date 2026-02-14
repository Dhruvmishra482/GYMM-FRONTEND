// BroadcastModal.jsx (for Diet Plan)
import React, { useState, useCallback, useMemo } from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer';
import useDietPlanStore from '../store/useDietPlanStore';
import { toast } from 'react-hot-toast';
import { Send, RefreshCcw, AlertCircle } from 'lucide-react'; // Added AlertCircle

const BroadcastModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const { broadcastDietPlan, loading } = useDietPlanStore();
  const [filterGender, setFilterGender] = useState('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All');

  const handleBroadcast = useCallback(async () => {
    if (!plan?._id) {
      toast.error("No diet plan selected for broadcast.");
      return;
    }

    const filters = {
      filterGender,
      filterPaymentStatus,
    };

    try {
      const response = await broadcastDietPlan(plan._id, filters);
      if (response.success) {
        toast.success(response.message || "Diet plan broadcasted successfully!");
        onSuccess(response.data);
        onClose();
      } else {
        toast.error(response.message || "Failed to broadcast diet plan.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during broadcast.");
    }
  }, [plan, filterGender, filterPaymentStatus, broadcastDietPlan, onSuccess, onClose]);

  const isBroadcasting = loading;

  const baseInputClass = "w-full p-3 bg-gray-700/50 border border-emerald-600 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-inner";
  const labelClass = "block text-sm font-medium text-teal-200 mb-1";
  const errorClass = "mt-1 text-xs font-medium flex items-center gap-1 text-red-400"; // Added for consistency

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
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Broadcast: ${plan?.planTitle}`} maxWidth={600} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <div className="relative z-10 p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-700/50 text-white">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 mb-6 pb-3 border-b border-emerald-700/50">
            Broadcast Diet Plan: <span className="text-white">{plan?.planTitle}</span>
        </h2>
        
        <p className="text-teal-200 mb-6">Select filters to broadcast this diet plan to specific members.</p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="filterGender" className={labelClass}>
              Filter by Gender
            </label>
            <select
              id="filterGender"
              name="filterGender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className={baseInputClass}
              disabled={isBroadcasting}
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
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className={baseInputClass}
              disabled={isBroadcasting}
            >
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-emerald-600 to-lime-700 hover:from-emerald-700 hover:to-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isBroadcasting ? (
              <RefreshCcw className="animate-spin mr-3 h-5 w-5" />
            ) : (
              <Send className="mr-3 h-5 w-5" />
            )}
            {isBroadcasting ? 'Broadcasting...' : 'Broadcast Plan'}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default BroadcastModal;