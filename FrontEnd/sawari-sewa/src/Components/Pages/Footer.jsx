// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className="bg-blue-600 text-white py-8 px-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 tracking-wider">QUICK LINKS</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Vehicle Ticketing</a></li>
//             </ul>
//           </div>

//           {/* Top Routes */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 tracking-wider">TOP ROUTES</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Pokhara</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Pokhara - Kathmandu</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Butwal</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Butwal - Kathmandu</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Baglung</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Chitwan</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Kakadivitta</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Nepalgunj</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Biratnagar</a></li>
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Kathmandu - Dang</a></li>
//             </ul>
//           </div>


//           {/* Payment Partners */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4 tracking-wider">PAYMENT PARTNERS</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-blue-200 transition-colors">Esewa</a></li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sawari Sewa</h3>
            <p className="text-gray-300 text-sm">
              Your trusted partner for online vehicle ticketing. Book tickets for various types of vehicles with ease and convenience.
            </p>
          </div>

          {/* Top Routes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wider">TOP ROUTES</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Pokhara</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Pokhara - Kathmandu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Butwal</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Butwal - Kathmandu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Baglung</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Chitwan</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Kakadivitta</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Nepalgunj</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Biratnagar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-200 transition-colors">Kathmandu - Dang</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>📧 info@sawarisewa.com</p>
              <p>📞 (+977) 123-4567</p>
            </div>
          </div>
        </div>

        
        
      </div>
    </footer>
  );
};

export default Footer;