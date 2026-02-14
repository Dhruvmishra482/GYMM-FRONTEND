// DietPlanForm.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import useDietPlanStore from "../store/useDietPlanStore";
import { toast } from "react-hot-toast";
import { Save, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";

const DietPlanForm = ({ initialData = {}, isEditMode = false, onSaveSuccess }) => {
  const { createDietPlan, updateDietPlan, loading, error, clearError } = useDietPlanStore();

  const [formData, setFormData] = useState({
    planTitle: "",
    planType: "General Health",
    targetAudience: "All Members",
    planDuration: "1 month",
    mealPlan: "", // Changed to string for easier form handling
    waterIntake: "",
    generalInstructions: "",
    dosList: [],
    dontsList: [],
    supplements: [],
    validFrom: "",
    validTill: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode && initialData && initialData._id) { // Ensure initialData and _id are present for editing
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Convert mealPlan object to string for display in textarea
        mealPlan: typeof initialData.mealPlan === 'object' && initialData.mealPlan !== null && Object.keys(initialData.mealPlan).length > 0
          ? Object.entries(initialData.mealPlan).map(([mealType, items]) => {
              // Assuming 'items' is a string or can be stringified simply
              return `${mealType}: ${String(items)}`;
            }).join(', ')
          : (initialData.mealPlan || ""),
        // Ensure arrays are initialized correctly
        dosList: initialData.dosList || [],
        dontsList: initialData.dontsList || [],
        supplements: initialData.supplements || [],
        validFrom: initialData.validFrom ? new Date(initialData.validFrom).toISOString().split('T')[0] : "",
        validTill: initialData.validTill ? new Date(initialData.validTill).toISOString().split('T')[0] : "",
      }));
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        planTitle: "",
        planType: "General Health",
        targetAudience: "All Members",
        planDuration: "1 month",
        mealPlan: "",
        waterIntake: "",
        generalInstructions: "",
        dosList: [],
        dontsList: [],
        supplements: [],
        validFrom: "",
        validTill: "",
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) clearError();
  }, [formErrors, error, clearError]);

  // For array inputs (dosList, dontsList, supplements)
  const handleArrayChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()).filter(Boolean) }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.planTitle.trim()) errors.planTitle = "Plan title is required.";
    if (!formData.mealPlan.trim()) {
        errors.mealPlan = "Meal plan is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors.");
      return;
    }

    let payload = { ...formData };
    // Convert mealPlan string back to object for submission
    const parsedMealPlan = {};
    if (typeof payload.mealPlan === 'string' && payload.mealPlan.trim()) {
      payload.mealPlan.split(',').forEach(meal => {
          const parts = meal.split(':').map(s => s.trim());
          if (parts.length === 2 && parts[0] && parts[1]) {
              parsedMealPlan[parts[0]] = parts[1];
          }
      });
    }
    payload.mealPlan = parsedMealPlan;

    // Convert dates to ISO format if they exist
    if (payload.validFrom) payload.validFrom = new Date(payload.validFrom).toISOString();
    if (payload.validTill) payload.validTill = new Date(payload.validTill).toISOString();


    let res;
    if (isEditMode) {
      res = await updateDietPlan(initialData._id, payload);
    } else {
      res = await createDietPlan(payload);
    }
    
    if (res && res.success) { // Check for res and res.success
      toast.success(res.message);
      if (!isEditMode) {
        setFormData({
            planTitle: "",
            planType: "General Health",
            targetAudience: "All Members",
            planDuration: "1 month",
            mealPlan: "",
            waterIntake: "",
            generalInstructions: "",
            dosList: [],
            dontsList: [],
            supplements: [],
            validFrom: "",
            validTill: "",
        });
        setFormErrors({});
      }
      onSaveSuccess && onSaveSuccess(res.data);
    }
  }, [formData, isEditMode, initialData, createDietPlan, updateDietPlan, validateForm, onSaveSuccess]);

  const isSubmitting = loading;

  const baseInputClass = "w-full p-3 bg-gray-700/50 border border-emerald-600 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-inner";
  const labelClass = "block text-sm font-medium text-teal-200 mb-1";
  const errorClass = "mt-1 text-xs font-medium flex items-center gap-1 text-red-400";

  const planTypeOptions = useMemo(() => ([
    { value: "Weight Loss", label: "Weight Loss" },
    { value: "Weight Gain", label: "Weight Gain" },
    { value: "Muscle Building", label: "Muscle Building" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "General Health", label: "General Health" },
    { value: "Custom", label: "Custom" },
  ]), []);

  const targetAudienceOptions = useMemo(() => ([
    { value: "All Members", label: "All Members" },
    { value: "Male Only", label: "Male Only" },
    { value: "Female Only", label: "Female Only" },
    { value: "Beginners", label: "Beginners" },
    { value: "Advanced", label: "Advanced" },
    { value: "Custom Selection", label: "Custom Selection" },
  ]), []);

  const planDurationOptions = useMemo(() => ([
    { value: "1 week", label: "1 Week" },
    { value: "2 weeks", label: "2 Weeks" },
    { value: "1 month", label: "1 Month" },
    { value: "3 months", label: "3 Months" },
    { value: "Ongoing", label: "Ongoing" },
  ]), []);

  return (
    <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-700/50 text-white">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 mb-6 pb-3 border-b border-emerald-700/50">
        {isEditMode ? "Edit Diet Plan" : "Create New Diet Plan"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Title */}
        <div>
          <label htmlFor="planTitle" className={labelClass}>
            Plan Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="planTitle"
            name="planTitle"
            value={formData.planTitle}
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.planTitle ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., Keto Diet, High Protein Plan"
            disabled={isSubmitting}
          />
          {formErrors.planTitle && <p className={errorClass}>{formErrors.planTitle}</p>}
        </div>

        {/* Plan Type & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="planType" className={labelClass}>
              Plan Type
            </label>
            <select
              id="planType"
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {planTypeOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetAudience" className={labelClass}>
              Target Audience
            </label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {targetAudienceOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Plan Duration */}
        <div>
          <label htmlFor="planDuration" className={labelClass}>
            Plan Duration
          </label>
          <select
            id="planDuration"
            name="planDuration"
            value={formData.planDuration}
            onChange={handleChange}
            className={baseInputClass}
            disabled={isSubmitting}
          >
            {planDurationOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
            ))}
          </select>
        </div>

        {/* Meal Plan (Simplified) */}
        <div>
          <label htmlFor="mealPlan" className={labelClass}>
            Meal Plan (e.g., Breakfast: Eggs, Lunch: Chicken, Dinner: Salad) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="mealPlan"
            name="mealPlan"
            rows="6"
            value={formData.mealPlan} // Directly use formData.mealPlan string
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.mealPlan ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Describe the meal plan for your members. Separate meals with commas."
            disabled={isSubmitting}
          ></textarea>
          {formErrors.mealPlan && <p className={errorClass}>{formErrors.mealPlan}</p>}
        </div>

        {/* Water Intake */}
        <div>
          <label htmlFor="waterIntake" className={labelClass}>
            Water Intake Recommendation
          </label>
          <input
            type="text"
            id="waterIntake"
            name="waterIntake"
            value={formData.waterIntake}
            onChange={handleChange}
            className={baseInputClass}
            placeholder="e.g., Drink 3-4 liters of water daily."
            disabled={isSubmitting}
          />
        </div>

        {/* General Instructions */}
        <div>
          <label htmlFor="generalInstructions" className={labelClass}>
            General Instructions
          </label>
          <textarea
            id="generalInstructions"
            name="generalInstructions"
            rows="4"
            value={formData.generalInstructions}
            onChange={handleChange}
            className={baseInputClass}
            placeholder="Any general advice or tips for this diet plan."
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Dos List (Optional, simple text input for now) */}
        <div>
          <label htmlFor="dosList" className={labelClass}>
            Dos List (comma-separated)
          </label>
          <textarea
            id="dosList"
            name="dosList"
            rows="2"
            value={formData.dosList.join(', ')}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Eat plenty of vegetables, Get enough sleep"
            disabled={isSubmitting}
          />
        </div>

        {/* Donts List (Optional, simple text input for now) */}
        <div>
          <label htmlFor="dontsList" className={labelClass}>
            Dont's List (comma-separated)
          </label>
          <textarea
            id="dontsList"
            name="dontsList"
            rows="2"
            value={formData.dontsList.join(', ')}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Avoid processed foods, Don't skip meals"
            disabled={isSubmitting}
          />
        </div>

        {/* Supplements (Optional, simple text input for now) */}
        <div>
          <label htmlFor="supplements" className={labelClass}>
            Supplements (comma-separated)
          </label>
          <textarea
            id="supplements"
            name="supplements"
            rows="2"
            value={formData.supplements.join(', ')}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Multivitamin, Protein powder"
            disabled={isSubmitting}
          />
        </div>

        {/* Valid From and Valid Till Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="validFrom" className={labelClass}>
              Valid From
            </label>
            <input
              type="date"
              id="validFrom"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="validTill" className={labelClass}>
              Valid Till
            </label>
            <input
              type="date"
              id="validTill"
              name="validTill"
              value={formData.validTill}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-emerald-600 to-lime-700 hover:from-emerald-700 hover:to-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <RefreshCcw className="animate-spin mr-3 h-5 w-5" />
            ) : (
              <Save className="mr-3 h-5 w-5" />
            )}
            {isEditMode ? (isSubmitting ? 'Updating...' : 'Update Plan') : (isSubmitting ? 'Creating...' : 'Create Plan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietPlanForm;
