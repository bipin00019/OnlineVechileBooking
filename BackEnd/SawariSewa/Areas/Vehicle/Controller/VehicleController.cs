using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("available-vehicles")]
        public async Task<IActionResult> GetAvailableVehicles([FromQuery] string startingPoint, [FromQuery] string destination, [FromQuery] string vehicleType)
        {
            if (string.IsNullOrEmpty(startingPoint) || string.IsNullOrEmpty(destination) || string.IsNullOrEmpty(vehicleType))
            {
                return BadRequest("Starting point, destination, and vehicle type are required.");
            }

            var availableVehicles = await _context.ApprovedDrivers
                .Where(v => v.VehicleType == vehicleType &&
                            v.StartingPoint == startingPoint &&
                            v.DestinationLocation == destination &&
                            v.IsOnline == true)
                .Select(v => new
                {
                    v.Id,
                    v.VehicleType,
                    v.VehicleNumber,
                    v.FirstName,
                    v.LastName,
                    v.PhoneNumber,
                    v.Email,
                    v.VehiclePhotoPath,
                    v.DepartureTime,
                    
                    // Fetch fare specifically assigned to this driver
                    FareAmount = _context.Fares
                        .Where(f => f.DriverId == v.UserId &&
                                    f.VehicleType == v.VehicleType &&
                                    f.StartingPoint == v.StartingPoint &&
                                    f.DestinationLocation == v.DestinationLocation)
                        .Select(f => f.Amount)
                        .FirstOrDefault() // Get driver's fare, if available
                })
                .ToListAsync();

            if (!availableVehicles.Any())
            {
                return NotFound("No available vehicles found.");
            }

            return Ok(availableVehicles);
        }
    }
}
