import React, { useState, useCallback, useMemo, useEffect } from "react";
import useDietPlanStore from "../store/useDietPlanStore";
import { toast } from "react-hot-toast";
import { Save, RefreshCcw } from "lucide-react";

const MEAL_SECTIONS = [
  { key: "earlyMorning", label: "Early Morning" },
  { key: "breakfast", label: "Breakfast" },
  { key: "midMorning", label: "Mid Morning" },
  { key: "lunch", label: "Lunch" },
  { key: "eveningSnack", label: "Evening Snack" },
  { key: "dinner", label: "Dinner" },
  { key: "beforeBed", label: "Before Bed" },
];

const createEmptyFormData = () => ({
  planTitle: "",
  planType: "General Health",
  targetAudience: "All Members",
  planDuration: "1 month",
  mealPlan: {},
  waterIntake: "",
  generalInstructions: "",
  dosList: [],
  dontsList: [],
  supplements: [],
  validFrom: "",
  validTill: "",
});

const normalizeMealValue = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") {
    const preferredKeys = ["items", "description", "details", "meal", "food", "note"];
    for (const key of preferredKeys) {
      if (typeof value[key] === "string" && value[key].trim()) {
        return value[key];
      }
      if (Array.isArray(value[key]) && value[key].length > 0) {
        return value[key].map((item) => String(item)).join(", ");
      }
    }
  }
  return "";
};

const normalizeMealPlan = (mealPlan) => {
  if (!mealPlan) return {};

  if (typeof mealPlan === "string") {
    const parsed = {};
    mealPlan.split(",").forEach((meal) => {
      const parts = meal.split(":").map((segment) => segment.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        parsed[parts[0]] = parts[1];
      }
    });
    return parsed;
  }

  if (typeof mealPlan === "object") {
    return Object.entries(mealPlan).reduce((acc, [key, value]) => {
      acc[key] = normalizeMealValue(value);
      return acc;
    }, {});
  }

  return {};
};

const DietPlanForm = ({ initialData = null, isEditMode = false, onSaveSuccess }) => {
  const { createDietPlan, updateDietPlan, loading, error, clearError } =
    useDietPlanStore();

  const [formData, setFormData] = useState(createEmptyFormData);
  const [selectedMealSections, setSelectedMealSections] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode && initialData && initialData._id) {
      const normalizedMealPlan = normalizeMealPlan(initialData.mealPlan);
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        mealPlan: normalizedMealPlan,
        dosList: initialData.dosList || [],
        dontsList: initialData.dontsList || [],
        supplements: initialData.supplements || [],
        validFrom: initialData.validFrom
          ? new Date(initialData.validFrom).toISOString().split("T")[0]
          : "",
        validTill: initialData.validTill
          ? new Date(initialData.validTill).toISOString().split("T")[0]
          : "",
      }));
      setSelectedMealSections(Object.keys(normalizedMealPlan));
      return;
    }

    setFormData(createEmptyFormData());
    setSelectedMealSections([]);
  }, [isEditMode, initialData]);

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

  const handleArrayChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  }, []);

  const handleMealSectionToggle = useCallback((sectionKey) => {
    setSelectedMealSections((prev) => {
      if (prev.includes(sectionKey)) {
        setFormData((current) => {
          const nextMealPlan = { ...current.mealPlan };
          delete nextMealPlan[sectionKey];
          return { ...current, mealPlan: nextMealPlan };
        });
        return prev.filter((key) => key !== sectionKey);
      }

      setFormData((current) => ({
        ...current,
        mealPlan: { ...current.mealPlan, [sectionKey]: current.mealPlan[sectionKey] || "" },
      }));
      return [...prev, sectionKey];
    });
  }, []);

  const handleMealInputChange = useCallback((sectionKey, value) => {
    setFormData((prev) => ({
      ...prev,
      mealPlan: {
        ...prev.mealPlan,
        [sectionKey]: value,
      },
    }));

    const fieldErrorKey = `meal_${sectionKey}`;
    if (formErrors[fieldErrorKey]) {
      setFormErrors((prev) => ({ ...prev, [fieldErrorKey]: "" }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.planTitle.trim()) {
      errors.planTitle = "Plan title is required.";
    }

    if (selectedMealSections.length === 0) {
      errors.mealSections = "Select at least one meal section.";
    }

    selectedMealSections.forEach((sectionKey) => {
      if (!formData.mealPlan?.[sectionKey]?.trim()) {
        errors[`meal_${sectionKey}`] = "This meal section is required.";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, selectedMealSections]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        toast.error("Please correct the form errors.");
        return;
      }

      const payload = { ...formData };

      payload.dosList = (payload.dosList || [])
        .map((item) => item?.trim())
        .filter(Boolean);
      payload.dontsList = (payload.dontsList || [])
        .map((item) => item?.trim())
        .filter(Boolean);
      payload.supplements = (payload.supplements || [])
        .map((item) => item?.trim())
        .filter(Boolean);

      payload.mealPlan = selectedMealSections.reduce((acc, sectionKey) => {
        acc[sectionKey] = payload.mealPlan?.[sectionKey]?.trim() || "";
        return acc;
      }, {});

      if (payload.validFrom) payload.validFrom = new Date(payload.validFrom).toISOString();
      if (payload.validTill) payload.validTill = new Date(payload.validTill).toISOString();

      let res;
      if (isEditMode) {
        res = await updateDietPlan(initialData._id, payload);
      } else {
        res = await createDietPlan(payload);
      }

      if (res && res.success) {
        toast.success(res.message);
        if (!isEditMode) {
          setFormData(createEmptyFormData());
          setSelectedMealSections([]);
          setFormErrors({});
        }
        onSaveSuccess && onSaveSuccess(res.data);
      }
    },
    [
      formData,
      selectedMealSections,
      isEditMode,
      initialData,
      createDietPlan,
      updateDietPlan,
      validateForm,
      onSaveSuccess,
    ]
  );

  const isSubmitting = loading;

  const baseInputClass =
    "w-full p-3 bg-gray-700/50 border border-emerald-600 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-inner";
  const labelClass = "block text-sm font-medium text-teal-200 mb-1";
  const errorClass = "mt-1 text-xs font-medium flex items-center gap-1 text-red-400";

  const planTypeOptions = useMemo(
    () => [
      { value: "Weight Loss", label: "Weight Loss" },
      { value: "Weight Gain", label: "Weight Gain" },
      { value: "Muscle Building", label: "Muscle Building" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "General Health", label: "General Health" },
      { value: "Custom", label: "Custom" },
    ],
    []
  );

  const targetAudienceOptions = useMemo(
    () => [
      { value: "All Members", label: "All Members" },
      { value: "Male Only", label: "Male Only" },
      { value: "Female Only", label: "Female Only" },
      { value: "Beginners", label: "Beginners" },
      { value: "Advanced", label: "Advanced" },
      { value: "Custom Selection", label: "Custom Selection" },
    ],
    []
  );

  const planDurationOptions = useMemo(
    () => [
      { value: "1 week", label: "1 Week" },
      { value: "2 weeks", label: "2 Weeks" },
      { value: "1 month", label: "1 Month" },
      { value: "3 months", label: "3 Months" },
      { value: "Ongoing", label: "Ongoing" },
    ],
    []
  );

  return (
    <div className="relative z-10 mx-auto max-w-4xl rounded-2xl border border-emerald-700/50 bg-gray-900/80 p-6 text-white shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 border-b border-emerald-700/50 pb-3 text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text">
        {isEditMode ? "Edit Diet Plan" : "Create New Diet Plan"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className={`${baseInputClass} ${
              formErrors.planTitle ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="e.g., Keto Diet, High Protein Plan"
            disabled={isSubmitting}
          />
          {formErrors.planTitle && <p className={errorClass}>{formErrors.planTitle}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              {planTypeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                  {option.label}
                </option>
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
              {targetAudienceOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            {planDurationOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Meal Sections <span className="text-red-500">*</span>
          </label>
          <p className="mb-3 text-xs text-emerald-200">
            Select only the meal slots you want to include in this plan.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {MEAL_SECTIONS.map((section) => (
              <label
                key={section.key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-700/50 bg-gray-800/40 px-3 py-2 text-sm text-emerald-100"
              >
                <input
                  type="checkbox"
                  checked={selectedMealSections.includes(section.key)}
                  onChange={() => handleMealSectionToggle(section.key)}
                  disabled={isSubmitting}
                  className="h-4 w-4 accent-emerald-500"
                />
                {section.label}
              </label>
            ))}
          </div>
          {formErrors.mealSections && <p className={errorClass}>{formErrors.mealSections}</p>}
        </div>

        {selectedMealSections.length > 0 && (
          <div className="space-y-4 rounded-xl border border-emerald-700/50 bg-gray-800/30 p-4">
            <h3 className="text-sm font-semibold text-emerald-200">Meal Content</h3>
            {selectedMealSections.map((sectionKey) => {
              const sectionMeta = MEAL_SECTIONS.find((section) => section.key === sectionKey);
              const errorKey = `meal_${sectionKey}`;
              return (
                <div key={sectionKey}>
                  <label className={labelClass}>
                    {sectionMeta?.label || sectionKey}
                    <span className="text-red-500"> *</span>
                  </label>
                  <textarea
                    rows="3"
                    value={formData.mealPlan?.[sectionKey] || ""}
                    onChange={(e) => handleMealInputChange(sectionKey, e.target.value)}
                    className={`${baseInputClass} ${
                      formErrors[errorKey] ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    placeholder={`Write ${sectionMeta?.label || sectionKey} meal details...`}
                    disabled={isSubmitting}
                  />
                  {formErrors[errorKey] && <p className={errorClass}>{formErrors[errorKey]}</p>}
                </div>
              );
            })}
          </div>
        )}

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
          />
        </div>

        <div>
          <label htmlFor="dosList" className={labelClass}>
            Dos List (comma-separated)
          </label>
          <textarea
            id="dosList"
            name="dosList"
            rows="2"
            value={formData.dosList.join(", ")}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Eat plenty of vegetables, Get enough sleep"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="dontsList" className={labelClass}>
            Dont's List (comma-separated)
          </label>
          <textarea
            id="dontsList"
            name="dontsList"
            rows="2"
            value={formData.dontsList.join(", ")}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Avoid processed foods, Don't skip meals"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="supplements" className={labelClass}>
            Supplements (comma-separated)
          </label>
          <textarea
            id="supplements"
            name="supplements"
            rows="2"
            value={formData.supplements.join(", ")}
            onChange={handleArrayChange}
            className={baseInputClass}
            placeholder="e.g., Multivitamin, Protein powder"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-emerald-600 to-lime-700 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-lime-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCcw className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-3 h-5 w-5" />
            )}
            {isEditMode
              ? isSubmitting
                ? "Updating..."
                : "Update Plan"
              : isSubmitting
              ? "Creating..."
              : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietPlanForm;
