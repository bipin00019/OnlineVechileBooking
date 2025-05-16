using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SawariSewa.Areas.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("daily-booking-counts")]
        public async Task<IActionResult> GetDailyBookingCounts()
        {
            try
            {
                var rawData = await _context.SeatBookings
                    .GroupBy(b => b.BookingDate.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        Count = g.Count()
                    })
                    .OrderBy(g => g.Date)
                    .ToListAsync();

                // Format date in-memory after data is fetched from DB
                var result = rawData.Select(r => new
                {
                    Date = r.Date.ToString("yyyy-MM-dd"),
                    Count = r.Count
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
