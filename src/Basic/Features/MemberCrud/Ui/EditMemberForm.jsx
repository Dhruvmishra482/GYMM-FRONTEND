import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User, Calendar, DollarSign, Clock, CreditCard,
  CheckCircle, ArrowLeft, Loader2, Save, AlertCircle,
} from "lucide-react";

import { getMemberByPhone, editMember } from "../Service/memberService";

// ============================================
// CUSTOM HOOKS
// ============================================

// Hook for form data management
const useFormData = (initialData) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback((data) => {
    setFormData(data);
  }, []);

  return { formData, updateField, resetForm };
};

// Hook for member data fetching
const useMemberData = (phoneNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberData, setMemberData] = useState(null);

  const fetchMemberData = useCallback(async () => {
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

        const formattedData = {
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
        };

        setMemberData(formattedData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load member data");
      console.error("Error fetching member:", err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  return { loading, error, memberData, refetch: fetchMemberData };
};

// ============================================
// MEMOIZED COMPONENTS
// ============================================

const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading member data...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const ErrorDisplay = memo(({ error, onBack }) => (
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
        onClick={onBack}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-200"
      >
        Go Back
      </button>
    </div>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

const PageHeader = memo(({ onBack, memberName }) => (
  <div className="bg-gradient-to-r from-white via-blue-50 to-white shadow-md border-b border-blue-100">
    <div className="max-w-4xl mx-auto px-6 py-5">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
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
));

PageHeader.displayName = 'PageHeader';

const MemberInfoCard = memo(({ name, phone, email }) => (
  <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-md border border-blue-100 p-6 mb-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
        <User className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {name || "Member"}
        </h2>
        <p className="text-sm text-blue-600 font-medium">{phone}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  </div>
));

MemberInfoCard.displayName = 'MemberInfoCard';

const ErrorMessage = memo(({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

const FormField = memo(({ 
  label, 
  icon: Icon, 
  name, 
  type = "text",
  value, 
  onChange, 
  options = null,
  iconColor = "gray-400",
  hoverColor = "blue-500",
  focusColor = "blue-500"
}) => {
  const handleChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative group">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 text-${iconColor} w-5 h-5 group-hover:text-${hoverColor} transition-colors`} />
        
        {type === "select" ? (
          <>
            <select
              name={name}
              value={value}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${focusColor} focus:border-${focusColor} transition-all duration-200 hover:border-${hoverColor.replace('500', '400')} hover:shadow-sm appearance-none bg-white`}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-5 h-5 text-gray-400 group-hover:text-${hoverColor} transition-colors`}
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
          </>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${focusColor} focus:border-${focusColor} transition-all duration-200 hover:border-${hoverColor.replace('500', '400')} hover:shadow-sm`}
          />
        )}
      </div>
    </div>
  );
});

FormField.displayName = 'FormField';

const ReadOnlyField = memo(({ label, value, gradient = "from-gray-50 to-blue-50" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    <p className={`text-sm text-gray-900 bg-gradient-to-r ${gradient} px-3 py-2 rounded-lg border border-gray-100`}>
      {value || "N/A"}
    </p>
  </div>
));

ReadOnlyField.displayName = 'ReadOnlyField';

// ============================================
// MAIN COMPONENT
// ============================================

const EditMemberForm = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  
  const { loading, error: fetchError, memberData } = useMemberData(phoneNumber);
  const { formData, updateField, resetForm } = useFormData({
    name: "", email: "", phoneNo: "", age: "", gender: "",
    address: "", planDuration: "", feesAmount: "", nextDueDate: "",
    lastPaidOn: "", paymentStatus: "", joiningDate: "",
    paymentMethod: "", paymentNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Reset form when member data is loaded
  useEffect(() => {
    if (memberData) {
      resetForm(memberData);
    }
  }, [memberData, resetForm]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    updateField(name, value);
  }, [updateField]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSubmitError(null);

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
        setSubmitError(result.message);
      }
    } catch (err) {
      setSubmitError("Failed to update member");
      console.error("Error updating member:", err);
    } finally {
      setSaving(false);
    }
  }, [formData, phoneNumber, navigate]);

  // Memoized form fields configuration
  const editableFields = useMemo(() => [
    {
      label: "Age",
      icon: User,
      name: "age",
      type: "number",
      value: formData.age,
      iconColor: "gray-400",
      hoverColor: "blue-500",
      focusColor: "blue-500"
    },
    {
      label: "Plan Duration",
      icon: Calendar,
      name: "planDuration",
      type: "select",
      value: formData.planDuration,
      iconColor: "gray-400",
      hoverColor: "purple-500",
      focusColor: "purple-500",
      options: [
        { value: "", label: "Select plan duration" },
        { value: "1 month", label: "1 Month" },
        { value: "3 month", label: "3 Months" },
        { value: "6 month", label: "6 Months" },
        { value: "1 year", label: "12 Months" }
      ]
    },
    {
      label: "Fees Amount",
      icon: DollarSign,
      name: "feesAmount",
      type: "number",
      value: formData.feesAmount,
      iconColor: "gray-400",
      hoverColor: "green-500",
      focusColor: "green-500"
    },
    {
      label: "Next Due Date",
      icon: Clock,
      name: "nextDueDate",
      type: "date",
      value: formData.nextDueDate,
      iconColor: "gray-400",
      hoverColor: "orange-500",
      focusColor: "orange-500"
    },
    {
      label: "Last Paid On",
      icon: CreditCard,
      name: "lastPaidOn",
      type: "date",
      value: formData.lastPaidOn,
      iconColor: "gray-400",
      hoverColor: "indigo-500",
      focusColor: "indigo-500"
    },
    {
      label: "Payment Status",
      icon: CheckCircle,
      name: "paymentStatus",
      type: "select",
      value: formData.paymentStatus,
      iconColor: "gray-400",
      hoverColor: "emerald-500",
      focusColor: "emerald-500",
      options: [
        { value: "", label: "Select payment status" },
        { value: "Paid", label: "Paid" },
        { value: "Pending", label: "Pending" },
        { value: "Overdue", label: "Overdue" }
      ]
    }
  ], [formData]);

  const readOnlyFields = useMemo(() => [
    { label: "Name", value: formData.name, gradient: "from-gray-50 to-blue-50" },
    { label: "Email", value: formData.email, gradient: "from-gray-50 to-purple-50" },
    { label: "Phone Number", value: formData.phoneNo, gradient: "from-gray-50 to-green-50" },
    { 
      label: "Joining Date", 
      value: formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : "N/A",
      gradient: "from-gray-50 to-orange-50" 
    },
    { label: "Gender", value: formData.gender, gradient: "from-gray-50 to-indigo-50" },
    { label: "Address", value: formData.address, gradient: "from-gray-50 to-pink-50" }
  ], [formData]);

  if (loading) return <LoadingSpinner />;
  if (fetchError) return <ErrorDisplay error={fetchError} onBack={handleBack} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PageHeader onBack={handleBack} memberName={formData.name} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <MemberInfoCard 
          name={formData.name}
          phone={formData.phoneNo}
          email={formData.email}
        />

        <ErrorMessage message={submitError} />

        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h3 className="text-lg font-medium">Editable Information</h3>
            <p className="text-blue-100 mt-1">
              Update the fields below to modify member details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editableFields.map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium bg-gradient-to-r from-gray-700 to-blue-700 bg-clip-text text-transparent mb-4">
                Read-only Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {readOnlyFields.map((field, index) => (
                  <ReadOnlyField key={index} {...field} />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
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

export default memo(EditMemberForm);