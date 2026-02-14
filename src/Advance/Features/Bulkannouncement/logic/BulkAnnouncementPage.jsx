// BulkAnnouncementPage.jsx
import React, { useEffect, useState } from 'react';
import AnnouncementForm from '../ui/AnnouncementForm';
import { useAnnouncementStore } from '../store/announcementStore';
import { Eye, Edit, Loader2, AlertCircle } from 'lucide-react';
import AnnouncementViewModal from '../ui/AnnouncementViewModal'; // Import the view modal
import ModalContainer from '../../../../Components/Modal/ModalContainer'; // Assuming this is for generic modal wrapper

const BulkAnnouncementPage = () => {
  const {
    announcements,
    getAllAnnouncements,
    getAnnouncementById, // Import the getById action
    currentAnnouncement, // State to hold the fetched announcement
    loading,
    error,
  } = useAnnouncementStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [fetchingAnnouncement, setFetchingAnnouncement] = useState(false); // New state for individual fetch loading

  useEffect(() => {
    getAllAnnouncements();
  }, [getAllAnnouncements]);

  const fetchAndSetAnnouncement = async (id, modalType) => {
    setFetchingAnnouncement(true);
    setSelectedAnnouncementId(id);
    const res = await getAnnouncementById(id);
    if (res.success) {
      if (modalType === 'view') setShowViewModal(true);
      if (modalType === 'edit') setShowEditModal(true);
    }
    setFetchingAnnouncement(false);
  };

  const handleViewAnnouncement = (announcementId) => {
    fetchAndSetAnnouncement(announcementId, 'view');
  };

  const handleEditAnnouncement = (announcementId) => {
    fetchAndSetAnnouncement(announcementId, 'edit');
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedAnnouncementId(null);
  };

  const handleAnnouncementUpdated = () => {
    getAllAnnouncements(); // Refresh the list after update
    handleCloseModals(); // Close modal after successful update
  };

  if (loading && !fetchingAnnouncement) return <div className="p-4 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /> Loading announcements...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 text-white p-6 overflow-hidden">
      {/* Animated Background Element (Subtle 3D feel, announcement-themed) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>
      
      {/* Page Content */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-8 text-center animate-fade-in-down">
          📢 Bulk Announcements
        </h1>

        <AnnouncementForm onSuccess={handleAnnouncementUpdated} /> {/* Pass onSuccess to refresh after send */}
        
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300 mt-10 mb-6 pb-3 border-b border-yellow-700/50">Past Announcements</h3>
        {loading && !fetchingAnnouncement ? (
          <div className="relative z-10 flex flex-col justify-center items-center py-20 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-700/50">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
            <p className="text-xl font-semibold text-orange-200">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="relative z-10 flex flex-col justify-center items-center py-20 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-red-700/50">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-xl font-semibold text-red-200">Error: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.length === 0 ? (
              <div className="relative z-10 bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-yellow-700/50 col-span-full">
                <div className="text-6xl mb-6 animate-bounce-slow">💌</div>
                <h3 className="text-3xl font-bold text-yellow-100 mb-4">
                  No announcements sent yet.
                </h3>
                <p className="text-orange-300 text-lg">
                  Start by creating your first bulk announcement!
                </p>
              </div>
            ) : (
              announcements.map(announcement => (
                <div key={announcement._id} className="relative z-10 p-1 bg-gradient-to-br from-orange-700 to-red-800 rounded-3xl shadow-xl hover:shadow-orange-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
                  {/* Background Glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-300" 
                       style={{ background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.3) 0%, transparent 70%)' }}>
                  </div>
                  <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 flex flex-col h-full border border-yellow-700/50">
                    <div className="flex-grow">
                      <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors duration-300 mb-2">{announcement.title}</h4>
                      <p className="text-orange-200 text-sm mt-1">Status: <span className="font-medium text-white">{announcement.status}</span></p>
                      <p className="text-orange-200 text-sm">Type: <span className="font-medium text-white">{announcement.announcementType}</span></p>
                      <p className="text-yellow-300 mt-3 text-base line-clamp-3">{announcement.message}</p>
                    </div>
                    <div className="mt-4 flex space-x-2 pt-4 border-t border-yellow-700/50">
                      <button
                        onClick={() => handleViewAnnouncement(announcement._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600/30 text-blue-300 rounded-full hover:bg-blue-500/50 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md"
                        disabled={fetchingAnnouncement && selectedAnnouncementId === announcement._id}
                      >
                        {fetchingAnnouncement && selectedAnnouncementId === announcement._id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Eye className="h-4 w-4 mr-1" />} View
                      </button>
                      <button
                        onClick={() => handleEditAnnouncement(announcement._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600/30 text-green-300 rounded-full hover:bg-green-500/50 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md"
                        disabled={fetchingAnnouncement && selectedAnnouncementId === announcement._id}
                      >
                        {fetchingAnnouncement && selectedAnnouncementId === announcement._id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Edit className="h-4 w-4 mr-1" />} Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Announcement Modal */}
      {showEditModal && currentAnnouncement && (
        <ModalContainer isOpen={showEditModal} onClose={handleCloseModals} maxWidth={800} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
          <AnnouncementForm
            initialData={currentAnnouncement}
            onClose={handleCloseModals}
            onSuccess={handleAnnouncementUpdated}
          />
        </ModalContainer>
      )}

      {/* View Announcement Modal */}
      {showViewModal && currentAnnouncement && (
        <AnnouncementViewModal
          isOpen={showViewModal}
          onClose={handleCloseModals}
          announcement={currentAnnouncement}
        />
      )}
    </div>
  );
}; // Closing brace for the component function

export default BulkAnnouncementPage; // Correctly placed after the component definition
