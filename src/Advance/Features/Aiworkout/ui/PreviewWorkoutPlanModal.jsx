import React from "react";
import ModalContainer from "../../../../Components/Modal/ModalContainer";
import WorkoutPlanDisplay from "./WorkoutPlanDisplay";
import { X } from "lucide-react";

const PreviewWorkoutPlanModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={1040}
      padding={0}
      backdropBlur={6}
      backdropOpacity={0.55}
      borderRadius={18}
    >
      <div className="relative rounded-2xl border border-slate-300 bg-[#e9eefc] p-5 shadow-xl sm:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg border border-slate-300 bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workout Plan Preview
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {plan?.planTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Review complete plan details before broadcasting or editing.
          </p>
        </div>

        <div className="mt-5 border-t border-slate-300 pt-5">
          <WorkoutPlanDisplay workoutPlan={plan} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default PreviewWorkoutPlanModal;
