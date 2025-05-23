using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.Services;
using SawariSewa.Areas.Vehicle.DTO;
using SawariSewa.Data;
using System.Security.Claims;
using System.Text.RegularExpressions;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Services;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        public BookingController(ApplicationDbContext context, IEmailService emailService, BookingService bookingService)
        {
            _context = context;
            _bookingService = bookingService;
            _emailService = emailService;

        }

        [HttpPost("book-seat")]
        [Authorize]  // Ensure the user is authenticated
        public async Task<IActionResult> BookSeat(int vehicleAvailabilityId, string seatNumber)
        {
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // Get the logged-in user's ID

            var result = await _bookingService.BookSeatAsync(vehicleAvailabilityId, userId, seatNumber);

            if (!result)
            {
                return BadRequest("Booking failed or no available seats.");
            }

            return Ok("Seat booked successfully.");
        }

        [HttpPost("reserve-whole-vehicle")]
        [Authorize]
        public async Task<IActionResult> ReserveWholeVehicle(int vehicleAvailabilityId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _bookingService.ReserveWholeVehicleAsync(vehicleAvailabilityId, userId);

            if (!result)
            {
                return BadRequest(new { success = false, message = "Whole vehicle reservation failed. It might already have some seats booked." });
            }

            return Ok(new { success = true, message = "Whole vehicle reserved successfully." });
        }

        //[HttpGet("can-reserve-whole-vehicle")]

        //public async Task<IActionResult> CanReserveWholeVehicle(int vehicleAvailabilityId)
        //{
        //    var vehicleAvailability = await _context.VehicleAvailability
        //        .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);

        //    if (vehicleAvailability == null)
        //    {
        //        return Ok(new { canReserve = false, message = "No schedule available for this vehicle." });
        //    }

        //    if (vehicleAvailability.TotalSeats == vehicleAvailability.AvailableSeats)
        //    {
        //        return Ok(new { canReserve = true, message = "Whole vehicle can be reserved." });
        //    }

        //    return Ok(new { canReserve = false, message = "Some seats are already booked. Whole vehicle cannot be reserved." });
        //}

        [HttpGet("can-reserve-whole-vehicle")]
        public async Task<IActionResult> CanReserveWholeVehicle(int vehicleAvailabilityId)
        {
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);

            if (vehicleAvailability == null)
            {
                return Ok(new { canReserve = false, message = "No schedule available for this vehicle." });
            }

            if (vehicleAvailability.AvailableSeats == 1)
            {
                return Ok(new { canReserve = false, message = "Only one seat is available. Whole vehicle cannot be reserved." });
            }

            if (vehicleAvailability.TotalSeats == vehicleAvailability.AvailableSeats)
            {
                return Ok(new { canReserve = true, message = "Whole vehicle can be reserved." });
            }

            return Ok(new { canReserve = false, message = "Some seats are already booked. Whole vehicle cannot be reserved." });
        }



        [HttpPost("manual-book-seat")]
            [Authorize(Roles = "Driver")] // Ensure only drivers can access this endpoint
            public async Task<IActionResult> ManualBookSeat(string seatNumber, string passengerName, string passengerContact)
            {
                // Validate inputs
                if (string.IsNullOrWhiteSpace(seatNumber))
                {
                    return BadRequest(new { success = false, message = "Seat number is required." });
                }

                if (string.IsNullOrWhiteSpace(passengerName))
                {
                    return BadRequest(new { success = false, message = "Passenger name is required." });
                }

                // Validate passenger contact is exactly 10 digits
                if (string.IsNullOrWhiteSpace(passengerContact) || !Regex.IsMatch(passengerContact, @"^\d{10}$"))
                {
                    return BadRequest(new { success = false, message = "Contact number must be exactly 10 digits." });
                }

                // Get the driver's UserId from the logged-in user
                var driverUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Call the service method to perform the manual booking
                var result = await _bookingService.ManualBookSeatAsync(
                    seatNumber,
                    passengerName.Trim(),
                    passengerContact,
                    driverUserId // Pass the driverUserId to the service
                );

                // Handle the result of the booking
                if (!result)
                {
                    return BadRequest(new { success = false, message = "Manual booking failed. Make sure you're an active driver with available trips." });
                }

                return Ok(new { success = true, message = "Seat manually booked successfully." });
            }

        [HttpPost("manual-reserve-all-seats")]
        [Authorize(Roles = "Driver")] // Only drivers can access this
        public async Task<IActionResult> ManualReserveAllSeats(string passengerName, string passengerContact)
        {
            // Validate inputs
            if (string.IsNullOrWhiteSpace(passengerName))
            {
                return BadRequest(new { success = false, message = "Passenger name is required." });
            }

            // Validate passenger contact is exactly 10 digits
            if (string.IsNullOrWhiteSpace(passengerContact) || !Regex.IsMatch(passengerContact, @"^\d{10}$"))
            {
                return BadRequest(new { success = false, message = "Contact number must be exactly 10 digits." });
            }

            // Get the driver's UserId from the logged-in user
            var driverUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Call the service method to perform the full seat reservation
            var result = await _bookingService.ManualReserveAllSeatsAsync(
                passengerName.Trim(),
                passengerContact,
                driverUserId
            );

            // Handle the result of the booking
            if (!result)
            {
                return BadRequest(new { success = false, message = "Manual reservation failed. Make sure you're an approved driver with available seats." });
            }

            return Ok(new { success = true, message = "All seats have been manually reserved successfully." });
        }

        // API endpoint to get booked seats
        [HttpGet("GetBookedSeats/{vehicleAvailabilityId}")]
        public async Task<IActionResult> GetBookedSeats(int vehicleAvailabilityId)
        {
            var bookedSeats = await _bookingService.GetBookedSeatsAsync(vehicleAvailabilityId);

            // Return an empty list if no booked seats are found (instead of a 404)
            if (bookedSeats == null || bookedSeats.Count == 0)
            {
                return Ok(new { bookedSeats = new List<string>() }); // Empty list instead of 404
            }

            return Ok(new { bookedSeats });
        }

        //POST api/booking/cancel
        //[HttpPost("cancel")]
        //[Authorize]
        // public async Task<IActionResult> CancelBooking([FromBody] CancelBookingRequest request)
        // {
        //     // Get userId from logged-in user token
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     if (string.IsNullOrEmpty(userId))
        //         return Unauthorized("User not found");

        //     var booking = await _context.SeatBookings.FindAsync(request.BookingId);
        //     if (booking == null)
        //         return NotFound("Booking not found");

        //     if (booking.UserId != userId)
        //         return Unauthorized("You can only cancel your own bookings");


        //     // Save cancellation info with fixed reason
        //     var cancelledBooking = new CancelledBooking
        //     {
        //         BookingId = request.BookingId,
        //         UserId = userId,
        //         KhaltiWalletNumber = request.KhaltiWalletNumber,
        //         Fare = booking.Fare,
        //         Reason = "User requested cancellation",
        //         CancelledAt = DateTime.UtcNow,
        //         IsRefunded = false // default to false initially
        //     };

        //     _context.CancelledBookings.Add(cancelledBooking);

        //     // Optionally update booking status
        //     booking.BookingStatus = "Cancelled";
        //     booking.RideStatus = "Cancelled";

        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Booking canceled successfully" });
        // }

        //        [HttpPost("cancel")]
        //        [Authorize]
        //        public async Task<IActionResult> CancelBooking([FromBody] CancelBookingRequest request)
        //        {
        //            if (!ModelState.IsValid)
        //            {
        //                return BadRequest(ModelState);
        //            }

        //            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //            if (string.IsNullOrEmpty(userId))
        //            {
        //                return Unauthorized("User not found");
        //            }

        //            var booking = await _context.SeatBookings
        //                .FirstOrDefaultAsync(b => b.BookingId == request.BookingId);

        //            if (booking == null)
        //            {
        //                return NotFound("Booking not found");
        //            }

        //            if (booking.UserId != userId)
        //            {
        //                return Forbid("You can only cancel your own bookings");
        //            }

        //            var cancelledBooking = new CancelledBookings
        //            {
        //                BookingId = request.BookingId,
        //                UserId = userId,
        //                KhaltiWalletNumber = request.KhaltiWalletNumber,
        //                Fare = booking.Fare,
        //                Reason = "User requested cancellation",
        //                CancelledAt = DateTime.UtcNow,
        //                IsRefunded = false
        //            };

        //            // Load the related VehicleAvailability record
        //            var vehicleAvailability = await _context.VehicleAvailability
        //                .FirstOrDefaultAsync(v => v.Id == booking.VehicleAvailabilityId);

        //            if (vehicleAvailability == null)
        //            {
        //                return NotFound("Associated vehicle availability record not found.");
        //            }

        //            try
        //            {
        //                // Update available and booked seats
        //                vehicleAvailability.AvailableSeats += 1;
        //                vehicleAvailability.BookedSeats -= 1;

        //                _context.CancelledBookings.Add(cancelledBooking);
        //                _context.SeatBookings.Remove(booking);

        //                // Save all changes
        //                await _context.SaveChangesAsync();
        //            }
        //            catch (Exception ex)
        //            {
        //                return StatusCode(500, $"Error processing cancellation: {ex.Message}");
        //            }

        //            var user = await _context.Users.FindAsync(userId);
        //            if (user != null)
        //            {
        //                try
        //                {
        //                    var emailBody = $@"
        //Dear {user.FirstName},

        //Your booking (ID: {request.BookingId}) has been successfully cancelled.
        //A refund will be processed shortly to your Khalti wallet: {request.KhaltiWalletNumber}.

        //Thank you for using Sawari Sewa.

        //Best regards,
        //Sawari Sewa Team";

        //                    await _emailService.SendEmailAsync(user.Email, "Booking Cancellation Confirmation", emailBody);
        //                }
        //                catch (Exception emailEx)
        //                {
        //                    // Optionally log this failure
        //                }
        //            }

        //            return Ok(new { message = "Booking cancelled successfully and email notification sent." });
        //        }

        [HttpPost("cancel")]
        [Authorize]
        public async Task<IActionResult> CancelBooking([FromBody] CancelBookingRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var booking = await _context.SeatBookings
                .FirstOrDefaultAsync(b => b.BookingId == request.BookingId);

            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            if (booking.UserId != userId)
            {
                return Forbid("You can only cancel your own bookings");
            }

            // Load related VehicleAvailability record
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.Id == booking.VehicleAvailabilityId);

            if (vehicleAvailability == null)
            {
                return NotFound("Associated vehicle availability record not found.");
            }

            // Check departure date existence
            if (vehicleAvailability.DepartureDate == null)
            {
                return BadRequest("Departure date is not set for this vehicle availability.");
            }

            var departureDate = vehicleAvailability.DepartureDate.Value.Date;
            var cancellationDate = DateTime.UtcNow.Date;

            var daysBeforeDeparture = (departureDate - cancellationDate).Days;

            // Cancel not allowed on same day or after departure
            if (daysBeforeDeparture < 1)
            {
                return BadRequest("Cancellation unavailable for the same day or after departure.");
            }

            decimal refundPercentage = daysBeforeDeparture switch
            {
                >= 3 => 0.90m,  // 90% refund, 10% penalty
                2 => 0.50m,     // 50% refund, 50% penalty
                1 => 0.10m,     // 10% refund, 90% penalty
                _ => 0m         // fallback (should not reach here)
            };

            decimal refundableFare = booking.Fare * refundPercentage;

            var cancelledBooking = new CancelledBookings
            {
                BookingId = request.BookingId,
                UserId = userId,
                KhaltiWalletNumber = request.KhaltiWalletNumber,
                Fare = refundableFare,  // Refund amount after penalty
                Reason = "User requested cancellation",
                CancelledAt = DateTime.UtcNow,
                IsRefunded = false
            };

            try
            {
                // Update seat counts
                vehicleAvailability.AvailableSeats += 1;
                vehicleAvailability.BookedSeats -= 1;

                _context.CancelledBookings.Add(cancelledBooking);
                _context.SeatBookings.Remove(booking);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing cancellation: {ex.Message}");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                try
                {
                    var emailBody = $@"
Dear {user.FirstName},

Your booking (ID: {request.BookingId}) has been successfully cancelled.
A refund of NPR {refundableFare:N2} will be processed shortly to your Khalti wallet: {request.KhaltiWalletNumber}.

Thank you for using Sawari Sewa.

Best regards,
Sawari Sewa Team";

                    await _emailService.SendEmailAsync(user.Email, "Booking Cancellation Confirmation", emailBody);
                }
                catch
                {
                    // Log email sending failure optionally
                }
            }

            return Ok(new { message = "Booking cancelled successfully and email notification sent.", refundableFare });
        }


        [HttpGet("cancelled-bookings")]
        public async Task<IActionResult> GetCancelledBookings(int page = 1)
        {
            int pageSize = 10;

            var query = _context.CancelledBookings
                .Include(cb => cb.User)
                .OrderByDescending(cb => cb.CancelledAt);

            var totalRecords = await query.CountAsync();
            var cancelledBookings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(cb => new
                {
                    cb.Id,
                    cb.BookingId,
                    cb.UserId,
                    cb.KhaltiWalletNumber,
                    cb.Fare,
                    cb.CancelledAt,
                    cb.Reason,
                    cb.IsRefunded,
                    User = new
                    {
                        cb.User.FirstName,
                        cb.User.LastName,
                        cb.User.Email
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                Page = page,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                Data = cancelledBookings
            });
        }

    }
}

