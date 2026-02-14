// DietPlanCard.jsx
import React from 'react';
import { Edit, Trash2, Eye, Send, Soup, Target, CalendarDays, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DietPlanCard = ({ plan, onBroadcast, onEdit, onPreview, onDelete }) => {
  const navigate = useNavigate();

  // Determine status color
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-300 border-green-400';
      case 'Draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'Archived':
        return 'bg-red-500/20 text-red-300 border-red-400';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const handleDetailsClick = () => {
    // Navigate to a detail page if one exists, or just open the edit modal
    onEdit(plan); // For now, clicking details opens edit modal
  };

  return (
    <div 
      className="relative z-10 p-1 bg-gradient-to-br from-teal-800 to-lime-900 rounded-3xl shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 group cursor-pointer"
      onClick={handleDetailsClick} // Make the whole card clickable for details/edit
    >
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-300" 
           style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)' }}>
      </div>

      <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 flex flex-col h-full border border-teal-700/50">
        <div className="flex-grow">
          {/* Plan Title and Status */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 group-hover:from-emerald-200 group-hover:to-lime-200 transition-colors duration-300">
              {plan.planTitle}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(plan.status)}`}>
              {plan.status}
            </span>
          </div>

          {/* Key Details */}
          <div className="text-sm text-teal-200 space-y-2 mb-4">
            <p className="flex items-center gap-2"><Zap className="w-4 h-4 text-lime-400" />Plan Type: <span className="font-medium text-white">{plan.planType}</span></p>
            <p className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400" />Audience: <span className="font-medium text-white">{plan.targetAudience}</span></p>
            <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-orange-400" />Duration: <span className="font-medium text-white">{plan.planDuration}</span></p>
          </div>

          {/* Instructions Snippet */}
          <p className="text-teal-300 text-sm line-clamp-3 mb-5">
            {plan.generalInstructions || "No specific instructions provided for this plan yet."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-teal-700/50 flex justify-around items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onBroadcast(plan); }} // Stop propagation to prevent card click
            className="p-3 bg-blue-600/30 text-blue-300 rounded-full hover:bg-blue-500/50 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            title="Broadcast Plan"
          >
            <Send className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(plan); }} // Stop propagation
            className="p-3 bg-purple-600/30 text-purple-300 rounded-full hover:bg-purple-500/50 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            title="Preview Plan"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(plan); }} // Stop propagation
            className="p-3 bg-yellow-600/30 text-yellow-300 rounded-full hover:bg-yellow-500/50 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            title="Edit Plan"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(plan._id); }} // Stop propagation
            className="p-3 bg-red-600/30 text-red-300 rounded-full hover:bg-red-500/50 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            title="Delete Plan"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietPlanCard;