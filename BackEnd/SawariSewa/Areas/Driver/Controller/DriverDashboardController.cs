using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DriverDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("driver/current-trips")]
        public async Task<IActionResult> GetDriverCurrentTrips()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == currentUserId);
            if (driver == null)
            {
                return NotFound("No driver record found for this user.");
            }

            var approvedDriverId = driver.Id;
            var today = DateTime.Today;

            // Get the vehicle availabilities for today's departures
            var todayVehicleAvailabilities = await _context.VehicleAvailability
                .Where(v => v.DriverId == approvedDriverId && v.DepartureDate.Value.Date == today)
                .Select(v => v.Id)
                .ToListAsync();

            if (!todayVehicleAvailabilities.Any())
            {
                return Ok(new { message = "No current trips" });
            }

            // Get bookings for today's departures
            var seatBookings = await _context.SeatBookings
                .Where(sb => todayVehicleAvailabilities.Contains(sb.VehicleAvailabilityId))
                .Join(_context.VehicleAvailability,
                    sb => sb.VehicleAvailabilityId,
                    va => va.Id,
                    (sb, va) => new { SeatBooking = sb, VehicleAvailability = va })
                .Join(_context.Users,
                    combined => combined.SeatBooking.UserId,
                    u => u.Id,
                    (combined, u) => new {
                        combined.SeatBooking.BookingId,
                        combined.SeatBooking.VehicleAvailabilityId,
                        combined.SeatBooking.SeatNumber,
                        combined.SeatBooking.UserId,
                        PassengerName = $"{u.FirstName} {u.LastName}",
                        u.PhoneNumber,
                        BookingDate = combined.SeatBooking.BookingDate.Date.ToString("yyyy-MM-dd"),
                        DepartureDate = combined.VehicleAvailability.DepartureDate.Value.Date.ToString("yyyy-MM-dd"),
                        combined.SeatBooking.BookingStatus,
                        combined.SeatBooking.RideStatus,
                        combined.SeatBooking.Fare,
                        CreatedAt = combined.SeatBooking.CreatedAt.Date.ToString("yyyy-MM-dd"),
                        UpdatedAt = combined.SeatBooking.UpdatedAt.Date.ToString("yyyy-MM-dd"),
                        combined.SeatBooking.PickupPoint,
                        combined.SeatBooking.DropOffPoint
                    })
                .ToListAsync();

            if (!seatBookings.Any())
            {
                return Ok(new { message = "No current trips" });
            }

            return Ok(seatBookings);
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("driver/upcoming-trips")]
        public async Task<IActionResult> GetDriverUpcomingTrips()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == currentUserId);

            if (driver == null)
            {
                return NotFound("No driver record found for this user.");
            }

            var approvedDriverId = driver.Id;
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            // Get vehicle availabilities with departure dates from tomorrow onwards
            var upcomingVehicleAvailabilities = await _context.VehicleAvailability
                .Where(v => v.DriverId == approvedDriverId && v.DepartureDate.Value.Date >= tomorrow)
                .Select(v => v.Id)
                .ToListAsync();

            if (!upcomingVehicleAvailabilities.Any())
            {
                return Ok(new { message = "No upcoming trips" });
            }

            // Get bookings for upcoming departures
            var seatBookings = await _context.SeatBookings
                .Where(sb => upcomingVehicleAvailabilities.Contains(sb.VehicleAvailabilityId))
                .Join(_context.VehicleAvailability,
                    sb => sb.VehicleAvailabilityId,
                    va => va.Id,
                    (sb, va) => new { SeatBooking = sb, VehicleAvailability = va })
                .Join(_context.Users,
                    combined => combined.SeatBooking.UserId,
                    u => u.Id,
                    (combined, u) => new
                    {
                        combined.SeatBooking.BookingId,
                        combined.SeatBooking.VehicleAvailabilityId,
                        combined.SeatBooking.SeatNumber,
                        combined.SeatBooking.UserId,
                        PassengerName = $"{u.FirstName} {u.LastName}",
                        u.PhoneNumber,
                        BookingDate = combined.SeatBooking.BookingDate.Date.ToString("yyyy-MM-dd"),
                        DepartureDate = combined.VehicleAvailability.DepartureDate.Value.Date.ToString("yyyy-MM-dd"),
                        combined.SeatBooking.BookingStatus,
                        combined.SeatBooking.RideStatus,
                        combined.SeatBooking.Fare,
                        CreatedAt = combined.SeatBooking.CreatedAt.Date.ToString("yyyy-MM-dd"),
                        UpdatedAt = combined.SeatBooking.UpdatedAt.Date.ToString("yyyy-MM-dd"),
                        combined.SeatBooking.PickupPoint,
                        combined.SeatBooking.DropOffPoint,
                    })
                .ToListAsync();

            if (!seatBookings.Any())
            {
                return Ok(new { message = "No upcoming trips" });
            }

            return Ok(seatBookings);
        }


        [HttpPost("complete-trip/{vehicleAvailabilityId}")]
        public async Task<IActionResult> CompleteTripByVehicle(int vehicleAvailabilityId)
        {
            // Fetch the active bookings for the given vehicleAvailabilityId
            var bookings = await _context.SeatBookings
                .Where(sb => sb.VehicleAvailabilityId == vehicleAvailabilityId && sb.RideStatus != "Completed")
                .ToListAsync();

            // Check if there are any bookings
            if (!bookings.Any())
                return NotFound("No active bookings found for this vehicle availability ID.");

            // Calculate the total fare from all bookings
            var totalFare = bookings.Sum(b => b.Fare);

            // Fetch the driverId for the given vehicleAvailabilityId
            var driverId = await _context.VehicleAvailability
                .Where(va => va.Id == vehicleAvailabilityId)
                .Select(va => va.DriverId)
                .FirstOrDefaultAsync();

            // If no driver is found for the given vehicleAvailabilityId, return a bad request
            if (driverId == 0) // If driverId is 0, it indicates that no driver was found
                return BadRequest("Driver not found for the vehicle availability.");

            var today = DateTime.Today;

            // Fetch the driver stats for the specific driver
            var driverStats = await _context.DriverStats.FirstOrDefaultAsync(ds => ds.DriverId == driverId);

            // Update or create driver stats
            if (driverStats != null)
            {
                driverStats.TotalRides += 1;
                driverStats.TotalIncome += totalFare;

                if (driverStats.LastUpdated.Date == today)
                    driverStats.TodaysIncome += totalFare;
                else
                    driverStats.TodaysIncome = totalFare;

                driverStats.LastUpdated = DateTime.Now;
                _context.DriverStats.Update(driverStats);
            }
            else
            {
                // Add new driver stats if not found
                _context.DriverStats.Add(new DriverStats
                {
                    DriverId = driverId,
                    TotalRides = 1,
                    TotalIncome = totalFare,
                    TodaysIncome = totalFare,
                    LastUpdated = DateTime.Now
                });
            }

            // Mark bookings as completed and remove them from the table
            foreach (var booking in bookings)
            {
                booking.RideStatus = "Completed";
                _context.SeatBookings.Remove(booking);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return success message
            return Ok("Trip completed, driver stats updated, and seat bookings removed.");
        }

    }
}