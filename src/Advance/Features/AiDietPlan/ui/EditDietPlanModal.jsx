// EditDietPlanModal.jsx
import React from 'react';
import ModalContainer from '../../../../Components/Modal/ModalContainer';
import DietPlanForm from './DietPlanForm';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const EditDietPlanModal = ({ isOpen, onClose, plan, onSuccess }) => {
  if (!isOpen || !plan) return null; // Render nothing if not open or no plan

  const handleSaveSuccess = (updatedPlan) => {
    toast.success("Diet Plan updated successfully!");
    onSuccess(updatedPlan); // Propagate success
    onClose(); // Close modal
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Edit Diet Plan: ${plan?.planTitle}`} maxWidth={800} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
        <DietPlanForm
          initialData={plan}
          isEditMode={true}
          onSaveSuccess={handleSaveSuccess}
        />
    </ModalContainer>
  );
};

export default EditDietPlanModal;