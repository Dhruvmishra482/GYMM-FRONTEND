// WorkoutPlanForm.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import useWorkoutPlanStore from "../store/useWorkoutPlanStore";
import { toast } from "react-hot-toast";
import { Save, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react"; // Added AlertCircle

const WorkoutPlanForm = ({ initialData = {}, isEditMode = false, onSaveSuccess }) => {
  const { createWorkoutPlan, updateWorkoutPlan, loading, error, clearError } = useWorkoutPlanStore();

  const [formData, setFormData] = useState({
    planTitle: "",
    planType: "General Fitness",
    targetAudience: "All Members",
    difficultyLevel: "Beginner",
    planDuration: "4 weeks",
    workoutsPerWeek: 3,
    weeklySchedule: "", // Changed to string for easier form handling
    generalInstructions: "",
    importantTips: [],
    safetyGuidelines: [],
    progressionNotes: "",
    recoveryTips: [],
    validFrom: "",
    validTill: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode && initialData && initialData._id) { // Ensure initialData and _id are present for editing
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Convert weeklySchedule object to string for display in textarea
        weeklySchedule: typeof initialData.weeklySchedule === 'object' && Object.keys(initialData.weeklySchedule).length > 0
          ? Object.entries(initialData.weeklySchedule).map(([day, plan]) => {
              // Assuming 'plan' for a day is an object with a 'focus' property
              return `${day}: ${plan.focus || ''}`;
            }).join(', ')
          : (initialData.weeklySchedule || ""),
        // Ensure arrays are initialized correctly
        importantTips: initialData.importantTips || [],
        safetyGuidelines: initialData.safetyGuidelines || [],
        recoveryTips: initialData.recoveryTips || [],
        validFrom: initialData.validFrom ? new Date(initialData.validFrom).toISOString().split('T')[0] : "",
        validTill: initialData.validTill ? new Date(initialData.validTill).toISOString().split('T')[0] : "",
      }));
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        planTitle: "",
        planType: "General Fitness",
        targetAudience: "All Members",
        difficultyLevel: "Beginner",
        planDuration: "4 weeks",
        workoutsPerWeek: 3,
        weeklySchedule: "",
        generalInstructions: "",
        importantTips: [],
        safetyGuidelines: [],
        progressionNotes: "",
        recoveryTips: [],
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

  const handleNumberChange = useCallback((e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) || value === '') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : numValue }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      if (error) clearError();
    }
  }, [formErrors, error, clearError]);


  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.planTitle.trim()) errors.planTitle = "Plan title is required.";
    if (!formData.workoutsPerWeek || formData.workoutsPerWeek < 1 || formData.workoutsPerWeek > 7) {
      errors.workoutsPerWeek = "Workouts per week must be between 1 and 7.";
    }
    if (!formData.weeklySchedule.trim()) {
        errors.weeklySchedule = "Weekly schedule is required.";
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
    // Convert weeklySchedule string back to object for submission
    const parsedSchedule = {};
    if (typeof payload.weeklySchedule === 'string' && payload.weeklySchedule.trim()) {
      const dayMapping = {
          'Mon': 'monday', 'Tue': 'tuesday', 'Wed': 'wednesday', 'Thu': 'thursday',
          'Fri': 'friday', 'Sat': 'saturday', 'Sun': 'sunday'
      };
      payload.weeklySchedule.split(',').forEach(dayPlan => {
          const parts = dayPlan.split(':').map(s => s.trim());
          if (parts.length === 2 && parts[0] && parts[1]) {
              const dayFull = dayMapping[parts[0]] || parts[0].toLowerCase();
              parsedSchedule[dayFull] = { focus: parts[1] };
          }
      });
    }
    payload.weeklySchedule = parsedSchedule;

    // Convert dates to ISO format if they exist
    if (payload.validFrom) payload.validFrom = new Date(payload.validFrom).toISOString();
    if (payload.validTill) payload.validTill = new Date(payload.validTill).toISOString();


    let res;
    if (isEditMode) {
      res = await updateWorkoutPlan(initialData._id, payload);
    } else {
      res = await createWorkoutPlan(payload);
    }
    
    if (res && res.success) { // Check for res and res.success
      toast.success(res.message);
      if (!isEditMode) {
        setFormData({
            planTitle: "",
            planType: "General Fitness",
            targetAudience: "All Members",
            difficultyLevel: "Beginner",
            planDuration: "4 weeks",
            workoutsPerWeek: 3,
            weeklySchedule: "",
            generalInstructions: "",
            importantTips: [],
            safetyGuidelines: [],
            progressionNotes: "",
            recoveryTips: [],
            validFrom: "",
            validTill: "",
        });
        setFormErrors({});
      }
      onSaveSuccess && onSaveSuccess(res.data);
    }
  }, [formData, isEditMode, initialData, createWorkoutPlan, updateWorkoutPlan, validateForm, onSaveSuccess]);

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
        {/* Plan Title */}
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
            className={`${baseInputClass} ${formErrors.planTitle ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., Summer Shred, Beginner Full Body"
            disabled={isSubmitting}
          />
          {formErrors.planTitle && <p className={errorClass}><AlertCircle className="w-4 h-4" />{formErrors.planTitle}</p>}
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

        {/* Difficulty Level & Plan Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="difficultyLevel" className={labelClass}>
              Difficulty Level
            </label>
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
        </div>

        {/* Workouts Per Week */}
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
            className={`${baseInputClass} ${formErrors.workoutsPerWeek ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., 3"
            min="1"
            max="7"
            disabled={isSubmitting}
          />
          {formErrors.workoutsPerWeek && <p className={errorClass}><AlertCircle className="w-4 h-4" />{formErrors.workoutsPerWeek}</p>}
        </div>

        {/* Weekly Schedule (Simplified) */}
        <div>
          <label htmlFor="weeklySchedule" className={labelClass}>
            Weekly Schedule (e.g., Mon: Chest, Tue: Back, Wed: Legs) <span className="text-red-400">*</span>
          </label>
          <textarea
            id="weeklySchedule"
            name="weeklySchedule"
            rows="4"
            value={formData.weeklySchedule} // Directly use formData.weeklySchedule string
            onChange={handleChange}
            className={`${baseInputClass} ${formErrors.weeklySchedule ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Describe the weekly workout breakdown for your members."
            disabled={isSubmitting}
          ></textarea>
          {formErrors.weeklySchedule && <p className={errorClass}><AlertCircle className="w-4 h-4" />{formErrors.weeklySchedule}</p>}
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
            placeholder="Any general advice or safety precautions for this plan."
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Progression Notes */}
        <div>
          <label htmlFor="progressionNotes" className={labelClass}>
            Progression Notes
          </label>
          <textarea
            id="progressionNotes"
            name="progressionNotes"
            rows="3"
            value={formData.progressionNotes}
            onChange={handleChange}
            className={baseInputClass}
            placeholder="Tips for increasing intensity or difficulty over time."
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        {/* Important Tips (Optional, simple text input for now) */}
        <div>
          <label htmlFor="importantTips" className={labelClass}>
            Important Tips (comma-separated)
          </label>
          <textarea
            id="importantTips"
            name="importantTips"
            rows="2"
            value={formData.importantTips.join(', ')}
            onChange={(e) => setFormData(p => ({ ...p, importantTips: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            className={baseInputClass}
            placeholder="e.g., Stay hydrated, Listen to your body"
            disabled={isSubmitting}
          />
        </div>

        {/* Safety Guidelines (Optional, simple text input for now) */}
        <div>
          <label htmlFor="safetyGuidelines" className={labelClass}>
            Safety Guidelines (comma-separated)
          </label>
          <textarea
            id="safetyGuidelines"
            name="safetyGuidelines"
            rows="2"
            value={formData.safetyGuidelines.join(', ')}
            onChange={(e) => setFormData(p => ({ ...p, safetyGuidelines: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            className={baseInputClass}
            placeholder="e.g., Use proper form, Don't lift too heavy"
            disabled={isSubmitting}
          />
        </div>

        {/* Recovery Tips (Optional, simple text input for now) */}
        <div>
          <label htmlFor="recoveryTips" className={labelClass}>
            Recovery Tips (comma-separated)
          </label>
          <textarea
            id="recoveryTips"
            name="recoveryTips"
            rows="2"
            value={formData.recoveryTips.join(', ')}
            onChange={(e) => setFormData(p => ({ ...p, recoveryTips: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            className={baseInputClass}
            placeholder="e.g., Stretch after workout, Get enough sleep"
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
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"
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

export default WorkoutPlanForm;
