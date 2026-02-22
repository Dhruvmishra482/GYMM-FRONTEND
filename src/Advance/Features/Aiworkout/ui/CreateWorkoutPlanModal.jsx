// CreateWorkoutPlanModal.jsx
import React from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer'; // Assuming a reusable ModalContainer
import WorkoutPlanForm from './WorkoutPlanForm'; // My previously created form
import { toast } from 'react-hot-toast';

const CreateWorkoutPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const handleSaveSuccess = (newPlan) => {
    toast.success("Workout Plan created successfully!");
    onSuccess(newPlan);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title="Create New Workout Plan" maxWidth={800} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <WorkoutPlanForm onSaveSuccess={handleSaveSuccess} />
    </ModalContainer>
  );
};

export default CreateWorkoutPlanModal;