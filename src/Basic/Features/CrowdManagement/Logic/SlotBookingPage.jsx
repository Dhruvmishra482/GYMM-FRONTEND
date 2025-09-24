import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSlotBookingStore } from '../Store/slotBookingStore';
import SlotBookingUI from '../Ui/slotBookingUi';
import { toast } from 'react-toastify';

const SlotBookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tokenValidated, setTokenValidated] = useState(false);
  
  const {
    bookingPageData,
    loading,
    error,
    loadBookingPage,
    bookSlotTime,
    cancelBooking,
    clearErrors,
    resetStore,
    bookingLoading,
    bookingError,
    bookingSuccess,
    clearBookingSuccess,
    cancellationLoading
  } = useSlotBookingStore();

  // Get token from URL params
  const token = searchParams.get('token');

  // Validate token and load page data
  useEffect(() => {
    const validateAndLoadData = async () => {
      if (!token) {
        toast.error('Invalid booking link. Please use the link from your WhatsApp message.');
        navigate('/');
        return;
      }

      try {
        clearErrors();
        const data = await loadBookingPage(token);
        
        if (data) {
          setTokenValidated(true);
          toast.success(`Welcome ${data.member.name}! Select your workout slot.`);
        } else {
          toast.error('Invalid or expired booking link.');
          navigate('/');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load booking page');
        navigate('/');
      }
    };

    validateAndLoadData();

    // Cleanup on unmount
    return () => {
      resetStore();
    };
  }, [token, loadBookingPage, clearErrors, resetStore, navigate]);

  // Handle slot booking
  const handleSlotBooking = async (slotTime) => {
    try {
      clearErrors();
      const result = await bookSlotTime(slotTime);
      
      if (result) {
        const isUpdate = bookingPageData?.booking?.currentBooking;
        toast.success(
          isUpdate 
            ? `Slot updated to ${slotTime} successfully!`
            : `Slot ${slotTime} booked successfully!`
        );
      }
    } catch (error) {
      toast.error(error.message || 'Failed to book slot');
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      clearErrors();
      const result = await cancelBooking(bookingId);
      
      if (result) {
        toast.success('Booking cancelled successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  // Handle booking success acknowledgment
  const handleBookingSuccessAck = () => {
    clearBookingSuccess();
  };

  // Show loading screen during token validation
  if (!tokenValidated && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your booking link...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Show error screen if token validation failed
  if (error && !tokenValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Please check:</p>
            <ul className="list-disc list-inside text-left">
              <li>You're using the latest link from WhatsApp</li>
              <li>The link hasn't expired</li>
              <li>You're accessing it on the correct date</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show booking interface
  return (
    <div className="min-h-screen bg-gray-50">
      <SlotBookingUI
        bookingData={bookingPageData}
        loading={loading}
        error={error || bookingError}
        onSlotBook={handleSlotBooking}
        onBookingCancel={handleCancelBooking}
        onBookingSuccessAck={handleBookingSuccessAck}
        bookingLoading={bookingLoading}
        cancellationLoading={cancellationLoading}
        bookingSuccess={bookingSuccess}
      />
    </div>
  );
};

export default SlotBookingPage;