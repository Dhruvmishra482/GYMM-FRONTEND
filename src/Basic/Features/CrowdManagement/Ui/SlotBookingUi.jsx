import React, { useState, useMemo, useCallback } from "react";
import SlotSelectionGrid from "./slotSelectionGrid";
import BookingConfirmation from "./BookingConfirmation";

// Custom animation hook
const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Memoized Loading Component
const LoadingState = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your booking options...</p>
    </div>
  </div>
));

LoadingState.displayName = "LoadingState";

// Memoized No Data Component
const NoDataState = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-600">No booking data available</p>
    </div>
  </div>
));

NoDataState.displayName = "NoDataState";

// Memoized Header Component
const BookingHeader = React.memo(({ title, gymName, date, subtitle }) => {
  const isVisible = useFadeIn(0);

  return (
    <div
      className={`bg-white shadow-sm border-b transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || "Select Your Workout Slot"}
          </h1>
          <p className="text-gray-600 mt-1">
            {gymName} • {date}
          </p>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
});

BookingHeader.displayName = "BookingHeader";

// Memoized Member Info Component
const MemberInfo = React.memo(
  ({ memberName, phoneNo, date, currentBooking }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Welcome, {memberName}
            </h3>
            <p className="text-sm text-gray-600">{phoneNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {date}</p>
            {currentBooking && (
              <p className="text-sm font-medium text-blue-600">
                Current: {currentBooking.slotTime}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MemberInfo.displayName = "MemberInfo";

// Memoized Instructions Component
const Instructions = React.memo(({ instructions }) => {
  if (!instructions || instructions.length === 0) return null;

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
      <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

Instructions.displayName = "Instructions";

// Memoized Error Banner Component
const ErrorBanner = React.memo(({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fadeIn">
      <p className="text-red-800">{error}</p>
    </div>
  );
});

ErrorBanner.displayName = "ErrorBanner";

// Memoized Success Banner Component
const SuccessBanner = React.memo(({ onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <p className="text-green-800 font-medium">
          Booking successful! Check your WhatsApp for confirmation.
        </p>
        <button
          onClick={handleClose}
          className="text-green-600 hover:text-green-800 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
});

SuccessBanner.displayName = "SuccessBanner";

// Memoized Current Booking Component
const CurrentBookingCard = React.memo(
  ({ currentBooking, onCancel, cancellationLoading }) => {
    const handleCancel = useCallback(() => {
      onCancel(currentBooking._id);
    }, [currentBooking._id, onCancel]);

    if (!currentBooking) return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-yellow-900">
              Your Current Booking
            </h4>
            <p className="text-yellow-800">
              {currentBooking.slotTime} - {currentBooking.bookingStatus}
            </p>
          </div>
          <button
            onClick={handleCancel}
            disabled={cancellationLoading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm transition-colors duration-200"
          >
            {cancellationLoading ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      </div>
    );
  }
);

CurrentBookingCard.displayName = "CurrentBookingCard";

const SlotBookingUI = ({
  bookingData,
  loading,
  error,
  onSlotBook,
  onBookingCancel,
  onBookingSuccessAck,
  bookingLoading,
  cancellationLoading,
  bookingSuccess,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Memoize computed values
  const slots = useMemo(() => bookingData?.slots || [], [bookingData?.slots]);
  const currentBooking = useMemo(
    () => bookingData?.booking?.currentBooking,
    [bookingData?.booking?.currentBooking]
  );
  const preferredSlot = useMemo(
    () => bookingData?.booking?.pattern?.preferredSlot,
    [bookingData?.booking?.pattern?.preferredSlot]
  );
  const isDisabled = useMemo(
    () => bookingLoading || cancellationLoading,
    [bookingLoading, cancellationLoading]
  );

  // useCallback for event handlers
  const handleSlotSelect = useCallback((slot) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  }, []);

  const handleConfirmBooking = useCallback(async () => {
    if (selectedSlot) {
      await onSlotBook(selectedSlot.slotTime);
      setShowConfirmation(false);
      setSelectedSlot(null);
    }
  }, [selectedSlot, onSlotBook]);

  const handleCancelConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setSelectedSlot(null);
  }, []);

  const handleBookingCancel = useCallback(
    (bookingId) => {
      onBookingCancel(bookingId);
    },
    [onBookingCancel]
  );

  const handleSuccessAck = useCallback(() => {
    onBookingSuccessAck();
  }, [onBookingSuccessAck]);

  // Early returns for loading and no data states
  if (loading) {
    return <LoadingState />;
  }

  if (!bookingData) {
    return <NoDataState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BookingHeader
        title={bookingData.ui?.title}
        gymName={bookingData.gym?.name}
        date={bookingData.booking?.date}
        subtitle={bookingData.ui?.subtitle}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Member Info */}
        <MemberInfo
          memberName={bookingData.member?.name}
          phoneNo={bookingData.member?.phoneNo}
          date={bookingData.booking?.date}
          currentBooking={currentBooking}
        />

        {/* Instructions */}
        <Instructions instructions={bookingData.ui?.instructions} />

        {/* Error Display */}
        <ErrorBanner error={error} />

        {/* Success Message */}
        {bookingSuccess && <SuccessBanner onClose={handleSuccessAck} />}

        {/* Current Booking */}
        <CurrentBookingCard
          currentBooking={currentBooking}
          onCancel={handleBookingCancel}
          cancellationLoading={cancellationLoading}
        />

        {/* Slot Selection Grid */}
        <SlotSelectionGrid
          slots={slots}
          currentBooking={currentBooking}
          preferredSlot={preferredSlot}
          onSlotSelect={handleSlotSelect}
          disabled={isDisabled}
        />
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <BookingConfirmation
          slot={selectedSlot}
          currentBooking={currentBooking}
          memberName={bookingData.member?.name}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelConfirmation}
          loading={bookingLoading}
        />
      )}
    </div>
  );
};

export default React.memo(SlotBookingUI);
