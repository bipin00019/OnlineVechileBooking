using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using SawariSewa.Areas.Vehicle.DTO;

namespace SawariSewa.Areas.Vehicle.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FareController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FareController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: /Fare/SetFare
        [HttpPost("set-fare")]
        public async Task<IActionResult> SetFare([FromBody] SetFareRequest request)
        {
            // Get the logged-in user's UserId from the claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not logged in.");
            }

            // Check if the driver exists in the ApprovedDrivers table by UserId
            var driver = await _context.ApprovedDrivers
                .FirstOrDefaultAsync(d => d.UserId.ToString() == userId);

            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            if (request.FareAmount <= 0)
            {
                return BadRequest("Fare amount must be greater than zero.");
            }

            // Check if a fare already exists for this driver
            var existingFare = await _context.Fares
                .FirstOrDefaultAsync(f => f.DriverId == driver.UserId &&
                                          f.VehicleType == driver.VehicleType &&
                                          f.StartingPoint == driver.StartingPoint &&
                                          f.DestinationLocation == driver.DestinationLocation);

            if (existingFare != null)
            {
                // Update existing fare
                existingFare.Amount = request.FareAmount;
                existingFare.UpdatedAt = DateTime.UtcNow;
                _context.Fares.Update(existingFare);
            }
            else
            {
                // Create a new fare entry linked to the specific driver
                var newFare = new Fare
                {
                    DriverId = driver.UserId,  // Store DriverId for uniqueness
                    VehicleType = driver.VehicleType,
                    StartingPoint = driver.StartingPoint,
                    DestinationLocation = driver.DestinationLocation,
                    Amount = request.FareAmount,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _context.Fares.AddAsync(newFare);
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Fare successfully set/updated." });
        }
    }
}
