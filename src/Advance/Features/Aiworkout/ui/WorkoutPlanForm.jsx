import React, { useState, useCallback, useMemo, useEffect } from "react";
import useWorkoutPlanStore from "../store/useWorkoutPlanStore";
import { toast } from "react-hot-toast";
import { Save, RefreshCcw, AlertCircle } from "lucide-react";

const DAY_SECTIONS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DAY_ALIASES = {
  mon: "monday",
  monday: "monday",
  tue: "tuesday",
  tues: "tuesday",
  tuesday: "tuesday",
  wed: "wednesday",
  wednesday: "wednesday",
  thu: "thursday",
  thur: "thursday",
  thursday: "thursday",
  fri: "friday",
  friday: "friday",
  sat: "saturday",
  saturday: "saturday",
  sun: "sunday",
  sunday: "sunday",
};

const createEmptyFormData = () => ({
  planTitle: "",
  planType: "General Fitness",
  targetAudience: "All Members",
  difficultyLevel: "Beginner",
  planDuration: "4 weeks",
  workoutsPerWeek: 3,
  weeklySchedule: {},
  generalInstructions: "",
  importantTips: [],
  safetyGuidelines: [],
  progressionNotes: "",
  recoveryTips: [],
  validFrom: "",
  validTill: "",
});

const normalizeDayScheduleValue = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (value && typeof value === "object") {
    if (typeof value.focus === "string" && value.focus.trim()) return value.focus.trim();
    const fallbackKeys = ["details", "description", "note", "workout", "items"];
    for (const key of fallbackKeys) {
      const nestedValue = value[key];
      if (typeof nestedValue === "string" && nestedValue.trim()) return nestedValue.trim();
      if (Array.isArray(nestedValue) && nestedValue.length > 0) {
        return nestedValue.map((item) => String(item)).join(", ");
      }
    }
  }
  return "";
};

const normalizeWeeklySchedule = (weeklySchedule) => {
  if (!weeklySchedule) return {};

  if (typeof weeklySchedule === "string") {
    const parsed = {};
    weeklySchedule.split(",").forEach((chunk) => {
      const parts = chunk.split(":").map((segment) => segment.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        const key = DAY_ALIASES[parts[0].toLowerCase()] || parts[0].toLowerCase();
        parsed[key] = parts[1];
      }
    });
    return parsed;
  }

  if (typeof weeklySchedule === "object") {
    return Object.entries(weeklySchedule).reduce((acc, [key, value]) => {
      const dayKey = DAY_ALIASES[key.toLowerCase()] || key.toLowerCase();
      acc[dayKey] = normalizeDayScheduleValue(value);
      return acc;
    }, {});
  }

  return {};
};

const WorkoutPlanForm = ({ initialData = null, isEditMode = false, onSaveSuccess }) => {
  const { createWorkoutPlan, updateWorkoutPlan, loading, error, clearError } = useWorkoutPlanStore();

  const [formData, setFormData] = useState(createEmptyFormData);
  const [selectedDays, setSelectedDays] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode && initialData && initialData._id) {
      const normalizedSchedule = normalizeWeeklySchedule(initialData.weeklySchedule);
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        weeklySchedule: normalizedSchedule,
        importantTips: initialData.importantTips || [],
        safetyGuidelines: initialData.safetyGuidelines || [],
        recoveryTips: initialData.recoveryTips || [],
        validFrom: initialData.validFrom ? new Date(initialData.validFrom).toISOString().split("T")[0] : "",
        validTill: initialData.validTill ? new Date(initialData.validTill).toISOString().split("T")[0] : "",
      }));
      setSelectedDays(Object.keys(normalizedSchedule));
      return;
    }

    setFormData(createEmptyFormData());
    setSelectedDays([]);
  }, [isEditMode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) clearError();
  }, [formErrors, error, clearError]);

  const handleNumberChange = useCallback((e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) || value === "") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : numValue }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (error) clearError();
    }
  }, [formErrors, error, clearError]);

  const handleDayToggle = useCallback((dayKey) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayKey)) {
        setFormData((current) => {
          const nextSchedule = { ...current.weeklySchedule };
          delete nextSchedule[dayKey];
          return { ...current, weeklySchedule: nextSchedule };
        });
        return prev.filter((key) => key !== dayKey);
      }

      setFormData((current) => ({
        ...current,
        weeklySchedule: { ...current.weeklySchedule, [dayKey]: current.weeklySchedule[dayKey] || "" },
      }));
      return [...prev, dayKey];
    });
  }, []);

  const handleDayInputChange = useCallback((dayKey, value) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [dayKey]: value,
      },
    }));

    const errorKey = `day_${dayKey}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.planTitle.trim()) {
      errors.planTitle = "Plan title is required.";
    }

    if (!formData.workoutsPerWeek || formData.workoutsPerWeek < 1 || formData.workoutsPerWeek > 7) {
      errors.workoutsPerWeek = "Workouts per week must be between 1 and 7.";
    }

    if (selectedDays.length === 0) {
      errors.weeklySchedule = "Select at least one workout day.";
    }

    selectedDays.forEach((dayKey) => {
      if (!formData.weeklySchedule?.[dayKey]?.trim()) {
        errors[`day_${dayKey}`] = "This day plan is required.";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, selectedDays]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors.");
      return;
    }

    let payload = { ...formData };

    payload.importantTips = (payload.importantTips || []).map((item) => item?.trim()).filter(Boolean);
    payload.safetyGuidelines = (payload.safetyGuidelines || []).map((item) => item?.trim()).filter(Boolean);
    payload.recoveryTips = (payload.recoveryTips || []).map((item) => item?.trim()).filter(Boolean);

    payload.weeklySchedule = selectedDays.reduce((acc, dayKey) => {
      const dayPlan = payload.weeklySchedule?.[dayKey]?.trim() || "";
      acc[dayKey] = { focus: dayPlan };
      return acc;
    }, {});

    if (payload.validFrom) payload.validFrom = new Date(payload.validFrom).toISOString();
    if (payload.validTill) payload.validTill = new Date(payload.validTill).toISOString();

    let res;
    if (isEditMode) {
      res = await updateWorkoutPlan(initialData._id, payload);
    } else {
      res = await createWorkoutPlan(payload);
    }

    if (res && res.success) {
      toast.success(res.message);
      if (!isEditMode) {
        setFormData(createEmptyFormData());
        setSelectedDays([]);
        setFormErrors({});
      }
      onSaveSuccess && onSaveSuccess(res.data);
    }
  }, [formData, selectedDays, isEditMode, initialData, createWorkoutPlan, updateWorkoutPlan, validateForm, onSaveSuccess]);

  const isSubmitting = loading;

  const baseInputClass = "w-full p-3 bg-gray-700/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-inner";
  const labelClass = "block text-sm font-medium text-indigo-200 mb-1";
  const errorClass = "mt-1 text-xs font-medium flex items-center gap-1 text-red-400";

  const planTypeOptions = useMemo(() => ([
    { value: "Strength Training", label: "Strength Training" },
    { value: "Cardio Focus", label: "Cardio Focus" },
    { value: "Weight Loss", label: "Weight Loss" },
    { value: "Muscle Building", label: "Muscle Building" },
    { value: "Endurance", label: "Endurance" },
    { value: "General Fitness", label: "General Fitness" },
    { value: "Custom", label: "Custom" },
  ]), []);

  const targetAudienceOptions = useMemo(() => ([
    { value: "All Members", label: "All Members" },
    { value: "Male Only", label: "Male Only" },
    { value: "Female Only", label: "Female Only" },
    { value: "Beginners", label: "Beginners" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Custom Selection", label: "Custom Selection" },
  ]), []);

  const difficultyLevelOptions = useMemo(() => ([
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ]), []);

  const planDurationOptions = useMemo(() => ([
    { value: "1 week", label: "1 Week" },
    { value: "2 weeks", label: "2 Weeks" },
    { value: "4 weeks", label: "4 Weeks" },
    { value: "8 weeks", label: "8 Weeks" },
    { value: "12 weeks", label: "12 Weeks" },
    { value: "Ongoing", label: "Ongoing" },
  ]), []);

  return (
    <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-indigo-700/50 text-white">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 pb-3 border-b border-indigo-700/50">
        {isEditMode ? "Edit Workout Plan" : "Create New Workout Plan"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="planTitle" className={labelClass}>
            Plan Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="planTitle"
            name="planTitle"
            value={formData.planTitle}
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.planTitle ? "border-red-500 focus:ring-red-500" : ""}`}
            placeholder="e.g., Summer Shred, Beginner Full Body"
            disabled={isSubmitting}
          />
          {formErrors.planTitle && <p className={errorClass}><AlertCircle className="h-4 w-4" />{formErrors.planTitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="planType" className={labelClass}>Plan Type</label>
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
            <label htmlFor="targetAudience" className={labelClass}>Target Audience</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="difficultyLevel" className={labelClass}>Difficulty Level</label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className={baseInputClass}
              disabled={isSubmitting}
            >
              {difficultyLevelOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="planDuration" className={labelClass}>Plan Duration</label>
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
        </div>

        <div>
          <label htmlFor="workoutsPerWeek" className={labelClass}>
            Workouts Per Week <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="workoutsPerWeek"
            name="workoutsPerWeek"
            value={formData.workoutsPerWeek}
            onChange={handleNumberChange}
            className={`${baseInputClass} ${formErrors.workoutsPerWeek ? "border-red-500 focus:ring-red-500" : ""}`}
            placeholder="e.g., 3"
            min="1"
            max="7"
            disabled={isSubmitting}
          />
          {formErrors.workoutsPerWeek && <p className={errorClass}><AlertCircle className="h-4 w-4" />{formErrors.workoutsPerWeek}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Workout Days <span className="text-red-400">*</span>
          </label>
          <p className="mb-3 text-xs text-indigo-200">Select days first, then fill those day plans.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {DAY_SECTIONS.map((day) => (
              <label
                key={day.key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-700/50 bg-gray-800/40 px-3 py-2 text-sm text-indigo-100"
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.key)}
                  onChange={() => handleDayToggle(day.key)}
                  disabled={isSubmitting}
                  className="h-4 w-4 accent-indigo-500"
                />
                {day.label}
              </label>
            ))}
          </div>
          {formErrors.weeklySchedule && <p className={errorClass}><AlertCircle className="h-4 w-4" />{formErrors.weeklySchedule}</p>}
        </div>

        {selectedDays.length > 0 && (
          <div className="space-y-4 rounded-xl border border-indigo-700/50 bg-gray-800/30 p-4">
            <h3 className="text-sm font-semibold text-indigo-200">Weekly Day-wise Plan</h3>
            {selectedDays.map((dayKey) => {
              const dayMeta = DAY_SECTIONS.find((day) => day.key === dayKey);
              const errorKey = `day_${dayKey}`;
              return (
                <div key={dayKey}>
                  <label className={labelClass}>
                    {dayMeta?.label || dayKey}
                    <span className="text-red-400"> *</span>
                  </label>
                  <textarea
                    rows="3"
                    value={formData.weeklySchedule?.[dayKey] || ""}
                    onChange={(e) => handleDayInputChange(dayKey, e.target.value)}
                    className={`${baseInputClass} ${formErrors[errorKey] ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder={`Write ${dayMeta?.label || dayKey} workout focus/details...`}
                    disabled={isSubmitting}
                  />
                  {formErrors[errorKey] && <p className={errorClass}><AlertCircle className="h-4 w-4" />{formErrors[errorKey]}</p>}
                </div>
              );
            })}
          </div>
        )}

        <div>
          <label htmlFor="generalInstructions" className={labelClass}>General Instructions</label>
          <textarea
            id="generalInstructions"
            name="generalInstructions"
            rows="4"
            value={formData.generalInstructions}
            onChange={handleChange}
            className={baseInputClass}
            placeholder="Any general advice or safety precautions for this plan."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="progressionNotes" className={labelClass}>Progression Notes</label>
          <textarea
            id="progressionNotes"
            name="progressionNotes"
            rows="3"
            value={formData.progressionNotes}
            onChange={handleChange}
            className={baseInputClass}
            placeholder="Tips for increasing intensity or difficulty over time."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="importantTips" className={labelClass}>Important Tips (comma-separated)</label>
          <textarea
            id="importantTips"
            name="importantTips"
            rows="2"
            value={formData.importantTips.join(", ")}
            onChange={(e) => setFormData((p) => ({ ...p, importantTips: e.target.value.split(",").map((s) => s.trim()) }))}
            className={baseInputClass}
            placeholder="e.g., Stay hydrated, Listen to your body"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="safetyGuidelines" className={labelClass}>Safety Guidelines (comma-separated)</label>
          <textarea
            id="safetyGuidelines"
            name="safetyGuidelines"
            rows="2"
            value={formData.safetyGuidelines.join(", ")}
            onChange={(e) => setFormData((p) => ({ ...p, safetyGuidelines: e.target.value.split(",").map((s) => s.trim()) }))}
            className={baseInputClass}
            placeholder="e.g., Use proper form, Don't lift too heavy"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="recoveryTips" className={labelClass}>Recovery Tips (comma-separated)</label>
          <textarea
            id="recoveryTips"
            name="recoveryTips"
            rows="2"
            value={formData.recoveryTips.join(", ")}
            onChange={(e) => setFormData((p) => ({ ...p, recoveryTips: e.target.value.split(",").map((s) => s.trim()) }))}
            className={baseInputClass}
            placeholder="e.g., Stretch after workout, Get enough sleep"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="validFrom" className={labelClass}>Valid From</label>
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
            <label htmlFor="validTill" className={labelClass}>Valid Till</label>
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

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <RefreshCcw className="animate-spin mr-3 h-5 w-5" />
            ) : (
              <Save className="mr-3 h-5 w-5" />
            )}
            {isEditMode ? (isSubmitting ? "Updating..." : "Update Plan") : (isSubmitting ? "Creating..." : "Create Plan")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutPlanForm;
