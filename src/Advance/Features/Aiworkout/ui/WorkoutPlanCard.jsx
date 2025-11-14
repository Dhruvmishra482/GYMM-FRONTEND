// src/Advance/Features/AiWorkoutPlan/Ui/WorkoutPlanCard.jsx
import React, { useState } from 'react';
import {
  Send,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Target,
  Clock,
  TrendingUp,
  MoreVertical,
  Dumbbell,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';

const WorkoutPlanCard = ({ plan, onBroadcast, onEdit, onPreview, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanTypeIcon = (type) => {
    switch (type) {
      case 'Strength Training':
        return '🏋️';
      case 'Cardio Focus':
        return '🏃';
      case 'Weight Loss':
        return '⚖️';
      case 'Muscle Building':
        return '💪';
      case 'Endurance':
        return '🚴';
      case 'General Fitness':
        return '🎯';
      default:
        return '📋';
    }
  };

  const successRate =
    plan.broadcastDetails?.totalMembersSent > 0
      ? (
          (plan.broadcastDetails.successfulDeliveries /
            plan.broadcastDetails.totalMembersSent) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl">{getPlanTypeIcon(plan.planType)}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                plan.status
              )}`}
            >
              {plan.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                plan.difficultyLevel
              )}`}
            >
              {plan.difficultyLevel}
            </span>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-white rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Plan
                </button>
                <button
                  onClick={() => {
                    onPreview();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Eye className="w-4 h-4" />
                  Preview Message
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Plan
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
          {plan.planTitle}
        </h3>
        <p className="text-sm text-gray-600">{plan.planType}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="truncate">{plan.targetAudience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>{plan.planDuration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Dumbbell className="w-4 h-4 text-purple-600" />
            <span>{plan.workoutsPerWeek} days/week</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4 text-green-600" />
            <span>{plan.difficultyLevel}</span>
          </div>
        </div>

        {/* Broadcast Stats */}
        {plan.broadcastDetails?.totalMembersSent > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase">
                Broadcast Stats
              </span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {plan.broadcastDetails.successfulDeliveries}
                </p>
                <p className="text-xs text-gray-600">Sent Successfully</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {successRate}%
                </p>
                <p className="text-xs text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Created {format(new Date(plan.createdAt), 'MMM dd, yyyy')}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onBroadcast}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Send className="w-4 h-4" />
          Send to Members
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlanCard;