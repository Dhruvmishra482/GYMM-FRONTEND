// PreviewDietPlanModal.jsx
import React from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer';
import DietPlanDisplay from './DietPlanDisplay';
import { X } from 'lucide-react';

const PreviewDietPlanModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null; // Render nothing if not open or no plan

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Preview Diet Plan: ${plan?.planTitle}`} maxWidth={900} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <div className="relative p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-700/50 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-teal-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-300 z-20"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300 mb-6 pb-3 border-b border-emerald-700/50">
          Preview Diet Plan: <span className="text-white">{plan?.planTitle}</span>
        </h2>
        <DietPlanDisplay dietPlan={plan} />
      </div>
    </ModalContainer>
  );
};

export default PreviewDietPlanModal;