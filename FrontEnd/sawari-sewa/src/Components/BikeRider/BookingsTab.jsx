// BookingsTab.js
import React from 'react';

const BookingsTab = ({ bookingRequests }) => {
  return (
    <div>
      {/* Booking Requests */}
      {bookingRequests.length > 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell size={20} className="text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have {bookingRequests.length} new booking requests that need your attention.
              </p>
              <div className="mt-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                >
                  View Requests → 
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No booking requests</p>
      )}
    </div>
  );
};

export default BookingsTab;
