import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";

import { getMemberByPhone, editMember } from "../Service/memberService";

const EditMemberForm = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    age: "",
    gender: "",
    address: "",
    planDuration: "",
    feesAmount: "",
    nextDueDate: "",
    lastPaidOn: "",
    paymentStatus: "",
    joiningDate: "",
    paymentMethod: "",
    paymentNotes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberData();
  }, [phoneNumber]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMemberByPhone(phoneNumber);

      if (result.success) {
        const member = result.data;

        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setFormData({
          name: member.name || "",
          email: member.email || "",
          phoneNo: member.phoneNo || phoneNumber,
          age: member.age ? member.age.toString() : "",
          gender: member.gender || "",
          address: member.address || "",
          planDuration: member.planDuration || "",
          feesAmount: member.feesAmount ? member.feesAmount.toString() : "",
          nextDueDate: formatDate(member.nextDueDate),
          lastPaidOn: formatDate(member.lastPaidOn),
          paymentStatus: member.paymentStatus || "",
          joiningDate: formatDate(member.joiningDate),
          paymentMethod: member.paymentMethod || "",
          paymentNotes: member.paymentNotes || "",
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load member data");
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const updateData = {};

      if (formData.age && formData.age.trim() !== "") {
        updateData.age = parseInt(formData.age);
      }

      if (formData.gender && formData.gender.trim() !== "") {
        updateData.gender = formData.gender;
      }

      if (formData.address && formData.address.trim() !== "") {
        updateData.address = formData.address.trim();
      }

      if (formData.planDuration && formData.planDuration.trim() !== "") {
        updateData.planDuration = formData.planDuration;
      }

      if (formData.feesAmount && formData.feesAmount.trim() !== "") {
        updateData.feesAmount = parseFloat(formData.feesAmount);
      }

      if (formData.nextDueDate && formData.nextDueDate.trim() !== "") {
        updateData.nextDueDate = formData.nextDueDate;
      }

      if (formData.lastPaidOn && formData.lastPaidOn.trim() !== "") {
        updateData.lastPaidOn = formData.lastPaidOn;
      }

      if (formData.paymentStatus && formData.paymentStatus.trim() !== "") {
        updateData.paymentStatus = formData.paymentStatus;
      }

      if (formData.paymentMethod && formData.paymentMethod.trim() !== "") {
        updateData.paymentMethod = formData.paymentMethod;
      }

      if (formData.paymentNotes && formData.paymentNotes.trim() !== "") {
        updateData.paymentNotes = formData.paymentNotes.trim();
      }

      const result = await editMember(phoneNumber, updateData);

      if (result.success) {
        alert("Member updated successfully!");
        navigate(-1);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to update warrior");
      console.error("Error updating member:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Member
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-white shadow-md border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Member
              </h1>
              <p className="text-sm text-gray-600">Update member information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Member Info Card with Gradient */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-md border border-blue-100 p-6 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {formData.name || "Member"}
              </h2>
              <p className="text-sm text-blue-600 font-medium">
                {formData.phoneNo}
              </p>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Edit Form with Gradient Header */}
        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h3 className="text-lg font-medium">Editable Information</h3>
            <p className="text-blue-100 mt-1">
              Update the fields below to modify member details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 hover:shadow-sm"
                  />
                </div>
              </div>

              {/* Plan Duration Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Duration
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors" />
                  <select
                    name="planDuration"
                    value={formData.planDuration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 hover:shadow-sm appearance-none bg-white"
                  >
                    <option value="">Select plan duration</option>
                    <option value="1 month">1 Month</option>
                    <option value="3 month">3 Months</option>
                    <option value="6 month">6 Months</option>
                    <option value="1 year">12 Months</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Fees Amount Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fees Amount
                </label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-500 transition-colors" />
                  <input
                    type="number"
                    name="feesAmount"
                    value={formData.feesAmount}
                    onChange={handleInputChange}
                    placeholder="Enter fees amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400 hover:shadow-sm"
                  />
                </div>
              </div>

              {/* Next Due Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Due Date
                </label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors" />
                  <input
                    type="date"
                    name="nextDueDate"
                    value={formData.nextDueDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-400 hover:shadow-sm"
                  />
                </div>
              </div>

              {/* Last Paid On Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Paid On
                </label>
                <div className="relative group">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                  <input
                    type="date"
                    name="lastPaidOn"
                    value={formData.lastPaidOn}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 hover:shadow-sm"
                  />
                </div>
              </div>

              {/* Payment Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <div className="relative group">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-emerald-400 hover:shadow-sm appearance-none bg-white"
                  >
                    <option value="">Select payment status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>{" "}
                    {/* Changed from "overdue" to "Overdue" */}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Read-only Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium bg-gradient-to-r from-gray-700 to-blue-700 bg-clip-text text-transparent mb-4">
                Read-only Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-purple-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-green-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.phoneNo || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Joining Date
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-orange-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.joiningDate
                      ? new Date(formData.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Gender
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-indigo-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <p className="text-sm text-gray-900 bg-gradient-to-r from-gray-50 to-pink-50 px-3 py-2 rounded-lg border border-gray-100">
                    {formData.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] hover:shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMemberForm;
