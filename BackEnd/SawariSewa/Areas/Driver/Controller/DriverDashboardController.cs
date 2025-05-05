using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SawariSewa.Areas.Driver.Model;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
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



        //[HttpPost("complete-trip/{vehicleAvailabilityId}")]
        //public async Task<IActionResult> CompleteTripByVehicle(int vehicleAvailabilityId)
        //{
        //    var bookings = await _context.SeatBookings
        //        .Where(sb => sb.VehicleAvailabilityId == vehicleAvailabilityId && sb.RideStatus != "Completed")
        //        .ToListAsync();

        //    if (!bookings.Any())
        //        return NotFound("No active bookings found for this vehicle availability ID.");

        //    var totalFare = bookings.Sum(b => b.Fare);

        //    var vehicle = await _context.VehicleAvailability.FindAsync(vehicleAvailabilityId);
        //    if (vehicle == null)
        //        return NotFound("Vehicle not found.");

        //    var driverId = vehicle.DriverId;
        //    if (driverId == 0)
        //        return BadRequest("Driver not found for the vehicle availability.");

        //    var today = DateTime.Today;

        //    var driverStats = await _context.DriverStats.FirstOrDefaultAsync(ds => ds.DriverId == driverId);
        //    if (driverStats != null)
        //    {
        //        if (driverStats.LastUpdated.Date == today)
        //            driverStats.TodaysIncome += totalFare;
        //        else
        //            driverStats.TodaysIncome = totalFare;

        //        driverStats.TotalIncome += totalFare;
        //        driverStats.TotalRides += 1;
        //        driverStats.LastUpdated = DateTime.Now;
        //        _context.DriverStats.Update(driverStats);
        //    }
        //    else
        //    {
        //        _context.DriverStats.Add(new DriverStats
        //        {
        //            DriverId = driverId,
        //            TotalRides = 1,
        //            TotalIncome = totalFare,
        //            TodaysIncome = totalFare,
        //            LastUpdated = DateTime.Now
        //        });
        //    }

        //    foreach (var booking in bookings)
        //    {
        //        booking.RideStatus = "Completed";
        //        _context.SeatBookings.Remove(booking);
        //    }

        //    // Parse departure date safely
        //    DateTime parsedDepartureDate;
        //    if (vehicle.DepartureDate is DateTime dt)
        //    {
        //        parsedDepartureDate = dt;
        //    }
        //    else if (!DateTime.TryParse(vehicle.DepartureDate?.ToString(), out parsedDepartureDate))
        //    {
        //        return BadRequest("Invalid departure date format.");
        //    }

        //    // Swap location and destination, pickup and drop-off, update the departure date
        //    (vehicle.Location, vehicle.Destination) = (vehicle.Destination, vehicle.Location);
        //    (vehicle.PickupPoint, vehicle.DropOffPoint) = (vehicle.DropOffPoint, vehicle.PickupPoint);
        //    vehicle.DepartureDate = parsedDepartureDate.AddDays(1);
        //    vehicle.BookedSeats = 0;
        //    vehicle.AvailableSeats = vehicle.TotalSeats;
        //    vehicle.Status = "Available";
        //    vehicle.UpdatedAt = DateTime.Now;

        //    _context.VehicleAvailability.Update(vehicle);
        //    await _context.SaveChangesAsync();

        //    return Ok("Trip completed, stats updated, bookings removed, and return trip prepared.");
        //}



        //[HttpPost("complete-trip/{vehicleAvailabilityId}")]
        //public async Task<IActionResult> CompleteTripByVehicle(int vehicleAvailabilityId)
        //{
        //    var bookings = await _context.SeatBookings
        //        .Where(sb => sb.VehicleAvailabilityId == vehicleAvailabilityId && sb.RideStatus != "Completed")
        //        .ToListAsync();

        //    if (!bookings.Any())
        //        return NotFound("No active bookings found for this vehicle availability ID.");

        //    var totalFare = bookings.Sum(b => b.Fare);

        //    var vehicle = await _context.VehicleAvailability.FindAsync(vehicleAvailabilityId);
        //    if (vehicle == null)
        //        return NotFound("Vehicle not found.");

        //    var driverId = vehicle.DriverId;
        //    if (driverId == 0)
        //        return BadRequest("Driver not found for the vehicle availability.");

        //    var driver = await _context.ApprovedDrivers.FindAsync(driverId);
        //    if (driver == null)
        //        return NotFound("Driver information not found.");

        //    var today = DateTime.Today;

        //    var driverStats = await _context.DriverStats.FirstOrDefaultAsync(ds => ds.DriverId == driverId);
        //    if (driverStats != null)
        //    {
        //        if (driverStats.LastUpdated.Date == today)
        //            driverStats.TodaysIncome += totalFare;
        //        else
        //            driverStats.TodaysIncome = totalFare;

        //        driverStats.TotalIncome += totalFare;
        //        driverStats.TotalRides += 1;
        //        driverStats.LastUpdated = DateTime.Now;
        //        _context.DriverStats.Update(driverStats);
        //    }
        //    else
        //    {
        //        _context.DriverStats.Add(new DriverStats
        //        {
        //            DriverId = driverId,
        //            TotalRides = 1,
        //            TotalIncome = totalFare,
        //            TodaysIncome = totalFare,
        //            LastUpdated = DateTime.Now
        //        });
        //    }

        //    // Save booking history before removing bookings
        //    foreach (var booking in bookings)
        //    {
        //        var history = new PassengerBookingHistory
        //        {
        //            DriverId = driver.Id,
        //            UserId = booking.UserId,
        //            DriverName = $"{driver.FirstName} {driver.LastName}",
        //            DriverPhoneNumber = driver.PhoneNumber,
        //            VehicleNumber = driver.VehicleNumber,
        //            VehicleType = driver.VehicleType,
        //            BookingDate = booking.BookingDate,
        //            Fare = booking.Fare,
        //            PickupPoint = booking.PickupPoint,
        //            DropOffPoint = booking.DropOffPoint,
        //            CompletedAt = DateTime.Now
        //        };

        //        _context.PassengerBookingHistory.Add(history);

        //        booking.RideStatus = "Completed";
        //        _context.SeatBookings.Remove(booking);
        //    }

        //    // Parse departure date safely
        //    DateTime parsedDepartureDate;
        //    if (vehicle.DepartureDate is DateTime dt)
        //    {
        //        parsedDepartureDate = dt;
        //    }
        //    else if (!DateTime.TryParse(vehicle.DepartureDate?.ToString(), out parsedDepartureDate))
        //    {
        //        return BadRequest("Invalid departure date format.");
        //    }

        //    // Prepare return trip
        //    (vehicle.Location, vehicle.Destination) = (vehicle.Destination, vehicle.Location);
        //    (vehicle.PickupPoint, vehicle.DropOffPoint) = (vehicle.DropOffPoint, vehicle.PickupPoint);
        //    vehicle.DepartureDate = parsedDepartureDate.AddDays(1);
        //    vehicle.BookedSeats = 0;
        //    vehicle.AvailableSeats = vehicle.TotalSeats;
        //    vehicle.Status = "Available";
        //    vehicle.UpdatedAt = DateTime.Now;

        //    _context.VehicleAvailability.Update(vehicle);
        //    await _context.SaveChangesAsync();

        //    return Ok("Trip completed, stats updated, bookings archived, and return trip prepared.");
        //}

        [HttpPost("complete-trip/{vehicleAvailabilityId}")]
        public async Task<IActionResult> CompleteTripByVehicle(int vehicleAvailabilityId)
        {
            var bookings = await _context.SeatBookings
                .Where(sb => sb.VehicleAvailabilityId == vehicleAvailabilityId && sb.RideStatus != "Completed")
                .ToListAsync();

            if (!bookings.Any())
                return NotFound("No active bookings found for this vehicle availability ID.");

            var vehicle = await _context.VehicleAvailability.FindAsync(vehicleAvailabilityId);
            if (vehicle == null)
                return NotFound("Vehicle not found.");

            var driverId = vehicle.DriverId;
            if (driverId == 0)
                return BadRequest("Driver not found for the vehicle availability.");

            var driver = await _context.ApprovedDrivers.FindAsync(driverId);
            if (driver == null)
                return NotFound("Driver information not found.");

            var today = DateTime.Today;

            // Aggregate fares by UserId (Passenger)
            var aggregatedBookings = bookings
                .GroupBy(b => b.UserId)
                .Select(group => new
                {
                    UserId = group.Key,
                    TotalFare = group.Sum(b => b.Fare),
                    PickupPoint = group.First().PickupPoint,  // Assuming all bookings have the same PickupPoint
                    DropOffPoint = group.First().DropOffPoint // Assuming all bookings have the same DropOffPoint
                }).ToList();

            // Update driver stats
            var totalFare = aggregatedBookings.Sum(ab => ab.TotalFare);

            var driverStats = await _context.DriverStats.FirstOrDefaultAsync(ds => ds.DriverId == driverId);
            if (driverStats != null)
            {
                if (driverStats.LastUpdated.Date == today)
                    driverStats.TodaysIncome += totalFare;
                else
                    driverStats.TodaysIncome = totalFare;

                driverStats.TotalIncome += totalFare;
                driverStats.TotalRides += 1;
                driverStats.LastUpdated = DateTime.Now;
                _context.DriverStats.Update(driverStats);
            }
            else
            {
                _context.DriverStats.Add(new DriverStats
                {
                    DriverId = driverId,
                    TotalRides = 1,
                    TotalIncome = totalFare,
                    TodaysIncome = totalFare,
                    LastUpdated = DateTime.Now
                });
            }

            // Save driver trip history and update seat bookings
            foreach (var aggregatedBooking in aggregatedBookings)
            {
                var history = new DriverTripHistory
                {
                    UserId = aggregatedBooking.UserId,
                 
                    
                    BookingDate = bookings.First(b => b.UserId == aggregatedBooking.UserId).BookingDate,  // Get booking date from first booking of that user
                    Fare = aggregatedBooking.TotalFare,
                    PickupPoint = aggregatedBooking.PickupPoint,
                    DropOffPoint = aggregatedBooking.DropOffPoint,
                    CreatedAt = DateTime.Now
                };

                _context.DriverTripHistory.Add(history);

                // Update the seat bookings as completed
                var userBookings = bookings.Where(b => b.UserId == aggregatedBooking.UserId).ToList();
                foreach (var booking in userBookings)
                {
                    booking.RideStatus = "Completed";
                    _context.SeatBookings.Remove(booking);
                }
            }

            // Parse departure date safely
            DateTime parsedDepartureDate;
            if (vehicle.DepartureDate is DateTime dt)
            {
                parsedDepartureDate = dt;
            }
            else if (!DateTime.TryParse(vehicle.DepartureDate?.ToString(), out parsedDepartureDate))
            {
                return BadRequest("Invalid departure date format.");
            }

            // Prepare return trip
            (vehicle.Location, vehicle.Destination) = (vehicle.Destination, vehicle.Location);
            (vehicle.PickupPoint, vehicle.DropOffPoint) = (vehicle.DropOffPoint, vehicle.PickupPoint);
            vehicle.DepartureDate = parsedDepartureDate.AddDays(1);
            vehicle.BookedSeats = 0;
            vehicle.AvailableSeats = vehicle.TotalSeats;
            vehicle.Status = "Available";
            vehicle.UpdatedAt = DateTime.Now;

            _context.VehicleAvailability.Update(vehicle);
            await _context.SaveChangesAsync();

            return Ok("Trip completed, stats updated, bookings archived, and return trip prepared.");
        }


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

            // Instead of returning 404, return 200 with a different structure
            if (vehicle == null)
            {
                return Ok(new
                {
                    hasSchedule = false,
                    message = "No active vehicle availability found."
                });
            }

            // Count confirmed seat bookings for that vehicle
            var passengerCount = await _context.SeatBookings
                .CountAsync(sb => sb.VehicleAvailabilityId == vehicle.Id && sb.BookingStatus == "Confirmed");

            var result = new
            {
                hasSchedule = true,
                vehicleAvailabilityId = vehicle.Id,
                passengerCount,
                totalCapacity = vehicle.TotalSeats
            };

            return Ok(result);
        }


    }
}