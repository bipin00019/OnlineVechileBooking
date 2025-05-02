using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.Services;
using SawariSewa.Areas.Vehicle.DTO;
using SawariSewa.Data;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context, BookingService bookingService)
        {
            _context = context;
            _bookingService = bookingService;
        }

        [HttpPost("book-seat")]
        [Authorize]  // Ensure the user is authenticated
        public async Task<IActionResult> BookSeat(int vehicleAvailabilityId, string seatNumber)
        {
            // Log the type of the inputs
            Console.WriteLine($"Type of vehicleAvailabilityId: {vehicleAvailabilityId.GetType()}");
            Console.WriteLine($"Type of seatNumber: {seatNumber.GetType()}");
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

        [HttpGet("can-reserve-whole-vehicle")]
        
        public async Task<IActionResult> CanReserveWholeVehicle(int vehicleAvailabilityId)
        {
            var vehicleAvailability = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.Id == vehicleAvailabilityId);

            if (vehicleAvailability == null)
            {
                return Ok(new { canReserve = false, message = "No schedule available for this vehicle." });
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
    }
}

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using SawariSewa.Areas.Vehicle.Services;
//using System.Security.Claims;

//[Route("api/[controller]")]
//[ApiController]
//public class PaymentController : ControllerBase
//{
//    private readonly IPaymentService _paymentService;
//    private readonly IBookingService _bookingService;

//    public PaymentController(IPaymentService paymentService, IBookingService bookingService)
//    {
//        _paymentService = paymentService;
//        _bookingService = bookingService;
//    }

//    [HttpPost("process-payment")]
//    [Authorize]
//    public async Task<IActionResult> ProcessPayment(int vehicleAvailabilityId, decimal amount, string paymentToken, string seatNumbers)
//    {
//        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the logged-in user's ID

//        // Step 1: Process payment
//        var paymentSuccess = await _paymentService.ProcessPaymentAsync(vehicleAvailabilityId, amount, paymentToken, userId);

//        if (!paymentSuccess)
//        {
//            return BadRequest("Payment failed.");
//        }

//        // Step 2: Once payment is successful, book the seat
//        var bookingSuccess = await _bookingService.BookSeatAsync(vehicleAvailabilityId, userId, seatNumbers);

//        if (bookingSuccess)
//        {
//            return Ok(new { status = "Booking successful" });
//        }

//        return BadRequest("Failed to confirm booking.");
//    }
//}
