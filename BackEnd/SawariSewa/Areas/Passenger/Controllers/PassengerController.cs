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


    }
}
