import React, { memo, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ModalContainer from "../../../../Components/Modal/ModalContainer";
import EditMemberForm from "./EditMemberForm";

const EditMemberModal = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const onClose = useCallback(() => {
    const background = location.state?.background || "/dashboard";
    navigate(background, { replace: true });
  }, [navigate, location.state]);

  return (
    <ModalContainer onClose={onClose} maxWidth={900} padding={0}>
      <EditMemberForm />
    </ModalContainer>
  );
});

EditMemberModal.displayName = "EditMemberModal";

export default EditMemberModal;


