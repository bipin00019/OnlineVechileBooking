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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // "sub" if you're using JWT "sub"

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not logged in.");
            }

            // Check if the driver exists in the ApprovedDrivers table by UserId
            var driver = await _context.ApprovedDrivers.FirstOrDefaultAsync(d => d.UserId.ToString() == userId);
            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            if (request.FareAmount <= 0)
            {
                return BadRequest("Fare amount must be greater than zero.");
            }

            // Check if a fare already exists for this vehicle type, starting point, and destination
            var existingFare = await _context.Fares
                .FirstOrDefaultAsync(f => f.VehicleType == driver.VehicleType &&
                                          f.StartingPoint == driver.StartingPoint &&
                                          f.DestinationLocation == driver.DestinationLocation);

            if (existingFare != null)
            {
                // If a fare exists, update it and set UpdatedAt to current time
                existingFare.Amount = request.FareAmount;
                existingFare.UpdatedAt = DateTime.UtcNow;
                _context.Fares.Update(existingFare);
            }
            else
            {
                // If no fare exists, create a new fare record and set CreatedAt
                var newFare = new Fare
                {
                    VehicleType = driver.VehicleType,
                    StartingPoint = driver.StartingPoint,
                    DestinationLocation = driver.DestinationLocation,
                    Amount = request.FareAmount,
                    CreatedAt = DateTime.UtcNow,  // Set CreatedAt at the time of creation
                    UpdatedAt = DateTime.UtcNow   // Set UpdatedAt to the same time initially
                };
                await _context.Fares.AddAsync(newFare);
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Fare successfully set/updated." });
        }
    }
}
