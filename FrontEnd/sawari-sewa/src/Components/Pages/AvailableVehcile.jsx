"use client"

import { useState } from "react"

const AvailableVehicle = () => {
  const [selectedTab, setSelectedTab] = useState("All")
  const [departureFilters, setDepartureFilters] = useState([])
  const [busTypeFilters, setBusTypeFilters] = useState([])

  const handleDepartureFilter = (filter) => {
    if (departureFilters.includes(filter)) {
      setDepartureFilters(departureFilters.filter((item) => item !== filter))
    } else {
      setDepartureFilters([...departureFilters, filter])
    }
  }

  const handleBusTypeFilter = (filter) => {
    if (busTypeFilters.includes(filter)) {
      setBusTypeFilters(busTypeFilters.filter((item) => item !== filter))
    } else {
      setBusTypeFilters([...busTypeFilters, filter])
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-medium text-gray-700">Kathmandu to Pokhara Bus Tickets</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <a href="#" className="text-blue-500">
                Home
              </a>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-600">Kathmandu to Pokhara</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <div className="border bg-white rounded flex items-center justify-between p-3">
              <span className="text-gray-700">Kathmandu</span>
              <button className="text-gray-500">×</button>
            </div>
          </div>

          <div className="flex items-center justify-center bg-gray-200 w-10 h-10 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>

          <div className="relative flex-1">
            <div className="border bg-white rounded flex items-center justify-between p-3">
              <span className="text-gray-700">Pokhara</span>
              <button className="text-gray-500">×</button>
            </div>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              className="w-full border rounded p-3"
              placeholder="YYYY-MM-DD"
              value="2081-11-22"
              readOnly
            />
          </div>

          <button className="bg-blue-600 text-white rounded px-6 py-3 font-medium">Search</button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-4">
        <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="text-xl font-medium">2081-11-22</div>

        <button className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-64 space-y-6">
            {/* Departure Time Filter */}
            <div>
              <h3 className="text-lg font-medium mb-2">Departure Time</h3>
              <div className="space-y-2">
                <button
                  className={`border rounded py-2 px-4 w-full text-left ${departureFilters.includes("before10am") ? "bg-blue-50 border-blue-500" : "bg-white"}`}
                  onClick={() => handleDepartureFilter("before10am")}
                >
                  Before 10 AM
                </button>
                
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <h3 className="text-lg font-medium mb-2">Vehicle Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`border rounded py-2 px-4 text-center ${busTypeFilters.includes("ac") ? "bg-blue-50 border-blue-500" : "bg-white"}`}
                  onClick={() => handleBusTypeFilter("ac")}
                >
                  Bike
                </button>
              </div>
            </div>

            
          </div>

          {/* Right Content - Results */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
                <button
                    key="All"
                    className={`px-6 py-3 font-medium whitespace-nowrap ${selectedTab === "All" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    onClick={() => setSelectedTab("All")}
                >
                    All
                </button>
            </div>

            {/* Bus Listing */}
            <div className="mt-4">
              <div className="border rounded-lg bg-white p-4 mb-4">
                <div className="flex flex-col lg:flex-row">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium">Vehicle Type and Driver name</h3>
                    </div>
                   

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold">Kathmandu</div>
                        
                      </div>

                      <div className="flex flex-col items-center">
                        
                        <div className="w-24 h-0.5 bg-gray-300 my-2 relative">
                          <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-1 -top-0.5"></div>
                          <div className="absolute w-2 h-2 bg-gray-300 rounded-full -right-1 -top-0.5"></div>
                        </div>
                      </div>

                      <div>
                        <div className="text-2xl font-bold">Pokhara</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                    
                      <div>|</div>
                      <div>Boarding & Dropping</div>
                      <div>|</div>
                      <div>Reviews</div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="lg:w-64 mt-4 lg:mt-0 lg:ml-4 lg:border-l lg:pl-4 flex flex-col justify-between">
                    <div>
                      <div className="text-3xl font-bold">Rs.1200</div>
                      <div className="mt-2 text-gray-600">12 Seats Available</div>
                    </div>

                    <button className="bg-blue-600 text-white rounded px-4 py-2 font-medium mt-4 lg:mt-0">
                      View Seats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailableVehicle

