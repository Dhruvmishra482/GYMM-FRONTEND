// PreviewWorkoutPlanModal.jsx
import React from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer';
import WorkoutPlanDisplay from './WorkoutPlanDisplay';
import { X } from 'lucide-react';

const PreviewWorkoutPlanModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null; // Render nothing if not open or no plan

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Preview Workout Plan: ${plan?.planTitle}`} maxWidth={900} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <div className="relative p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-indigo-700/50 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-indigo-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-300 z-20"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 pb-3 border-b border-indigo-700/50">
          Preview Workout Plan: <span className="text-white">{plan?.planTitle}</span>
        </h2>
        <WorkoutPlanDisplay workoutPlan={plan} />
      </div>
    </ModalContainer>
  );
};

export default PreviewWorkoutPlanModal;