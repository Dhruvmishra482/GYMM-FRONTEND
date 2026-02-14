import React from 'react';
import { X, Calendar, Tag, Bell, Filter } from 'lucide-react';
import ModalContainer from '../../../../Components/Modal/ModalContainer';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg border border-yellow-700/50 shadow-md">
    <Icon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
    <div>
      <dt className="text-sm font-medium text-amber-200">{label}</dt>
      <dd className="mt-1 text-base text-white font-semibold">{value}</dd>
    </div>
  </div>
);

const AnnouncementViewModal = ({ isOpen, onClose, announcement }) => {
  if (!isOpen || !announcement) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title="Announcement Details" maxWidth={700} padding={0} backdropBlur={8} backdropOpacity={0.65} borderRadius={16} contentClassName="bg-transparent">
      <div className="relative p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-700/50 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-orange-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-300 z-20"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-yellow-300 mb-6 pb-3 border-b border-yellow-700/50">
          Announcement Details
        </h2>

        <div className="space-y-4">
          <DetailItem icon={Bell} label="Title" value={announcement.title} />
          <div className="p-3 bg-gray-800/60 rounded-lg border border-yellow-700/50 shadow-md">
            <h3 className="text-sm font-medium text-amber-200 mb-1">Message:</h3>
            <p className="text-white whitespace-pre-wrap">{announcement.message}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={Tag} label="Type" value={announcement.announcementType} />
            <DetailItem icon={Tag} label="Priority" value={announcement.priority} />
            <DetailItem icon={Filter} label="Filter Gender" value={announcement.filters?.gender || 'All'} />
            <DetailItem icon={Filter} label="Filter Payment" value={announcement.filters?.paymentStatus || 'All'} />
          </div>
          <DetailItem 
            icon={Calendar} 
            label="Sent At" 
            value={announcement.broadcastDetails?.sentAt ? new Date(announcement.broadcastDetails.sentAt).toLocaleString() : 'N/A'} 
          />
          <DetailItem icon={Bell} label="Status" value={announcement.status} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default AnnouncementViewModal;
