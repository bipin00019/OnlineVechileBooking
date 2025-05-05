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

        // GET: api/Passenger/booking-history
        [HttpGet("booking-history")]
        public async Task<IActionResult> GetPassengerBookingHistory(int pageNumber = 1, int pageSize = 8)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found.");

            // Ensure valid page size and page number
            if (pageSize <= 0) pageSize = 8; // Default size is 8 if pageSize <= 0
            if (pageNumber <= 0) pageNumber = 1; // Default to first page if pageNumber <= 0

            var totalBookings = await _context.PassengerBookingHistory
                                              .Where(h => h.UserId == userId)
                                              .CountAsync(); // Get total count for pagination

            var history = await _context.PassengerBookingHistory
                                        .Where(h => h.UserId == userId)
                                        .OrderByDescending(h => h.BookingDate)
                                        .Skip((pageNumber - 1) * pageSize) // Skip previous pages
                                        .Take(pageSize) // Take only the current page's records
                                        .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalBookings / pageSize);

            // Return the paginated result
            return Ok(new
            {
                TotalBookings = totalBookings,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                BookingHistory = history
            });
        }

    }
}
