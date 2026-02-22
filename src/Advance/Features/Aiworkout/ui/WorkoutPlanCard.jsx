// WorkoutPlanCard.jsx
import React from 'react';
import { Edit, Trash2, Eye, Send, Award, Target, CalendarDays, Zap } from 'lucide-react';

const WorkoutPlanCard = ({ plan, onBroadcast, onEdit, onPreview, onDelete }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Draft':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Archived':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleDetailsClick = () => {
    onEdit(plan);
  };

  return (
    <div
      className="rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={handleDetailsClick}
    >
      <div className="flex h-full flex-col">
        <div className="flex-grow">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 text-2xl font-bold text-slate-900">{plan.planTitle}</h3>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(plan.status)}`}>
              {plan.status}
            </span>
          </div>

          <div className="mb-4 space-y-2 text-sm text-slate-700">
            <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-indigo-600" />Plan Type: <span className="font-medium text-slate-900">{plan.planType}</span></p>
            <p className="flex items-center gap-2"><Award className="h-4 w-4 text-blue-600" />Level: <span className="font-medium text-slate-900">{plan.difficultyLevel}</span></p>
            <p className="flex items-center gap-2"><Target className="h-4 w-4 text-emerald-600" />Audience: <span className="font-medium text-slate-900">{plan.targetAudience}</span></p>
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-600" />Duration: <span className="font-medium text-slate-900">{plan.planDuration}</span></p>
          </div>

          <p className="mb-5 line-clamp-3 text-sm text-slate-600">
            {plan.generalInstructions || 'No specific instructions provided for this plan yet.'}
          </p>
        </div>

        <div className="flex items-center justify-around gap-3 border-t border-slate-300 pt-4">
          <button
            onClick={(e) => { e.stopPropagation(); onBroadcast(plan); }}
            className="rounded-full bg-blue-100 p-3 text-blue-700 transition-all duration-200 hover:bg-blue-200"
            title="Broadcast Plan"
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(plan); }}
            className="rounded-full bg-indigo-100 p-3 text-indigo-700 transition-all duration-200 hover:bg-indigo-200"
            title="Preview Plan"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(plan); }}
            className="rounded-full bg-amber-100 p-3 text-amber-700 transition-all duration-200 hover:bg-amber-200"
            title="Edit Plan"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(plan._id); }}
            className="rounded-full bg-rose-100 p-3 text-rose-700 transition-all duration-200 hover:bg-rose-200"
            title="Delete Plan"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanCard;
