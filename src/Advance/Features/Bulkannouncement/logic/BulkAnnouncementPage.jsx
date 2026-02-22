import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementForm from "../ui/AnnouncementForm";
import { useAnnouncementStore } from "../store/announcementStore";
import {
  Eye,
  Edit,
  Loader2,
  AlertCircle,
  Megaphone,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import AnnouncementViewModal from "../ui/AnnouncementViewModal";
import ModalContainer from "../../../../Components/Modal/ModalContainer";

const BulkAnnouncementPage = () => {
  const navigate = useNavigate();
  const {
    announcements,
    getAllAnnouncements,
    getAnnouncementById,
    currentAnnouncement,
    loading,
    error,
  } = useAnnouncementStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [fetchingAnnouncement, setFetchingAnnouncement] = useState(false);

  useEffect(() => {
    getAllAnnouncements();
  }, [getAllAnnouncements]);

  const fetchAndSetAnnouncement = async (id, modalType) => {
    setFetchingAnnouncement(true);
    setSelectedAnnouncementId(id);
    const res = await getAnnouncementById(id);

    if (res.success) {
      if (modalType === "view") setShowViewModal(true);
      if (modalType === "edit") setShowEditModal(true);
    }

    setFetchingAnnouncement(false);
  };

  const handleViewAnnouncement = (announcementId) => {
    fetchAndSetAnnouncement(announcementId, "view");
  };

  const handleEditAnnouncement = (announcementId) => {
    fetchAndSetAnnouncement(announcementId, "edit");
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedAnnouncementId(null);
  };

  const handleAnnouncementUpdated = () => {
    getAllAnnouncements();
    handleCloseModals();
  };

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="sticky top-0 z-40 border-b border-blue-100 shadow-lg bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="hidden h-6 w-px bg-blue-100 sm:block" />

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white shadow-md">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-xl">
                  Bulk Announcements
                </h1>
                <p className="text-xs text-gray-600 sm:text-sm">
                  Send and manage member announcements
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={getAllAnnouncements}
            disabled={loading || fetchingAnnouncement}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        <div className="mb-6">
          <AnnouncementForm onSuccess={handleAnnouncementUpdated} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text sm:text-2xl">
            Past Announcements
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 sm:text-sm">
            {announcements.length} Total
          </span>
        </div>

        {loading && !fetchingAnnouncement ? (
          <div className="rounded-2xl border border-blue-100 bg-white py-16 text-center shadow-md">
            <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-blue-500" />
            <p className="text-base font-medium text-gray-700">
              Loading announcements...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center shadow-md">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <p className="text-base font-medium text-red-700">Error: {error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-10 text-center shadow-md">
            <Megaphone className="mx-auto mb-4 h-14 w-14 text-blue-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">
              No announcements yet
            </h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Send your first bulk announcement from the form above.
            </p>
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="rounded-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-2">
                  <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {announcement.announcementType}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      {announcement.status}
                    </span>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {announcement.message}
                </p>

                <div className="flex gap-2 border-t border-blue-100 pt-3">
                  <button
                    onClick={() => handleViewAnnouncement(announcement._id)}
                    disabled={
                      fetchingAnnouncement &&
                      selectedAnnouncementId === announcement._id
                    }
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:from-blue-100 hover:to-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fetchingAnnouncement &&
                    selectedAnnouncementId === announcement._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    View
                  </button>

                  <button
                    onClick={() => handleEditAnnouncement(announcement._id)}
                    disabled={
                      fetchingAnnouncement &&
                      selectedAnnouncementId === announcement._id
                    }
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:from-gray-100 hover:to-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fetchingAnnouncement &&
                    selectedAnnouncementId === announcement._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && currentAnnouncement && (
        <ModalContainer
          isOpen={showEditModal}
          onClose={handleCloseModals}
          maxWidth={800}
          padding={0}
          backdropBlur={8}
          backdropOpacity={0.65}
          borderRadius={16}
          contentClassName="bg-transparent"
        >
          <AnnouncementForm
            initialData={currentAnnouncement}
            onClose={handleCloseModals}
            onSuccess={handleAnnouncementUpdated}
          />
        </ModalContainer>
      )}

      {showViewModal && currentAnnouncement && (
        <AnnouncementViewModal
          isOpen={showViewModal}
          onClose={handleCloseModals}
          announcement={currentAnnouncement}
        />
      )}
    </div>
  );
};

export default BulkAnnouncementPage;
