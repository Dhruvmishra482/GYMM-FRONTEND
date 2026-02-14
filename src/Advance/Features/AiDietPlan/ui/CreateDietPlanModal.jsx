// CreateDietPlanModal.jsx
import React from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer'; // Assuming a reusable ModalContainer
import DietPlanForm from './DietPlanForm'; // My previously created form
import { toast } from 'react-hot-toast';

const CreateDietPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const handleSaveSuccess = (newPlan) => {
    toast.success("Diet Plan created successfully!");
    onSuccess(newPlan);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title="Create New Diet Plan" maxWidth={800} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <DietPlanForm onSaveSuccess={handleSaveSuccess} />
    </ModalContainer>
  );
};

export default CreateDietPlanModal;