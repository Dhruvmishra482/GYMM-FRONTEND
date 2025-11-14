// src/Advance/Features/AiWorkoutPlan/Ui/CreateWorkoutPlanModal.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, Loader2, Save } from 'lucide-react';
import useWorkoutPlanStore from '../store/useWorkoutPlanStore';

const CreateWorkoutPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const { createWorkoutPlan, loading } = useWorkoutPlanStore();

  const emptyDay = {
    restDay: false,
    focus: '',
    exercises: [{ name: '', sets: 3, reps: '8-12', rest: '60s', notes: '' }],
    warmup: '',
    cooldown: '',
    cardio: '',
  };

  const [formData, setFormData] = useState({
    planTitle: '',
    planType: 'General Fitness',
    targetAudience: 'All Members',
    difficultyLevel: 'Beginner',
    planDuration: '4 weeks',
    workoutsPerWeek: 4,
    targetGoals: {
      description: '',
      primaryGoal: 'General Fitness',
      estimatedTimePerSession: '60-90 minutes',
      generalNotes: '',
    },
    weeklySchedule: {
      monday: { ...emptyDay },
      tuesday: { ...emptyDay },
      wednesday: { ...emptyDay },
      thursday: { ...emptyDay },
      friday: { ...emptyDay },
      saturday: { ...emptyDay },
      sunday: { ...emptyDay, restDay: true },
    },
    generalInstructions: '',
    importantTips: [''],
    safetyGuidelines: [''],
    progressionNotes: '',
    recoveryTips: [''],
  });

  const [activeDay, setActiveDay] = useState('monday');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty items
      const cleanedData = {
        ...formData,
        importantTips: formData.importantTips.filter(item => item.trim() !== ''),
        safetyGuidelines: formData.safetyGuidelines.filter(item => item.trim() !== ''),
        recoveryTips: formData.recoveryTips.filter(item => item.trim() !== ''),
        weeklySchedule: Object.keys(formData.weeklySchedule).reduce((acc, day) => {
          const dayData = formData.weeklySchedule[day];
          acc[day] = {
            ...dayData,
            exercises: dayData.exercises.filter(ex => ex.name.trim() !== ''),
          };
          return acc;
        }, {}),
      };

      await createWorkoutPlan(cleanedData);
      onSuccess();
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const addExercise = (day) => {
    setFormData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          exercises: [
            ...prev.weeklySchedule[day].exercises,
            { name: '', sets: 3, reps: '8-12', rest: '60s', notes: '' },
          ],
        },
      },
    }));
  };

  const removeExercise = (day, index) => {
    setFormData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          exercises: prev.weeklySchedule[day].exercises.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateExercise = (day, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          exercises: prev.weeklySchedule[day].exercises.map((ex, i) =>
            i === index ? { ...ex, [field]: value } : ex
          ),
        },
      },
    }));
  };

  const updateDayField = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value,
        },
      },
    }));
  };

  const addListItem = (listKey) => {
    setFormData(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], ''],
    }));
  };

  const removeListItem = (listKey, index) => {
    setFormData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (listKey, index, value) => {
    setFormData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) => (i === index ? value : item)),
    }));
  };

  if (!isOpen) return null;

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const currentDayData = formData.weeklySchedule[activeDay];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">Create Workout Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Title *
              </label>
              <input
                type="text"
                required
                value={formData.planTitle}
                onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Beginner Strength Program"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Strength Training</option>
                <option>Cardio Focus</option>
                <option>Weight Loss</option>
                <option>Muscle Building</option>
                <option>Endurance</option>
                <option>General Fitness</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>All Members</option>
                <option>Male Only</option>
                <option>Female Only</option>
                <option>Beginners</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Custom Selection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Duration
              </label>
              <select
                value={formData.planDuration}
                onChange={(e) => setFormData({ ...formData, planDuration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>4 weeks</option>
                <option>8 weeks</option>
                <option>12 weeks</option>
                <option>Ongoing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workouts Per Week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.workoutsPerWeek}
                onChange={(e) => setFormData({ ...formData, workoutsPerWeek: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Target Goals */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Target Goals</h3>
            <input
              type="text"
              placeholder="Goal description"
              value={formData.targetGoals.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetGoals: { ...formData.targetGoals, description: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Estimated time per session (e.g., 60-90 minutes)"
              value={formData.targetGoals.estimatedTimePerSession}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetGoals: { ...formData.targetGoals, estimatedTimePerSession: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Weekly Schedule</h3>
            
            {/* Day Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveDay(key)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeDay === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="restDay"
                  checked={currentDayData.restDay}
                  onChange={(e) => updateDayField(activeDay, 'restDay', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="restDay" className="font-medium text-gray-700">
                  Rest Day
                </label>
              </div>

              {!currentDayData.restDay && (
                <>
                  <input
                    type="text"
                    placeholder="Focus (e.g., Chest & Triceps)"
                    value={currentDayData.focus}
                    onChange={(e) => updateDayField(activeDay, 'focus', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Exercises</h4>
                    <div className="space-y-3">
                      {currentDayData.exercises.map((exercise, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Exercise name"
                              value={exercise.name}
                              onChange={(e) => updateExercise(activeDay, idx, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeExercise(activeDay, idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              placeholder="Sets"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(activeDay, idx, 'sets', parseInt(e.target.value))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Reps"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(activeDay, idx, 'reps', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Rest"
                              value={exercise.rest}
                              onChange={(e) => updateExercise(activeDay, idx, 'rest', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={exercise.notes}
                            onChange={(e) => updateExercise(activeDay, idx, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addExercise(activeDay)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Warmup"
                      value={currentDayData.warmup}
                      onChange={(e) => updateDayField(activeDay, 'warmup', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Cardio"
                      value={currentDayData.cardio}
                      onChange={(e) => updateDayField(activeDay, 'cardio', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Cooldown"
                      value={currentDayData.cooldown}
                      onChange={(e) => updateDayField(activeDay, 'cooldown', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tips & Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">💡 Important Tips</h3>
              {formData.importantTips.map((tip, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tip"
                    value={tip}
                    onChange={(e) => updateListItem('importantTips', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('importantTips', idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('importantTips')}
                className="text-sm text-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add tip
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">⚠️ Safety Guidelines</h3>
              {formData.safetyGuidelines.map((guideline, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a safety guideline"
                    value={guideline}
                    onChange={(e) => updateListItem('safetyGuidelines', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('safetyGuidelines', idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('safetyGuidelines')}
                className="text-sm text-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add guideline
              </button>
            </div>
          </div>

          {/* General Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Instructions
            </label>
            <textarea
              value={formData.generalInstructions}
              onChange={(e) => setFormData({ ...formData, generalInstructions: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional instructions..."
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlanModal;