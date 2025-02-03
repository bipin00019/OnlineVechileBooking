using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Security.Claims;
using SawariSewa.Areas.Driver.Model;
using SawariSewa.Areas.Driver.DTO;

namespace SawariSewa.Areas.Driver.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DriverController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST: api/Driver/apply-for-driver
        [HttpPost("apply-for-driver")]
        public async Task<ActionResult<DriverApplications>> ApplyForDriver([FromForm] DriverApplicationDTO driverApplicationDto)
        {
            // Get the UserId from the logged-in user (from the claims)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            // Check if the user exists in the database
            var user = await _context.Users.FindAsync(userId); // Use the userId from the claims
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Generate file paths for images
            string licensePhotoPath = await SaveFileAsync(driverApplicationDto.LicensePhoto, "licenses");
            string driverPhotoPath = await SaveFileAsync(driverApplicationDto.DriverPhoto, "drivers");
            string billbookPhotoPath = await SaveFileAsync(driverApplicationDto.BillbookPhoto, "billbooks");
            string citizenshipFrontPath = await SaveFileAsync(driverApplicationDto.CitizenshipFront, "citizenships");
            string citizenshipBackPath = await SaveFileAsync(driverApplicationDto.CitizenshipBack, "citizenships");
            string selfieWithIDPath = await SaveFileAsync(driverApplicationDto.SelfieWithID, "selfies");

            // Map DTO to entity
            var driverApplication = new DriverApplications
            {
                UserId = userId, // Use the userId from the claims
                LicenseNumber = driverApplicationDto.LicenseNumber,
                VehicleType = driverApplicationDto.VehicleType,
                VehicleNumber = driverApplicationDto.VehicleNumber,
                LicensePhotoPath = licensePhotoPath,
                DriverPhotoPath = driverPhotoPath,
                BillbookPhotoPath = billbookPhotoPath,
                CitizenshipFrontPath = citizenshipFrontPath,
                CitizenshipBackPath = citizenshipBackPath,
                SelfieWithIDPath = selfieWithIDPath,
                StartingPoint = driverApplicationDto.StartingPoint,
                DestinationLocation = driverApplicationDto.DestinationLocation,
                Status = "Pending",  // You can set it to "Pending" or modify as per business logic
                CreatedAt = DateTime.UtcNow
            };

            // Save to the database
            _context.DriverApplications.Add(driverApplication);
            await _context.SaveChangesAsync();

            // Return the created driver application with proper route
            return CreatedAtAction(nameof(ApplyForDriver), new { id = driverApplication.Id }, driverApplication);
        }

        // Method to save file to the server
        private async Task<string> SaveFileAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            string folderPath = Path.Combine(_env.WebRootPath, "uploads", folderName);
            Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(folderPath, fileName);

            // Save the file to the server
            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return Path.Combine("uploads", folderName, fileName);
            }
            catch (Exception ex)
            {
                // Handle file save errors and log
                throw new Exception("File saving failed: " + ex.Message);
            }
        }
    }
}



