import React, { useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MyProfile from "../Logic/MyProfilePage";
import ModalContainer from "../../../../Components/Modal/ModalContainer";

const ProfileModal = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClose = useCallback(() => {
    const background = location.state?.background || "/";
    navigate(background, { replace: true });
  }, [navigate, location.state]);
  // Half-screen centered sheet with stronger blur
  return (
    <ModalContainer onClose={onClose} maxWidth={720} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16}>
      <MyProfile />
    </ModalContainer>
  );
});

ProfileModal.displayName = "ProfileModal";

export default ProfileModal;


