// src/Advance/Features/AiDietPlan/Ui/CreateDietPlanModal.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, Loader2, Save } from 'lucide-react';
import useDietPlanStore from '../store/useDietPlanStore';

const CreateDietPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const { createDietPlan, loading } = useDietPlanStore();

  const [formData, setFormData] = useState({
    planTitle: '',
    planType: 'General Health',
    targetAudience: 'All Members',
    planDuration: '1 month',
    targetGoals: {
      description: '',
      dailyCaloriesRange: { min: '', max: '' },
      generalNotes: '',
    },
    mealPlan: {
      earlyMorning: { time: '6:00 AM', items: [''], notes: '' },
      breakfast: { time: '8:00 AM', items: [''], notes: '' },
      midMorning: { time: '10:30 AM', items: [''], notes: '' },
      lunch: { time: '1:00 PM', items: [''], notes: '' },
      eveningSnack: { time: '4:30 PM', items: [''], notes: '' },
      dinner: { time: '8:00 PM', items: [''], notes: '' },
      beforeBed: { time: '10:00 PM', items: [''], notes: '' },
    },
    generalInstructions: '',
    dosList: [''],
    dontsList: [''],
    waterIntake: '3-4 liters daily',
    supplements: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty items
      const cleanedData = {
        ...formData,
        dosList: formData.dosList.filter(item => item.trim() !== ''),
        dontsList: formData.dontsList.filter(item => item.trim() !== ''),
        mealPlan: Object.keys(formData.mealPlan).reduce((acc, key) => {
          acc[key] = {
            ...formData.mealPlan[key],
            items: formData.mealPlan[key].items.filter(item => item.trim() !== ''),
          };
          return acc;
        }, {}),
      };

      await createDietPlan(cleanedData);
      onSuccess();
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const addMealItem = (mealKey) => {
    setFormData(prev => ({
      ...prev,
      mealPlan: {
        ...prev.mealPlan,
        [mealKey]: {
          ...prev.mealPlan[mealKey],
          items: [...prev.mealPlan[mealKey].items, ''],
        },
      },
    }));
  };

  const removeMealItem = (mealKey, index) => {
    setFormData(prev => ({
      ...prev,
      mealPlan: {
        ...prev.mealPlan,
        [mealKey]: {
          ...prev.mealPlan[mealKey],
          items: prev.mealPlan[mealKey].items.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateMealItem = (mealKey, index, value) => {
    setFormData(prev => ({
      ...prev,
      mealPlan: {
        ...prev.mealPlan,
        [mealKey]: {
          ...prev.mealPlan[mealKey],
          items: prev.mealPlan[mealKey].items.map((item, i) => (i === index ? value : item)),
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

  const meals = [
    { key: 'earlyMorning', label: '🌅 Early Morning' },
    { key: 'breakfast', label: '🍳 Breakfast' },
    { key: 'midMorning', label: '☕ Mid Morning' },
    { key: 'lunch', label: '🍱 Lunch' },
    { key: 'eveningSnack', label: '🥤 Evening Snack' },
    { key: 'dinner', label: '🍽️ Dinner' },
    { key: 'beforeBed', label: '🌙 Before Bed' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Diet Plan</h2>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Weight Loss Plan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option>Weight Loss</option>
                <option>Weight Gain</option>
                <option>Muscle Building</option>
                <option>Maintenance</option>
                <option>General Health</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option>All Members</option>
                <option>Male Only</option>
                <option>Female Only</option>
                <option>Beginners</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>3 months</option>
                <option>Ongoing</option>
              </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min calories"
                value={formData.targetGoals.dailyCaloriesRange.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetGoals: {
                      ...formData.targetGoals,
                      dailyCaloriesRange: { ...formData.targetGoals.dailyCaloriesRange, min: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Max calories"
                value={formData.targetGoals.dailyCaloriesRange.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetGoals: {
                      ...formData.targetGoals,
                      dailyCaloriesRange: { ...formData.targetGoals.dailyCaloriesRange, max: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Meal Plan */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Daily Meal Plan</h3>
            {meals.map(({ key, label }) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">{label}</h4>
                  <input
                    type="time"
                    value={formData.mealPlan[key].time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mealPlan: {
                          ...formData.mealPlan,
                          [key]: { ...formData.mealPlan[key], time: e.target.value },
                        },
                      })
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-2">
                  {formData.mealPlan[key].items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Food item"
                        value={item}
                        onChange={(e) => updateMealItem(key, idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMealItem(key, idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMealItem(key)}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">✅ Do's</h3>
              {formData.dosList.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a do"
                    value={item}
                    onChange={(e) => updateListItem('dosList', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('dosList', idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('dosList')}
                className="text-sm text-green-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add do
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">❌ Don'ts</h3>
              {formData.dontsList.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a don't"
                    value={item}
                    onChange={(e) => updateListItem('dontsList', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('dontsList', idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('dontsList')}
                className="text-sm text-green-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add don't
              </button>
            </div>
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Intake
            </label>
            <input
              type="text"
              value={formData.waterIntake}
              onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 3-4 liters daily"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

export default CreateDietPlanModal;