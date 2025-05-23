using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data; // Adjust this if your DbContext is in a different namespace
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SawariSewa.Areas.Passenger.Controllers
{
    [Area("Passenger")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = "Passenger")]
    public class PassengerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PassengerController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("booking-history")]
        public async Task<IActionResult> GetPassengerBookingHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found.");

            var history = await _context.PassengerBookingHistory
                                        .Where(h => h.UserId == userId)
                                        .OrderByDescending(h => h.BookingDate)
                                        .Select(h => new
                                        {
                                            h.HistoryId,
                                            h.DriverId,
                                            h.DriverName,
                                            h.DriverPhoneNumber,
                                            h.VehicleNumber,
                                            h.VehicleType,
                                            h.BookingDate,
                                            h.CompletedAt,
                                            h.Fare,
                                            h.PickupPoint,
                                            h.DropOffPoint,
                                            h.Reviewed,
                                            CanGiveReview = h.CompletedAt != null && (h.Reviewed == null || h.Reviewed == false)
                                        })
                                        .ToListAsync();

            return Ok(history);
        }

        //[HttpGet("my-bookings")]
        //public async Task<IActionResult> GetMyGroupedBookings()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    if (string.IsNullOrEmpty(userId))
        //        return Unauthorized("User ID not found in token");

        //    var groupedBookings = await _context.SeatBookings
        //        .Where(b => b.UserId == userId)
        //        .GroupBy(b => new
        //        {
        //            b.BookingDate,
        //            b.BookingStatus,
        //            b.PickupPoint,
        //            b.DropOffPoint
        //        })
        //        .Select(g => new
        //        {
        //            BookingDate = g.Key.BookingDate,
        //            BookingStatus = g.Key.BookingStatus,
        //            PickupPoint = g.Key.PickupPoint,
        //            DropOffPoint = g.Key.DropOffPoint,
        //            SeatNumbers = g.Select(b => b.SeatNumber).ToList()
        //        })
        //        .OrderByDescending(g => g.BookingDate)
        //        .ToListAsync();

        //    return Ok(groupedBookings);
        //}

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyGroupedBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            var userBookings = await _context.SeatBookings
                .Where(b => b.UserId == userId)
                .Include(b => b.VehicleAvailability)
                .ToListAsync();

            var grouped = userBookings
                .GroupBy(b => b.VehicleAvailabilityId)
                .Select(g =>
                {
                    var first = g.First(); // Get shared info from any item in group
                    var vehicle = first.VehicleAvailability;

                    return new
                    {
                        VehicleAvailabilityId = g.Key,
                        BookingIds = g.Select(x => x.BookingId).ToList(),
                        BookingDate = first.BookingDate,
                        BookingStatus = first.BookingStatus,
                        PickupPoint = first.PickupPoint,
                        DropOffPoint = first.DropOffPoint,
                        
                        TotalSeatsBooked = g.Count(),
                        SeatNumbers = g.Select(x => x.SeatNumber).ToList(),

                        DepartureDate = vehicle?.DepartureDate,
                        DepartureTime = vehicle?.DepartureTime,
                        VehicleNumber = vehicle?.VehicleNumber,
                        Fare = vehicle?.Fare,
                        Location = vehicle?.Location,
                        Destination = vehicle?.Destination
                    };
                })
                .OrderByDescending(x => x.BookingDate)
                .ToList();

            return Ok(grouped);
        }


    }
}
