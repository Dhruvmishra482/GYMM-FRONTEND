import React from "react";
import ModalContainer from "../../../../Components/Modal/ModalContainer";
import DietPlanDisplay from "./DietPlanDisplay";
import { X } from "lucide-react";

const PreviewDietPlanModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={980}
      padding={0}
      backdropBlur={6}
      backdropOpacity={0.55}
      borderRadius={16}
    >
      <div className="relative rounded-2xl border border-slate-300 bg-[#dfe5ef] p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg border border-slate-300 bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-5 border-b border-slate-300 pb-3 pr-10 text-2xl font-bold text-slate-900 sm:text-3xl">
          Preview Diet Plan: <span className="text-slate-800">{plan?.planTitle}</span>
        </h2>

        <DietPlanDisplay dietPlan={plan} />
      </div>
    </ModalContainer>
  );
};

export default PreviewDietPlanModal;
