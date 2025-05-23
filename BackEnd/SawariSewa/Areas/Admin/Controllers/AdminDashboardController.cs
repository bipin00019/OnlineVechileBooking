//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using SawariSewa.Areas.Admin.DTO;
//using SawariSewa.Data;
//using System;
//using System.Linq;
//using System.Threading.Tasks;

//namespace SawariSewa.Areas.Admin.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AdminDashboardController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly UserManager<ApplicationUser> _userManager;
//        private readonly RoleManager<IdentityRole> _roleManager;

//        public AdminDashboardController(ApplicationDbContext context, UserManager<ApplicationUser> userManager,RoleManager<IdentityRole> roleManager)
//        {
//            _context = context;
//            _userManager = userManager;
//            _roleManager = roleManager;
//        }

//        [HttpGet("daily-booking-counts")]
//        public async Task<IActionResult> GetDailyBookingCounts()
//        {
//            try
//            {
//                var rawData = await _context.PassengerBookingHistory
//                    .GroupBy(b => b.BookingDate.Date)
//                    .Select(g => new
//                    {
//                        Date = g.Key,          // raw DateTime
//                        Count = g.Count()
//                    })
//                    .OrderBy(g => g.Date)

//                    .ToListAsync();

//                // format the date AFTER pulling from SQL
//                var result = rawData.Select(r => new
//                {
//                    Date = r.Date.ToString("yyyy-MM-dd"),
//                    Count = r.Count
//                });

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        // ------------------------------------------------------------
//        // 2. Daily revenue (sum of Fare)  (GET api/booking-stats/daily-revenue)
//        // ------------------------------------------------------------
//        [HttpGet("daily-revenue")]
//        public async Task<IActionResult> GetDailyRevenue()
//        {
//            try
//            {
//                var rawData = await _context.PassengerBookingHistory
//                    .GroupBy(b => b.BookingDate.Date)
//                    .Select(g => new
//                    {
//                        Date = g.Key,           // raw DateTime
//                        Amount = g.Sum(x => x.Fare)
//                    })
//                    .OrderBy(g => g.Date)
//                    .ToListAsync();

//                var result = rawData.Select(r => new
//                {
//                    Date = r.Date.ToString("yyyy-MM-dd"),
//                    Amount = r.Amount
//                });

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        [HttpPost("change-user-role")]
//        [Authorize(Roles = "SuperAdmin")]
//        public async Task<IActionResult> ChangeUserRole(ChangeUserRoleDto dto)
//        {
//            var user = await _userManager.FindByIdAsync(dto.TargetUserId);
//            if (user == null)
//                return NotFound("User not found.");

//            // Check if role exists
//            if (!await _roleManager.RoleExistsAsync(dto.NewRole))
//                return BadRequest("Role does not exist.");

//            // Remove current roles (you can customize this to remove only specific ones)
//            var currentRoles = await _userManager.GetRolesAsync(user);
//            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

//            if (!removeResult.Succeeded)
//                return StatusCode(500, "Failed to remove existing roles.");

//            // Assign new role
//            var addResult = await _userManager.AddToRoleAsync(user, dto.NewRole);

//            if (!addResult.Succeeded)
//                return StatusCode(500, "Failed to assign new role.");

//            return Ok(new
//            {
//                user.Id,
//                user.UserName,
//                OldRoles = currentRoles,
//                NewRole = dto.NewRole
//            });
//        }

//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Admin.DTO;
using SawariSewa.Data;
using SawariSewa.Services;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailService _emailService; // ✅ Renamed

        public AdminDashboardController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IEmailService emailService) // ✅ Updated here
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService; // ✅ Assigned correctly
        }

        // ------------------------------------------------------------------
        // 1. Daily booking counts
        // ------------------------------------------------------------------
        [HttpGet("daily-booking-counts")]
        public async Task<IActionResult> GetDailyBookingCounts()
        {
            try
            {
                var rawData = await _context.PassengerBookingHistory
                    .GroupBy(b => b.BookingDate.Date)
                    .Select(g => new { Date = g.Key, Count = g.Count() })
                    .OrderBy(g => g.Date)
                    .ToListAsync();

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

        // ------------------------------------------------------------------
        // 2. Daily revenue
        // ------------------------------------------------------------------
        [HttpGet("daily-revenue")]
        public async Task<IActionResult> GetDailyRevenue()
        {
            try
            {
                var rawData = await _context.PassengerBookingHistory
                    .GroupBy(b => b.BookingDate.Date)
                    .Select(g => new { Date = g.Key, Amount = g.Sum(x => x.Fare) })
                    .OrderBy(g => g.Date)
                    .ToListAsync();

                var result = rawData.Select(r => new
                {
                    Date = r.Date.ToString("yyyy-MM-dd"),
                    Amount = r.Amount
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // ------------------------------------------------------------------
        // 3. Promote / demote a user and email them
        // ------------------------------------------------------------------
        [HttpPost("change-user-role")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ChangeUserRole(ChangeUserRoleDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.TargetUserId);
            if (user == null)
                return NotFound("User not found.");

            if (!await _roleManager.RoleExistsAsync(dto.NewRole))
                return BadRequest("Role does not exist.");

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
                return StatusCode(500, "Failed to remove existing roles.");

            var addResult = await _userManager.AddToRoleAsync(user, dto.NewRole);
            if (!addResult.Succeeded)
                return StatusCode(500, "Failed to assign new role.");

            try
            {
                var subject = "Your role in Sawari Sewa has been updated";
                var body =
                    $"Dear {user.UserName},<br/><br/>" +
                    $"You have been granted the <strong>{dto.NewRole}</strong> role in the Sawari Sewa application.<br/><br/>" +
                    $"If you have any questions, please reply to this email.<br/><br/>" +
                    $"Thank you,<br/>Sawari Sewa Team";

                await _emailService.SendEmailAsync(user.Email!, subject, body); // ✅ Updated here
            }
            catch (Exception mailEx)
            {
                // Log email exception - optional
                // _logger.LogError(mailEx, "Failed to send role change notification email.");
            }

            return Ok(new
            {
                user.Id,
                user.UserName,
                OldRoles = currentRoles,
                NewRole = dto.NewRole
            });
        }

        [HttpGet("total-seat-booking-count")]
        public async Task<IActionResult> GetTotalSeatBookingCount()
        {
            try
            {
                var count = await _context.SeatBookings.CountAsync();
                return Ok(new { TotalSeatBookings = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("total-cancelledBooking-count")]
        public async Task<IActionResult> GetTotalCancelledBookingCount()
        {
            try
            {
                var count = await _context.CancelledBookings.CountAsync();
                return Ok(new { TotalCancelledBookings = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("GetAllUsersWithRoles")]
        public IActionResult GetAllUsersWithRoles()
        {
            var usersWithRoles = (from user in _context.Users
                                  join userRole in _context.UserRoles on user.Id equals userRole.UserId into userRolesGroup
                                  from userRole in userRolesGroup.DefaultIfEmpty()
                                  join role in _context.Roles on userRole.RoleId equals role.Id into rolesGroup
                                  from role in rolesGroup.DefaultIfEmpty()
                                  select new
                                  {
                                      UserId = user.Id,
                                      FirstName = user.FirstName ?? "N/A",
                                      LastName = user.LastName ?? "N/A",
                                      Email = user.Email ?? "N/A",
                                      PhoneNumber = user.PhoneNumber ?? "N/A",
                                      Role = role != null ? role.Name : "No Role"
                                  }).ToList();

            return Ok(usersWithRoles);
        }

        [HttpGet("cancelled-bookings")]
        public async Task<IActionResult> GetCancelledBookingsWithUserDetails()
        {
            var bookings = await _context.CancelledBookings
                .Include(cb => cb.User)
                .Select(cb => new CancelledBookingDto
                {
                    Id = cb.Id,
                    BookingId = cb.BookingId,
                    UserId = cb.UserId,
                    FirstName = cb.User.FirstName,
                    LastName = cb.User.LastName,
                    Email = cb.User.Email,
                    KhaltiWalletNumber = cb.KhaltiWalletNumber,
                    Fare = cb.Fare,
                    CancelledAt = cb.CancelledAt,
                    Reason = cb.Reason,
                    IsRefunded = cb.IsRefunded
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPost("process-refund")]
        public async Task<IActionResult> ProcessRefund([FromQuery] int bookingId)
        {
            var booking = await _context.CancelledBookings
                .Include(cb => cb.User)
                .FirstOrDefaultAsync(cb => cb.BookingId == bookingId);

            if (booking == null)
                return NotFound("Booking not found.");

            if (booking.IsRefunded)
                return BadRequest("Refund already processed.");

            // Mark as refunded
            booking.IsRefunded = true;
            await _context.SaveChangesAsync();

            // Compose email
            var subject = "Your Fare Has Been Refunded";
            var message = $@"
        Dear {booking.User.FirstName} {booking.User.LastName},

        Your booking with Booking ID #{booking.BookingId} has been successfully refunded.
        NPR {booking.Fare} has been credited to your Khalti wallet: {booking.KhaltiWalletNumber}.

        Thank you for using Sawari Sewa.";

            // Send email (assumes email service is injected)
            await _emailService.SendEmailAsync(booking.User.Email, subject, message);

            return Ok("Refund processed and confirmation email sent.");
        }

    }


}
