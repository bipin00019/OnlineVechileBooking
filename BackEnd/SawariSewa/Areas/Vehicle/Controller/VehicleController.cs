using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.DTO;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;
using SawariSewa.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public VehicleController(ApplicationDbContext context, IEmailService emailService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
        }
        [HttpPost("set-fare-and-schedule")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> SetFareAndSchedule([FromBody] VehicleScheduleDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            // Basic validation
            if (model.Fare <= 0 || model.TotalSeats <= 0)
                return BadRequest("Fare and Total Seats must be greater than zero.");

            // Check if schedule already exists
            var existingSchedule = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverId == driver.Id && v.DepartureTime == driver.DepartureTime);

            if (existingSchedule != null)
                return BadRequest("A schedule already exists for the current departure time.");

            // Create schedule
            var schedule = new VehicleAvailability
            {
                DriverId = driver.Id,
                VehicleType = driver.VehicleType,
                VehicleNumber = driver.VehicleNumber,
                Location = driver.StartingPoint,
                Destination = driver.DestinationLocation,
                DepartureDate = model.DepartureDate,
                DepartureTime = driver.DepartureTime,
                Fare = model.Fare,
                TotalSeats = model.TotalSeats,
                BookedSeats = 0,
                AvailableSeats = model.TotalSeats,
                Status = "Available",
                PickupPoint = driver.PickupPoint,
                DropOffPoint = driver.DropOffPoint,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                DriverPhoneNumber = driver.PhoneNumber,
                DriverFirstName = driver.FirstName,
                DriverLastName = driver.LastName
            };

            _context.VehicleAvailability.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle schedule created successfully!" });
        }

        [HttpGet("check-schedule-exists")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> CheckScheduleExists()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            var existingSchedule = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverId == driver.Id && v.DepartureTime == driver.DepartureTime);

            return Ok(existingSchedule != null);
        }

        [HttpGet("my-schedule")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMySchedule()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            var schedule = await _context.VehicleAvailability
                .Where(v => v.DriverId == driver.Id)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            return Ok(schedule);
        }

        //[HttpDelete("delete-schedule")]
        //[Authorize(Roles = "Driver")]
        //public async Task<IActionResult> DeleteSchedule()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
        //    if (driver == null)
        //        return BadRequest("Driver not found or not approved.");

        //    var schedule = await _context.VehicleAvailability
        //        .FirstOrDefaultAsync(v => v.DriverId == driver.Id);

        //    if (schedule == null)
        //        return NotFound("No schedule found to delete.");

        //    _context.VehicleAvailability.Remove(schedule);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Vehicle schedule deleted successfully." });
        //}

        [HttpDelete("delete-schedule")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> DeleteSchedule()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            var schedule = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverId == driver.Id);

            if (schedule == null)
                return NotFound("No schedule found to delete.");

            var relatedBookings = await _context.SeatBookings
                .Where(b => b.VehicleAvailabilityId == schedule.Id)
                .ToListAsync();

            if (relatedBookings != null && relatedBookings.Any())
            {
                foreach (var booking in relatedBookings)
                {
                    if (!string.IsNullOrEmpty(booking.UserId))
                    {
                        var user = await _userManager.FindByIdAsync(booking.UserId);
                        if (user != null && !string.IsNullOrEmpty(user.Email))
                        {
                            string emailBody = $@"
<h2>Booking Cancellation Notice</h2>
<p>Dear {user.FirstName},</p>
<p>Your seat booking has been cancelled because the driver has removed the vehicle schedule.</p>
<p><strong>Pickup Point:</strong> {schedule.PickupPoint}</p>
<p><strong>Drop Off Point:</strong> {schedule.DropOffPoint}</p>
<p><strong>Fare:</strong> {schedule.Fare} NPR</p>
<p><strong>Departure Date:</strong> {(schedule.DepartureDate?.ToShortDateString() ?? "Not Available")}</p>
<p><strong>Departure Time:</strong> {schedule.DepartureTime}</p>
<p>We apologize for the inconvenience. Please contact the driver or support for further assistance.</p>
<p>Thank you for understanding!</p>
                            ";

                            await _emailService.SendEmailAsync(user.Email, "Booking Cancelled - Sawari Sewa", emailBody);
                        }
                    }
                    _context.SeatBookings.Remove(booking);
                }
            }

            _context.VehicleAvailability.Remove(schedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle schedule and associated bookings deleted successfully." });
        }



        [HttpPut("edit-fare-and-schedule")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> EditFareAndSchedule([FromBody] VehicleScheduleDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            var existingSchedule = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverId == driver.Id && v.Status == "Available");

            if (existingSchedule == null)
                return NotFound("No active schedule found to edit.");

            // Validate inputs
            if (model.Fare <= 0 || model.TotalSeats <= 0)
                return BadRequest("Fare and Total Seats must be greater than zero.");

            if (model.TotalSeats < existingSchedule.BookedSeats)
                return BadRequest("Total seats cannot be less than already booked seats.");

            // Update fields
            existingSchedule.Fare = model.Fare;
            existingSchedule.TotalSeats = model.TotalSeats;
            existingSchedule.BookedSeats = model.bookedSeats;
            existingSchedule.AvailableSeats = model.TotalSeats - model.bookedSeats;
            existingSchedule.DepartureDate = model.DepartureDate;
            existingSchedule.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle schedule updated successfully!" });
        }



        //[HttpPost("create-vehicle-schedule")]
        //[Authorize(Roles = "Admin, SuperAdmin")]
        //public async Task<IActionResult> ScheduleVehicle([FromBody] VehicleScheduleDto model)
        //{
        //    // Ensure the driver exists in ApprovedDrivers
        //    var driver = await _context.ApprovedDrivers.FindAsync(model.DriverId);
        //    if (driver == null)
        //        return BadRequest("Driver not found or not approved.");

        //    // Fetch vehicle details from the ApprovedDriver table
        //    string vehicleType = driver.VehicleType;
        //    string vehicleNumber = driver.VehicleNumber;
        //    string location = driver.StartingPoint;
        //    string destination = driver.DestinationLocation;           
        //    string departureTimeString = driver.DepartureTime;
        //    string pickupPoint = driver.PickupPoint;
        //    string dropOffPoint = driver.DropOffPoint;
        //    string driverPhoneNumber = driver.PhoneNumber;
        //    string driverFirstName = driver.FirstName;
        //    string driverLastName = driver.LastName;



        //    // Check if a vehicle schedule already exists for this driver and departure time
        //    var existingSchedule = await _context.VehicleAvailability
        //        .FirstOrDefaultAsync(v => v.DriverId == model.DriverId && v.DepartureTime == departureTimeString);

        //    if (existingSchedule != null)
        //        return BadRequest($"A schedule for this vehicle (Vehicle Number: {existingSchedule.VehicleNumber}) is already created for the selected departure time ({departureTimeString}).");

        //    // Validate inputs
        //    if (model.TotalSeats <= 0 || model.Fare <= 0)
        //        return BadRequest("Total seats and fare must be greater than zero.");

        //    // Create new VehicleAvailability schedule
        //    var newSchedule = new VehicleAvailability
        //    {
        //        DriverId = model.DriverId,
        //        VehicleType = vehicleType,
        //        VehicleNumber = vehicleNumber,
        //        TotalSeats = model.TotalSeats,
        //        AvailableSeats = model.TotalSeats,
        //        BookedSeats = 0,
        //        Location = location,
        //        Destination = destination,
        //        DepartureDate = model.DepartureDate,
        //        DepartureTime = departureTimeString,  // Use the DepartureTime from the driver record
        //        Fare = model.Fare,
        //        Status = "Available",
        //        PickupPoint = pickupPoint,
        //        DropOffPoint = dropOffPoint,
        //        CreatedAt = DateTime.Now,
        //        UpdatedAt = DateTime.Now,
        //        DriverPhoneNumber = driverPhoneNumber,
        //        DriverFirstName = driverFirstName,
        //        DriverLastName = driverLastName


        //    };

        //    // Add the new schedule to the context and save changes
        //    _context.VehicleAvailability.Add(newSchedule);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Vehicle scheduled successfully!" });
        //}

        [HttpGet("view-vehicle-schedules")]
        public async Task<IActionResult> GetAllVehicleSchedules(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                return BadRequest(new { message = "Invalid pagination parameters." });
            }

            var totalRecords = await _context.VehicleAvailability.CountAsync();

            var schedules = await _context.VehicleAvailability
                .OrderBy(v => v.DepartureDate) // Sorting by departure date
                .Skip((pageNumber - 1) * pageSize) // Skip previous records
                .Take(pageSize) // Take only the required records
                .Select(v => new
                {
                    v.Id,
                    v.DriverId,
                    v.VehicleType,
                    v.VehicleNumber,
                    v.TotalSeats,
                    v.AvailableSeats,
                    v.BookedSeats,
                    v.Location,
                    v.Destination,
                    v.DepartureDate,
                    v.DepartureTime,
                    v.Fare,
                    v.Status,
                    v.CreatedAt,
                    v.UpdatedAt
                })
                .ToListAsync();

            if (!schedules.Any())
                return NotFound(new { message = "No vehicle schedules found." });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(new
            {
                pageNumber,
                pageSize,
                totalRecords,
                totalPages,
                data = schedules
            });
        }




        [HttpPost("search-available-vehicles")]
        public async Task<IActionResult> SearchAvailableVehicles([FromBody] VehicleSearchDto searchModel)
        {
            // Ensure the search model is not null and contains valid data
            if (searchModel == null)
                return BadRequest("Search parameters are missing.");

            // Get the list of available vehicles based on search parameters
            var availableVehicles = await _context.VehicleAvailability
                .Where(v => v.Location.ToLower() == searchModel.Location.ToLower()
                            && v.Destination.ToLower() == searchModel.Destination.ToLower()
                            && v.VehicleType.ToLower() == searchModel.VehicleType.ToLower()
                            && v.DepartureDate == searchModel.Date.Date
                            && v.Status.ToLower() == "available")
                .Join(_context.ApprovedDrivers,
                      v => v.DriverId,
                      d => d.Id, // Assuming the primary key in ApprovedDrivers is Id
                      (v, d) => new
                      {
                          v.Id,
                          v.DriverId,
                          v.VehicleNumber,
                          v.VehicleType,
                          v.TotalSeats,
                          v.AvailableSeats,
                          v.Fare,
                          v.DepartureDate,
                          v.Location,
                          v.Destination,
                          v.DepartureTime,                          
                          PickupPoint = d.PickupPoint,
                          DropOffPoint = d.DropOffPoint,
                          
                      })
                .ToListAsync();

            // If no available vehicles found, return a message
            if (availableVehicles.Count == 0)
                return NotFound("No available vehicles found for the specified criteria.");

            // Return the list of available vehicles
            return Ok(availableVehicles);
        }


        [HttpPut("edit-vehicle-schedule/{Id}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> EditVehicleSchedule(int Id, [FromBody] EditVehicleScheduleDto model)
        {
            var existingSchedule = await _context.VehicleAvailability.FindAsync(Id);
            if (existingSchedule == null)
                return NotFound("Vehicle schedule not found.");

            // Validate inputs
            if (model.TotalSeats <= 0 || model.Fare <= 0 || model.BookedSeats < 0)
                return BadRequest("Total seats and fare must be greater than zero, and booked seats cannot be negative.");

            // You can use the DriverId from the existingSchedule (no need to pass it in the request body)
            var driverId = existingSchedule.DriverId;

            // Update schedule details
            existingSchedule.TotalSeats = model.TotalSeats;
            existingSchedule.BookedSeats = model.BookedSeats;
            existingSchedule.AvailableSeats = model.TotalSeats - model.BookedSeats; // Adjust available seats
            existingSchedule.DepartureDate = model.DepartureDate;
            existingSchedule.Fare = model.Fare;
            existingSchedule.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle schedule updated successfully!" });
        }

        [Authorize]
        [HttpGet("driver/seat-stats")]
        public async Task<IActionResult> GetDriverSeatStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // gets logged-in user's Id

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not logged in.");
            }

            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (driver == null)
            {
                return NotFound("Driver not found or not approved.");
            }

            var vehicleStats = await _context.VehicleAvailability
                .Where(v => v.DriverId == driver.Id)
                .Select(v => new
                {
                    v.VehicleType,
                    v.VehicleNumber,
                    v.TotalSeats,
                    v.AvailableSeats,
                    v.BookedSeats,
                    v.Location,
                    v.Destination,
                    v.DepartureDate,
                    v.DepartureTime,
                    v.Fare,
                    v.Status,
                    v.PickupPoint,
                    v.DropOffPoint,
                    v.DriverFirstName,
                    v.DriverLastName,
                    v.DriverPhoneNumber
                })
                .ToListAsync();

            return Ok(vehicleStats);
        }

        [Authorize]
        [HttpGet("driver/booked-seatNumber")]
        public async Task<IActionResult> GetBookedSeatsForDriver()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Logged-in User's ID

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not logged in.");

            // Get Driver Id from ApprovedDrivers
            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (driver == null)
                return NotFound("Driver not found or not approved.");

            // Get all VehicleAvailabilityId for this driver
            var vehicleIds = await _context.VehicleAvailability
                .Where(v => v.DriverId == driver.Id)
                .Select(v => v.Id)
                .ToListAsync();

            // Get all seat bookings for those vehicle IDs
            var bookedSeats = await _context.SeatBookings
                .Where(sb => vehicleIds.Contains(sb.VehicleAvailabilityId))
                .Select(sb => new
                {
                    sb.VehicleAvailabilityId,
                    sb.SeatNumber,
                    sb.UserId,
                    sb.BookingStatus,
                    sb.BookingDate,
                    sb.RideStatus,
                    sb.ManualPassengerName,
                    sb.ManualPassengerPhoneNumber,
                    sb.PickupPoint,
                    sb.DropOffPoint,
                })
                .ToListAsync();

            return Ok(bookedSeats);
        }

    }
}
