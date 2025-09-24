import React, { useState } from 'react';
import SlotSelectionGrid from './SlotSelectionGrid';
import BookingConfirmation from './BookingConfirmation';

const SlotBookingUI = ({
  bookingData,
  loading,
  error,
  onSlotBook,
  onBookingCancel,
  onBookingSuccessAck,
  bookingLoading,
  cancellationLoading,
  bookingSuccess
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (selectedSlot) {
      await onSlotBook(selectedSlot.slotTime);
      setShowConfirmation(false);
      setSelectedSlot(null);
    }
  };

  // Handle booking cancellation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking options...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No booking data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {bookingData.ui?.title || 'Select Your Workout Slot'}
            </h1>
            <p className="text-gray-600 mt-1">
              {bookingData.gym?.name} • {bookingData.booking?.date}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {bookingData.ui?.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Member Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Welcome, {bookingData.member?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {bookingData.member?.phoneNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Date: {bookingData.booking?.date}
              </p>
              {bookingData.booking?.currentBooking && (
                <p className="text-sm font-medium text-blue-600">
                  Current: {bookingData.booking.currentBooking.slotTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {bookingData.ui?.instructions && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {bookingData.ui.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {bookingSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-green-800 font-medium">
                Booking successful! Check your WhatsApp for confirmation.
              </p>
              <button
                onClick={onBookingSuccessAck}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Current Booking */}
        {bookingData.booking?.currentBooking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-900">
                  Your Current Booking
                </h4>
                <p className="text-yellow-800">
                  {bookingData.booking.currentBooking.slotTime} - 
                  {bookingData.booking.currentBooking.bookingStatus}
                </p>
              </div>
              <button
                onClick={() => onBookingCancel(bookingData.booking.currentBooking._id)}
                disabled={cancellationLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {cancellationLoading ? 'Cancelling...' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Slot Selection Grid */}
        <SlotSelectionGrid
          slots={bookingData.slots || []}
          currentBooking={bookingData.booking?.currentBooking}
          preferredSlot={bookingData.booking?.pattern?.preferredSlot}
          onSlotSelect={handleSlotSelect}
          disabled={bookingLoading || cancellationLoading}
        />
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <BookingConfirmation
          slot={selectedSlot}
          currentBooking={bookingData.booking?.currentBooking}
          memberName={bookingData.member?.name}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelConfirmation}
          loading={bookingLoading}
        />
      )}
    </div>
  );
};

export default SlotBookingUI;