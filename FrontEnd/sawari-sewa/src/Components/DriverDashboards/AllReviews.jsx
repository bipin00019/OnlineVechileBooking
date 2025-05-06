import React, { useState, useEffect } from 'react';
import { fetchDriverReviews } from '../../services/DriverDashboardService';
import { Star, Clock, User, MessageSquare } from 'lucide-react';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchDriverReviews();
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600 text-xl font-semibold">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Reviews</h1>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 text-lg">No reviews yet</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-101">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {review.passengerName}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <div className="flex items-start space-x-2 mt-4">
                    <MessageSquare size={18} className="text-gray-400 mt-1" />
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;