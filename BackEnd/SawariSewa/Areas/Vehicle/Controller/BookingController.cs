using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SawariSewa.Areas.Vehicle.Services;
using System.Security.Claims;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
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
