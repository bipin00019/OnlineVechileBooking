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
                        combined.VehicleAvailability.DriverId,
                        combined.SeatBooking.UserId,
                        PassengerName = $"{u.FirstName} {u.LastName}",
                        u.PhoneNumber,
                        BookingDate = combined.SeatBooking.BookingDate.Date.ToString("yyyy-MM-dd"),
                        DepartureDate = combined.VehicleAvailability.DepartureDate.Value.Date.ToString("yyyy-MM-dd"),
                        DepartureTime = combined.VehicleAvailability.DepartureTime,
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
        [HttpGet("driver/current-grouped-trips")]
        public async Task<IActionResult> GetDriverGroupedCurrentTrips()
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

            var currentTrips = await _context.SeatBookings
                .Join(_context.VehicleAvailability,
                    sb => sb.VehicleAvailabilityId,
                    va => va.Id,
                    (sb, va) => new { SeatBooking = sb, VehicleAvailability = va })
                .Where(x =>
                    x.VehicleAvailability.DriverId == approvedDriverId &&
                    x.VehicleAvailability.DepartureDate.HasValue &&
                    x.VehicleAvailability.DepartureDate.Value.Date == today)
                .GroupBy(x => new
                {
                    x.SeatBooking.VehicleAvailabilityId,
                    x.VehicleAvailability.DepartureDate,
                    x.VehicleAvailability.DepartureTime,
                    x.SeatBooking.PickupPoint,
                    x.SeatBooking.DropOffPoint
                })
                .Select(g => new
                {
                    g.Key.VehicleAvailabilityId,
                    DepartureDate = g.Key.DepartureDate.Value.ToString("yyyy-MM-dd"),
                    DepartureTime = g.Key.DepartureTime ?? "Not Set",
                    PickupPoint = g.Key.PickupPoint,
                    DropOffPoint = g.Key.DropOffPoint,
                    TotalFare = g.Sum(x => x.SeatBooking.Fare),
                    Status = g.Select(x => x.SeatBooking.RideStatus).FirstOrDefault() ?? "Not Set"
                })
                .ToListAsync();

            if (!currentTrips.Any())
            {
                return Ok(new { message = "No current trips" });
            }

            return Ok(currentTrips);
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
                        combined.VehicleAvailability.DriverId,
                        PassengerName = $"{u.FirstName} {u.LastName}",
                        u.PhoneNumber,
                        BookingDate = combined.SeatBooking.BookingDate.Date.ToString("yyyy-MM-dd"),
                        DepartureDate = combined.VehicleAvailability.DepartureDate.Value.Date.ToString("yyyy-MM-dd"),
                        DepartureTime= combined.VehicleAvailability.DepartureTime,
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

        [Authorize(Roles = "Driver")]
        [HttpGet("driver/upcoming-grouped-trips")]
        public async Task<IActionResult> GetGroupedDriverUpcomingTrips()
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

            var upcomingTrips = await _context.SeatBookings
                .Join(_context.VehicleAvailability,
                    sb => sb.VehicleAvailabilityId,
                    va => va.Id,
                    (sb, va) => new { SeatBooking = sb, VehicleAvailability = va })
                .Where(x =>
                    x.VehicleAvailability.DriverId == approvedDriverId &&
                    x.VehicleAvailability.DepartureDate.HasValue &&
                    x.VehicleAvailability.DepartureDate.Value.Date >= tomorrow)
                .GroupBy(x => new
                {
                    x.SeatBooking.VehicleAvailabilityId,
                    x.VehicleAvailability.DepartureDate,
                    x.VehicleAvailability.DepartureTime, // string
                    x.SeatBooking.PickupPoint,
                    x.SeatBooking.DropOffPoint
                })
                .Select(g => new
                {
                    g.Key.VehicleAvailabilityId,
                    DepartureDate = g.Key.DepartureDate.Value.ToString("yyyy-MM-dd"),
                    DepartureTime = g.Key.DepartureTime ?? "Not Set", // string value
                    PickupPoint = g.Key.PickupPoint,
                    DropOffPoint = g.Key.DropOffPoint,
                    TotalFare = g.Sum(x => x.SeatBooking.Fare)
                })
                .ToListAsync();

            if (!upcomingTrips.Any())
            {
                return Ok(new { message = "No upcoming grouped trips" });
            }

            return Ok(upcomingTrips);
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
                // If the last update was today, increment today's income, else reset it
                if (driverStats.LastUpdated.Date == today)
                {
                    driverStats.TodaysIncome += totalFare;
                }
                else
                {
                    driverStats.TodaysIncome = totalFare;
                }

                driverStats.TotalIncome += totalFare;
                driverStats.TotalRides += 1;
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

        //[Authorize(Roles = "Driver,Admin,SuperAdmin")] // Adjust roles as needed
        //[HttpGet("driver/stats")]
        //public async Task<IActionResult> GetDriverStats()
        //{
        //    var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //    if (string.IsNullOrEmpty(currentUserId))
        //    {
        //        return Unauthorized("User not authenticated.");
        //    }

        //    var driver = await _context.ApprovedDrivers
        //        .FirstOrDefaultAsync(d => d.UserId == currentUserId);

        //    if (driver == null)
        //    {
        //        return NotFound("No driver record found for this user.");
        //    }

        //    var approvedDriverId = driver.Id;

        //    var driverStats = await _context.DriverStats
        //        .Where(ds => ds.DriverId == approvedDriverId)
        //        .Select(ds => new
        //        {
        //            ds.Id,
        //            ds.DriverId,
        //            ds.TotalRides,
        //            ds.TotalIncome,
        //            ds.TodaysIncome,
        //            LastUpdated = ds.LastUpdated.ToString("yyyy-MM-dd HH:mm:ss")
        //        })
        //        .FirstOrDefaultAsync();

        //    if (driverStats == null)
        //    {
        //        return NotFound($"No stats found for DriverId {approvedDriverId}");
        //    }

        //    return Ok(driverStats);
        //}

        //[Authorize(Roles = "Driver,Admin,SuperAdmin")] // Adjust roles as needed
        //[HttpGet("driver/stats")]
        //public async Task<IActionResult> GetDriverStats()
        //{
        //    var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //    if (string.IsNullOrEmpty(currentUserId))
        //    {
        //        return Unauthorized("User not authenticated.");
        //    }

        //    var driver = await _context.ApprovedDrivers
        //        .FirstOrDefaultAsync(d => d.UserId == currentUserId);

        //    if (driver == null)
        //    {
        //        return NotFound("No driver record found for this user.");
        //    }

        //    var approvedDriverId = driver.Id;

        //    var driverStats = await _context.DriverStats
        //        .Where(ds => ds.DriverId == approvedDriverId)
        //        .Select(ds => new
        //        {
        //            ds.Id,
        //            ds.DriverId,
        //            ds.TotalRides,
        //            ds.TotalIncome,
        //            ds.TodaysIncome,
        //            LastUpdated = ds.LastUpdated.ToString("yyyy-MM-dd HH:mm:ss")
        //        })
        //        .FirstOrDefaultAsync();

        //    if (driverStats == null)
        //    {
        //        // Return default stats with zero values
        //        var defaultStats = new
        //        {
        //            Id = 0,
        //            DriverId = approvedDriverId,
        //            TotalRides = 0,
        //            TotalIncome = 0.0,
        //            TodaysIncome = 0.0,
        //            LastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
        //        };

        //        return Ok(defaultStats);
        //    }

        //    return Ok(driverStats);
        //}
        [Authorize(Roles = "Driver,Admin,SuperAdmin")] // Adjust roles as needed
        [HttpGet("driver/stats")]
        public async Task<IActionResult> GetDriverStats()
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

            var driverStats = await _context.DriverStats
                .FirstOrDefaultAsync(ds => ds.DriverId == approvedDriverId);

            if (driverStats == null)
            {
                // Return default stats with zero values
                var defaultStats = new
                {
                    Id = 0,
                    DriverId = approvedDriverId,
                    TotalRides = 0,
                    TotalIncome = 0.0,
                    TodaysIncome = 0.0,
                    LastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                };

                return Ok(defaultStats);
            }

            // Check if LastUpdated is not today and reset TodaysIncome if needed
            bool isSameDay = driverStats.LastUpdated.Date == DateTime.Today;

            if (!isSameDay)
            {
                driverStats.TodaysIncome = 0;
                driverStats.LastUpdated = DateTime.Now;

                _context.DriverStats.Update(driverStats);
                await _context.SaveChangesAsync();
            }

            var result = new
            {
                driverStats.Id,
                driverStats.DriverId,
                driverStats.TotalRides,
                driverStats.TotalIncome,
                TodaysIncome = driverStats.TodaysIncome,
                LastUpdated = driverStats.LastUpdated.ToString("yyyy-MM-dd HH:mm:ss")
            };

            return Ok(result);
        }

        [Authorize(Roles = "Driver,Admin,SuperAdmin")]
        [HttpGet("vehicle/passenger-count")]
        public async Task<IActionResult> GetPassengerStats()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Get the ApprovedDriver for the current user
            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == currentUserId);

            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            // Get the latest active VehicleAvailability record for this driver
            var vehicle = await _context.VehicleAvailability
                .Where(v => v.DriverId == driver.Id && v.Status == "Available") // Adjust status as needed
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync();

            if (vehicle == null)
            {
                return NotFound("No active vehicle availability found.");
            }

            // Count confirmed seat bookings for that vehicle
            var passengerCount = await _context.SeatBookings
                .CountAsync(sb => sb.VehicleAvailabilityId == vehicle.Id && sb.BookingStatus == "Confirmed");

            var result = new
            {
                vehicleAvailabilityId = vehicle.Id,
                passengerCount,
                totalCapacity = vehicle.TotalSeats
            };

            return Ok(result);
        }



    }
}