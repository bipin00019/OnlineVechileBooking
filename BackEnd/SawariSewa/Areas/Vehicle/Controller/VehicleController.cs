using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Vehicle.DTO;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create-vehicle-schedule")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> ScheduleVehicle([FromBody] VehicleScheduleDto model)
        {
            // Ensure the driver exists in ApprovedDrivers
            var driver = await _context.ApprovedDrivers.FindAsync(model.DriverId);
            if (driver == null)
                return BadRequest("Driver not found or not approved.");

            // Fetch vehicle details from the ApprovedDriver table
            string vehicleType = driver.VehicleType;
            string vehicleNumber = driver.VehicleNumber;
            string location = driver.StartingPoint;
            string destination = driver.DestinationLocation;           
            string departureTimeString = driver.DepartureTime;
            string pickupPoint = driver.PickupPoint;
            string dropOffPoint = driver.DropOffPoint;

            

            // Check if a vehicle schedule already exists for this driver and departure time
            var existingSchedule = await _context.VehicleAvailability
                .FirstOrDefaultAsync(v => v.DriverId == model.DriverId && v.DepartureTime == departureTimeString);

            if (existingSchedule != null)
                return BadRequest($"A schedule for this vehicle (Vehicle Number: {existingSchedule.VehicleNumber}) is already created for the selected departure time ({departureTimeString}).");

            // Validate inputs
            if (model.TotalSeats <= 0 || model.Fare <= 0)
                return BadRequest("Total seats and fare must be greater than zero.");

            // Create new VehicleAvailability schedule
            var newSchedule = new VehicleAvailability
            {
                DriverId = model.DriverId,
                VehicleType = vehicleType,
                VehicleNumber = vehicleNumber,
                TotalSeats = model.TotalSeats,
                AvailableSeats = model.TotalSeats,
                BookedSeats = 0,
                Location = location,
                Destination = destination,
                DepartureDate = model.DepartureDate,
                DepartureTime = departureTimeString,  // Use the DepartureTime from the driver record
                Fare = model.Fare,
                Status = "Available",
                PickupPoint = pickupPoint,
                DropOffPoint = dropOffPoint,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
           
            };

            // Add the new schedule to the context and save changes
            _context.VehicleAvailability.Add(newSchedule);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle scheduled successfully!" });
        }

        [HttpGet("view-vehicle-schedules")]
        public async Task<IActionResult> GetAllVehicleSchedules(int pageNumber = 1, int pageSize = 8)
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
                          DropOffPoint = d.DropOffPoint
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

    }
}
