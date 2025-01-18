import { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeftRight, MapPin } from 'lucide-react';
import CarBackground from '../../Static/Image/road.jpeg';

export default function HomeBody() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [userRoles, setUserRoles] = useState([]); // Initialize userRoles state

  // Helper to format the days dynamically
  const generateDates = (startDate, daysCount) => {
    const dates = [];
    const options = { weekday: 'short' }; // Weekday format (e.g., Mon, Tue)

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const day = String(date.getDate()).padStart(2, '0');
      const weekday = new Intl.DateTimeFormat('en-US', options).format(date);
      const dateString = date.toISOString().split('T')[0];

      dates.push({ day, weekday, dateString, selected: i === 0 });
    }
    return dates;
  };

  const dates = generateDates(new Date(), 5); // Generate 5 days starting from today

  // Load user roles from localStorage when the component mounts
  useEffect(() => {
    const roleString = localStorage.getItem('user');
    const role = roleString ? JSON.parse(roleString) : null;
    const roles = role && role.roles ? role.roles : [];
    setUserRoles(roles);
    console.log('Current User Roles:', roles);
  }, []);

  const isSuperAdmin = userRoles.includes('SuperAdmin');
  const isAdmin = userRoles.includes('Admin');

  console.log('Current User Roles:', userRoles);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-sky-100 to-white">
      <div
        className="w-full h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${CarBackground})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 ">
          {/* Conditional Rendering for Admin/SuperAdmin */}
          {isSuperAdmin ? (
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-36">
              <h2 className="text-3xl font-bold text-center">SuperAdmin Dashboard</h2>
              <p className="text-center text-lg">Welcome to the SuperAdmin Dashboard</p>
            </div>
          ) : isAdmin ? (
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-36">
              <h2 className="text-3xl font-bold text-center">Admin Logged In</h2>
              <p className="text-center text-lg">Welcome, Admin. You can manage content here.</p>
            </div>
          ) : (
            // Remaining code for regular users
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-36">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto] gap-4 items-center">
                {/* From Location */}
                <div className="relative">
                  <div className="flex items-center border rounded-lg p-3 hover:border-blue-500">
                    <input
                      type="text"
                      placeholder="Start your adventure at?"
                      className="flex-1 outline-none"
                    />
                    <ChevronDown className="text-gray-400" />
                  </div>
                </div>

                {/* Swap Button */}
                <button className="p-2 rounded-full border hover:bg-gray-50">
                  <ArrowLeftRight className="text-gray-500" />
                </button>

                {/* To Location */}
                <div className="relative">
                  <div className="flex items-center border rounded-lg p-3 hover:border-blue-500">
                    <MapPin className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Your destination awaits at?"
                      className="flex-1 outline-none"
                    />
                    <ChevronDown className="text-gray-400" />
                  </div>
                </div>

                {/* Date Input */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-3 border rounded-lg hover:border-blue-500 outline-none"
                />
              </div>

              {/* Date Navigation */}
              <div className="flex justify-center space-x-4">
                {dates.map((date) => (
                  <button
                    key={date.dateString}
                    onClick={() => setSelectedDate(date.dateString)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${
                      date.dateString === selectedDate
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg font-semibold">{date.day}</span>
                    <span className="text-sm">{date.weekday}</span>
                  </button>
                ))}
              </div>

              {/* Search Button */}
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
