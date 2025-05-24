import React from 'react';
import { CheckCircle } from 'lucide-react';
import bgg from '../../Static/Image/bgg.jpeg';
import homevideo from '../../Static/Videos/homevideo.mp4';
const HomeBody1 = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-500 opacity-90 z-0" />
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1]" 
        style={{ 
          backgroundImage: `url(${bgg})`, 
          //filter: 'brightness(1)'
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Phone mockup */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-[500px]">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-gray-800 rounded-[40px] shadow-2xl" />
              
              {/* Phone screen */}
              <div 
                className="absolute inset-[8px] rounded-[32px] overflow-hidden bg-white"
                style={{ 
                  backgroundImage: `url(${bgg})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top'
                }}
              >
                {/* App content would go here */}
                <div className="w-full h-full flex flex-col">
                  <div className="bg-blue-600 text-white p-3 text-center font-bold">
                    Sawari Sewa
                  </div>
                </div>
              </div>
              
              {/* Phone buttons */}
              <div className="absolute -right-1 top-24 h-12 w-1 bg-gray-700 rounded-l-md" />
              <div className="absolute -left-1 top-20 h-8 w-1 bg-gray-700 rounded-r-md" />
              <div className="absolute -left-1 top-32 h-8 w-1 bg-gray-700 rounded-r-md" />
              <div className="absolute -left-1 top-44 h-8 w-1 bg-gray-700 rounded-r-md" />
            </div>
          </div>
          
          {/* Content */}
          <div className="w-full md:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Make Your Travel Memorable
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Use Sawari Sewa App
            </h2>
            
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-semibold">Trusted By Millions</h3>
                  <p className="text-gray-200">
                    Trusted by 300+ operators and millions of passengers.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-semibold">Lightning Fast</h3>
                  <p className="text-gray-200">
                    Bus ticketing is now quick and easy, grab your phone and see the miracle.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-semibold">Exceptional support</h3>
                  <p className="text-gray-200">
                    Experience attentive, responsive, and personalized care available from 6 AM to 9 PM.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="flex items-start gap-3">
                <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-semibold">Other Stuffs</h3>
                  <p className="text-gray-200">
                    Dynamic prices, package bookings and multiple offers.
                  </p>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBody1;