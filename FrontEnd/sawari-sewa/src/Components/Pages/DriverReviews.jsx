// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { fetchDriverReviewsHome } from '../../services/DriverService'

// const DriverReviews = () => {
//   const { driverId } = useParams() // get driverId from route params
//   const [reviews, setReviews] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const loadReviews = async () => {
//       try {
//         setLoading(true)
//         const data = await fetchDriverReviewsHome(driverId)
//         setReviews(data)
//       } catch (err) {
//         setError("Failed to load reviews")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (driverId) {
//       loadReviews()
//     }
//   }, [driverId])

//   if (loading) return <p>Loading reviews...</p>
//   if (error) return <p>{error}</p>
//   if (reviews.length === 0) return <p>No reviews available for this driver.</p>

//   return (
//     <div>
//       <h1>Driver Reviews</h1>
//       <ul>
//         {reviews.map((review, index) => (
//           <li key={index} className="mb-4 border-b pb-2">
//             <strong>{review.PassengerName}</strong> rated: {review.Rating} / 5<br />
//             <em>{new Date(review.CreatedAt).toLocaleDateString()}</em>
//             <p>{review.Comment}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default DriverReviews

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDriverReviewsHome } from '../../services/DriverService'

const DriverReviews = () => {
  const { driverId } = useParams() // get driverId from route params
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true)
        const data = await fetchDriverReviewsHome(driverId)
        setReviews(data)
      } catch (err) {
        setError("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }

    if (driverId) {
      loadReviews()
    }
  }, [driverId])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      counts[review.rating]++
    })
    return counts
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-50'
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-24 bg-gray-300 rounded-lg"></div>
                <div className="h-24 bg-gray-300 rounded-lg"></div>
                <div className="h-24 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Yet</h2>
            <p className="text-gray-600">This driver hasn't received any reviews yet. Be the first to share your experience!</p>
          </div>
        </div>
      </div>
    )
  }

  const ratingCounts = getRatingCounts()
  const averageRating = getAverageRating()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Driver Reviews</h1>
            <p className="text-gray-600">See what passengers are saying about this driver</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center bg-blue-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
            </div>

            {/* Total Reviews */}
            <div className="text-center bg-green-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">{reviews.length}</div>
              <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
              <div className="text-xs text-gray-500">
                {reviews.length === 1 ? 'Review' : 'Reviews'}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="text-center bg-purple-50 rounded-xl p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {reviews.length > 0 ? formatDate(reviews[0].createdAt).split(',')[0] : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Latest Review</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <span className="w-4 text-sm font-medium text-gray-700">{rating}</span>
                  <span className="text-yellow-400 mx-2">★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mx-2">
                    <div
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(ratingCounts[rating] / reviews.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-gray-600 text-right">
                    {ratingCounts[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {review.passengerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {review.passengerName}
                    </h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.comment ? `"${review.comment}"` : "No additional comments provided."}
                </p>
              </div>

              {/* Review Footer */}
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Verified Ride
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6">
          <p className="text-gray-500 text-sm">
            Showing all {reviews.length} review{reviews.length !== 1 ? 's' : ''} for this driver
          </p>
        </div>
      </div>
    </div>
  )
}

export default DriverReviews