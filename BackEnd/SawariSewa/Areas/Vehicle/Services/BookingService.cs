using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;
using SawariSewa.Services;

namespace SawariSewa.Areas.Vehicle.Services
{
    public class BookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookingService(ApplicationDbContext context, IEmailService emailService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _emailService = emailService;
            _userManager = userManager;
        }




        

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
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

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
                    DropOffPoint = vehicleAvailability.DropOffPoint,
                    RideStatus = "Not Started"
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

            // Construct the email content
            string emailBody = $@"
    <h2>Booking Confirmation</h2>
    <p>Dear {user.FirstName},</p>
    <p>Your seat has been successfully booked!</p>
    <p><strong>Seat Numbers:</strong> {string.Join(", ", seatNumberArray)}</p> <!-- Show the seat numbers -->
    <p><strong>Pickup Point:</strong> {vehicleAvailability.PickupPoint}</p>
    <p><strong>Drop Off Point:</strong> {vehicleAvailability.DropOffPoint}</p>
    <p><strong>Fare:</strong> {vehicleAvailability.Fare} NPR</p>
    <p><strong>Departure Date:</strong> {(vehicleAvailability.DepartureDate?.ToShortDateString() ?? "Not Available")}</p>
    <p><strong>Departure Time:</strong> {vehicleAvailability.DepartureTime}</p>
    <p><strong>Driver Name:</strong> {vehicleAvailability.DriverFirstName} {vehicleAvailability.DriverLastName}</p>
    <p><strong>Driver Number:</strong> {vehicleAvailability.DriverPhoneNumber}</p>
    <p><strong>Vehicle Number:</strong> {vehicleAvailability.VehicleNumber}</p>
    <p>Thank you for choosing Sawari Sewa!</p>";

            // Send email
            await _emailService.SendEmailAsync(user.Email, "Booking Confirmation - Sawari Sewa", emailBody);

            return true;
        }

        public async Task<bool> ReserveWholeVehicleAsync(int vehicleAvailabilityId, string userId)
        {
            // Retrieve vehicle availability details
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);

            if (vehicleAvailability == null)
                return false;

            // Check if all seats are available (no previous bookings)
            if (vehicleAvailability.BookedSeats > 0 || vehicleAvailability.AvailableSeats != vehicleAvailability.TotalSeats)
            {
                // Whole vehicle can't be reserved if any seat is already booked
                return false;
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return false;

            int totalSeatsToBook = vehicleAvailability.TotalSeats;

            // Book all seats one by one
            for (int i = 1; i <= totalSeatsToBook; i++)
            {
                var seatBooking = new SeatBookings
                {
                    VehicleAvailabilityId = vehicleAvailabilityId,
                    SeatNumber = i.ToString(), // Seat numbers: "1", "2", ..., "TotalSeats"
                    UserId = userId,
                    BookingDate = DateTime.UtcNow,
                    BookingStatus = "Confirmed",
                    Fare = vehicleAvailability.Fare,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PickupPoint = vehicleAvailability.PickupPoint,
                    DropOffPoint = vehicleAvailability.DropOffPoint,
                    RideStatus = "Not Started"
                };

                _context.SeatBookings.Add(seatBooking);
            }

            // Update vehicle seat counts
            vehicleAvailability.BookedSeats = totalSeatsToBook;
            vehicleAvailability.AvailableSeats = 0;

            _context.VehicleAvailability.Update(vehicleAvailability);
            await _context.SaveChangesAsync();

            // Email confirmation
            string emailBody = $@"
<h2>Full Vehicle Reservation Confirmed</h2>
<p>Dear {user.FirstName},</p>
<p>You have successfully reserved the entire vehicle.</p>
<p><strong>Total Seats Reserved:</strong> {totalSeatsToBook}</p>
<p><strong>Pickup Point:</strong> {vehicleAvailability.PickupPoint}</p>
<p><strong>Drop Off Point:</strong> {vehicleAvailability.DropOffPoint}</p>
<p><strong>Fare per seat:</strong> {vehicleAvailability.Fare} NPR</p>
<p><strong>Total Fare:</strong> {vehicleAvailability.Fare * totalSeatsToBook} NPR</p>
<p><strong>Departure Date:</strong> {(vehicleAvailability.DepartureDate?.ToShortDateString() ?? "Not Available")}</p>
<p><strong>Departure Time:</strong> {vehicleAvailability.DepartureTime}</p>
<p><strong>Vehicle Number:</strong> {vehicleAvailability.VehicleNumber}</p>
<p>Thank you for choosing Sawari Sewa!</p>";

            await _emailService.SendEmailAsync(user.Email, "Full Vehicle Reservation - Sawari Sewa", emailBody);

            return true;
        }


        // New method for manual seat booking (without UserId)
        //public async Task<bool> ManualBookSeatAsync(string seatNumber, string passengerName, string passengerContact, string driverUserId)
        //{
        //    // Check if the driver is approved
        //    var approvedDriver = await _context.ApprovedDrivers
        //        .FirstOrDefaultAsync(d => d.UserId == driverUserId);

        //    if (approvedDriver == null)
        //        return false;

        //    // Check if there's available vehicle for this driver
        //    var vehicleAvailability = await _context.VehicleAvailability
        //        .FirstOrDefaultAsync(v => v.DriverFirstName == approvedDriver.FirstName &&
        //                                  v.DriverLastName == approvedDriver.LastName &&
        //                                  v.VehicleNumber == approvedDriver.VehicleNumber);

        //    if (vehicleAvailability == null || vehicleAvailability.AvailableSeats <= 0)
        //        return false;

        //    // Create the seat booking with the driver's UserId
        //    var seatBooking = new SeatBookings
        //    {
        //        VehicleAvailabilityId = vehicleAvailability.Id,
        //        SeatNumber = seatNumber,
        //        UserId = driverUserId, // Use the driver's actual UserId instead of generating a random one
        //        ManualPassengerName = passengerName,
        //        ManualPassengerPhoneNumber = passengerContact,
        //        BookingDate = DateTime.UtcNow,
        //        BookingStatus = "Confirmed",
        //        Fare = vehicleAvailability.Fare,
        //        CreatedAt = DateTime.UtcNow,
        //        UpdatedAt = DateTime.UtcNow,
        //        PickupPoint = vehicleAvailability.PickupPoint,
        //        DropOffPoint = vehicleAvailability.DropOffPoint,
        //        RideStatus = "Not Started"
        //    };

        //    // Add booking to the context
        //    _context.SeatBookings.Add(seatBooking);

        //    // Update vehicle availability
        //    vehicleAvailability.AvailableSeats -= 1;
        //    vehicleAvailability.BookedSeats += 1;
        //    _context.VehicleAvailability.Update(vehicleAvailability);

        //    await _context.SaveChangesAsync();

        //    return true;
        //}

        public async Task<bool> ManualBookSeatAsync(string seatNumbers, string passengerName, string passengerContact, string driverUserId)
        {
            // Check if the driver is approved
            var approvedDriver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == driverUserId);

            if (approvedDriver == null)
                return false;

            // Get vehicle availability for the driver
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v =>
                    v.DriverFirstName == approvedDriver.FirstName &&
                    v.DriverLastName == approvedDriver.LastName &&
                    v.VehicleNumber == approvedDriver.VehicleNumber);

            if (vehicleAvailability == null)
                return false;

            // ✅ Split and sanitize seat numbers
            var seatNumberArray = seatNumbers
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => !string.IsNullOrEmpty(s))
                .ToArray();

            // ✅ Ensure enough available seats
            if (vehicleAvailability.AvailableSeats < seatNumberArray.Length)
                return false;

            // ✅ Create one booking per seat
            foreach (var seatNumber in seatNumberArray)
            {
                var seatBooking = new SeatBookings
                {
                    VehicleAvailabilityId = vehicleAvailability.Id,
                    SeatNumber = seatNumber,
                    UserId = driverUserId,
                    ManualPassengerName = passengerName,
                    ManualPassengerPhoneNumber = passengerContact,
                    BookingDate = DateTime.UtcNow,
                    BookingStatus = "Confirmed",
                    Fare = vehicleAvailability.Fare,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PickupPoint = vehicleAvailability.PickupPoint,
                    DropOffPoint = vehicleAvailability.DropOffPoint,
                    RideStatus = "Not Started"
                };

                _context.SeatBookings.Add(seatBooking);
            }

            // ✅ Update available and booked seat counts properly
            int seatsBooked = seatNumberArray.Length;
            vehicleAvailability.AvailableSeats -= seatsBooked;
            vehicleAvailability.BookedSeats += seatsBooked;

            _context.VehicleAvailability.Update(vehicleAvailability);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ManualReserveAllSeatsAsync(string passengerName, string passengerContact, string driverUserId)
        {
            // Check if the driver is approved
            var approvedDriver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == driverUserId);

            if (approvedDriver == null)
                return false;

            // Get the associated vehicle schedule
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverFirstName == approvedDriver.FirstName &&
                                          v.DriverLastName == approvedDriver.LastName &&
                                          v.VehicleNumber == approvedDriver.VehicleNumber);

            if (vehicleAvailability == null || vehicleAvailability.AvailableSeats <= 0)
                return false;

            var totalSeatsToBook = vehicleAvailability.AvailableSeats;

            var bookings = new List<SeatBookings>();
            for (int i = 1; i <= totalSeatsToBook; i++)
            {
                bookings.Add(new SeatBookings
                {
                    VehicleAvailabilityId = vehicleAvailability.Id,
                    SeatNumber = $"S{i}", // Format as S1, S2, etc.
                    UserId = driverUserId,
                    ManualPassengerName = passengerName,
                    ManualPassengerPhoneNumber = passengerContact,
                    BookingDate = DateTime.UtcNow,
                    BookingStatus = "Confirmed",
                    Fare = vehicleAvailability.Fare,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PickupPoint = vehicleAvailability.PickupPoint,
                    DropOffPoint = vehicleAvailability.DropOffPoint,
                    RideStatus = "Not Started"
                });
            }

            // Add all bookings
            await _context.SeatBookings.AddRangeAsync(bookings);

            // Update vehicle availability
            vehicleAvailability.BookedSeats += totalSeatsToBook;
            vehicleAvailability.AvailableSeats = 0;
            _context.VehicleAvailability.Update(vehicleAvailability);

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