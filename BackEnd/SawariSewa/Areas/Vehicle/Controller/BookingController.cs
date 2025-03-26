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

            if (bookedSeats == null || bookedSeats.Count == 0)
            {
                return NotFound("No booked seats found.");
            }

            return Ok(new { bookedSeats });
        }
    }
}
