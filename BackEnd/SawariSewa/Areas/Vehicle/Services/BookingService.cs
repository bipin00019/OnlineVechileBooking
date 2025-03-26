using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;

namespace SawariSewa.Areas.Vehicle.Services
{
    public class BookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        //public async Task<bool> BookSeatAsync(int vehicleAvailabilityId, string userId, string seatNumber)
        //{
        //    // Retrieve the vehicle availability details
        //    var vehicleAvailability = await _context.VehicleAvailability
        //    .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);


        //    if (vehicleAvailability == null || vehicleAvailability.AvailableSeats <= 0)
        //    {
        //        // No vehicle available or no seats left
        //        return false;
        //    }

        //    // Create a new seat booking
        //    var seatBooking = new SeatBookings
        //    {
        //        VehicleAvailabilityId = vehicleAvailabilityId,
        //        SeatNumber = seatNumber,
        //        UserId = userId,
        //        BookingDate = DateTime.UtcNow,
        //        BookingStatus = "Confirmed",
        //        Fare = vehicleAvailability.Fare,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow,
        //        PickupPoint = vehicleAvailability.PickupPoint,
        //        DropOffPoint = vehicleAvailability.DropOffPoint
        //    };

        //    // Add the seat booking to the database
        //    _context.SeatBookings.Add(seatBooking);

        //    // Decrease the available seats and increase the booked seats
        //    vehicleAvailability.AvailableSeats -= 1;
        //    vehicleAvailability.BookedSeats += 1;

        //    // Update the vehicle availability in the database
        //    _context.VehicleAvailability.Update(vehicleAvailability);

        //    // Save the changes to the database
        //    await _context.SaveChangesAsync();

        //    return true;
        //}



        public async Task<bool> BookSeatAsync(int vehicleAvailabilityId, string userId, string seatNumbers)
        {
            // Retrieve the vehicle availability details
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);

            if (vehicleAvailability == null)
            {
                // No vehicle available
                return false;
            }

            // Split the seat numbers string by comma
            var seatNumberArray = seatNumbers.Split(',').Select(s => s.Trim()).ToArray();

            // Check if there are enough available seats
            if (vehicleAvailability.AvailableSeats < seatNumberArray.Length)
            {
                // Not enough seats available
                return false;
            }

            // Create a new seat booking for each seat number
            foreach (var seatNumber in seatNumberArray)
            {
                var seatBooking = new SeatBookings
                {
                    VehicleAvailabilityId = vehicleAvailabilityId,
                    SeatNumber = seatNumber, // Individual seat number
                    UserId = userId,
                    BookingDate = DateTime.UtcNow,
                    BookingStatus = "Confirmed",
                    Fare = vehicleAvailability.Fare,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PickupPoint = vehicleAvailability.PickupPoint,
                    DropOffPoint = vehicleAvailability.DropOffPoint
                };

                // Add the seat booking to the database
                _context.SeatBookings.Add(seatBooking);
            }

            // Update available and booked seats counts based on total number of seats booked
            vehicleAvailability.AvailableSeats -= seatNumberArray.Length;
            vehicleAvailability.BookedSeats += seatNumberArray.Length;

            // Update the vehicle availability in the database
            _context.VehicleAvailability.Update(vehicleAvailability);

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return true;
        }


        // Method to get booked seat numbers for a specific vehicle availability
        public async Task<List<string>> GetBookedSeatsAsync(int vehicleAvailabilityId)
        {
            return await _context.SeatBookings
                .Where(sb => sb.VehicleAvailabilityId == vehicleAvailabilityId && sb.BookingStatus == "Confirmed")
                .Select(sb => sb.SeatNumber)
                .ToListAsync();
        }
    }
}