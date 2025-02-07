using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Driver.DTO;
using SawariSewa.Areas.Driver.Model;
using SawariSewa.Data;
using SawariSewa.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SawariSewa.Areas.Driver.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<ApplicationUser> _userManager;

        public DriverController(ApplicationDbContext context, IWebHostEnvironment env, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _env = env;
            _userManager = userManager;
        }

        [HttpPost("apply-for-driver")]
        public async Task<ActionResult<DriverApplications>> ApplyForDriver([FromForm] DriverApplicationDTO driverApplicationDto)
        {
            try
            {
                // Check if the DTO is null
                if (driverApplicationDto == null)
                {
                    return BadRequest(new { message = "Invalid application data provided." });
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(driverApplicationDto.LicenseNumber) ||
                    string.IsNullOrWhiteSpace(driverApplicationDto.VehicleNumber))
                {
                    return BadRequest(new { message = "License number and vehicle number are required." });
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated. Please log in." });
                }

                // Check if user exists in database
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound(new { message = "User account not found. Please register first." });
                }

                // Check if user is already a registered driver
                var existingDriver = await _context.DriverApplications.FirstOrDefaultAsync(d => d.UserId == userId);
                if (existingDriver != null)
                {
                    return BadRequest(new { message = "You are already registered as a driver." });
                }

                // Check for existing pending or in-progress applications
                var existingApplication = await _context.DriverApplications
                    .Where(d => d.UserId == userId && (d.Status == "Pending" || d.Status == "In Progress"))
                    .FirstOrDefaultAsync();
                if (existingApplication != null)
                {
                    return BadRequest(new
                    {
                        message = "You already have a pending application. Please wait for approval.",
                        applicationId = existingApplication.Id,
                        status = existingApplication.Status
                    });
                }

                // Validate and save files
                string licensePhotoPath = await SaveFileAsync(driverApplicationDto.LicensePhoto, "licenses");
                string driverPhotoPath = await SaveFileAsync(driverApplicationDto.DriverPhoto, "drivers");
                string billbookPhotoPath = await SaveFileAsync(driverApplicationDto.BillbookPhoto, "billbooks");
                string citizenshipFrontPath = await SaveFileAsync(driverApplicationDto.CitizenshipFront, "citizenships");
                string citizenshipBackPath = await SaveFileAsync(driverApplicationDto.CitizenshipBack, "citizenships");
                string selfieWithIDPath = await SaveFileAsync(driverApplicationDto.SelfieWithID, "selfies");

                // Validate all required documents are uploaded
                if (string.IsNullOrEmpty(licensePhotoPath) ||
                    string.IsNullOrEmpty(driverPhotoPath) ||
                    string.IsNullOrEmpty(billbookPhotoPath) ||
                    string.IsNullOrEmpty(citizenshipFrontPath) ||
                    string.IsNullOrEmpty(citizenshipBackPath) ||
                    string.IsNullOrEmpty(selfieWithIDPath))
                {
                    return BadRequest(new { message = "All required documents must be uploaded." });
                }

                var driverApplication = new DriverApplications
                {
                    UserId = userId,
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
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                };

                _context.DriverApplications.Add(driverApplication);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(ApplyForDriver),
                    new { id = driverApplication.Id },
                    new
                    {
                        message = "Driver application submitted successfully.",
                        application = driverApplication
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while processing your application.",
                    error = ex.Message
                });
            }
        }

        // Helper method to save uploaded files.
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

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                // Return relative path for storage in the database.
                return Path.Combine("uploads", folderName, fileName);
            }
            catch (Exception ex)
            {
                throw new Exception("File saving failed: " + ex.Message);
            }
        }

        // UPDATED: Endpoint for admin/superadmin to review all driver applications
        // with all the uploaded file paths and details.
        [HttpGet("all-driver-applications")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<DriverApplicationReviewDTO>>> GetDriverApplications()
        {
            var driverApplications = await _context.DriverApplications
                .Join(_context.Users,
                      d => d.UserId,
                      u => u.Id,
                      (d, u) => new DriverApplicationReviewDTO
                      {
                          Id = d.Id,
                          LicenseNumber = d.LicenseNumber,
                          VehicleType = d.VehicleType,
                          VehicleNumber = d.VehicleNumber,
                          LicensePhotoPath = d.LicensePhotoPath,
                          DriverPhotoPath = d.DriverPhotoPath,
                          BillbookPhotoPath = d.BillbookPhotoPath,
                          CitizenshipFrontPath = d.CitizenshipFrontPath,
                          CitizenshipBackPath = d.CitizenshipBackPath,
                          SelfieWithIDPath = d.SelfieWithIDPath,
                          StartingPoint = d.StartingPoint,
                          DestinationLocation = d.DestinationLocation,
                          Status = d.Status,
                          CreatedAt = d.CreatedAt,
                          ApprovedAt = d.ApprovedAt,
                          FirstName = u.FirstName,
                          LastName = u.LastName
                      })
                .ToListAsync();

            if (driverApplications == null || driverApplications.Count == 0)
            {
                return NotFound(new { message = "No driver applications found." });
            }

            return Ok(driverApplications);
        }

        [HttpPost("approve-driver/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ApproveDriverApplication(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var application = await _context.DriverApplications
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (application == null)
                    return NotFound(new { message = "Application not found." });

                if (application.Status != "Pending")
                    return BadRequest(new { message = "Application is not in a pending state." });

                // Add user to Driver role
                await _userManager.AddToRoleAsync(application.User, "Driver");

                // Remove the application from the DriverApplications table after approval
                _context.DriverApplications.Remove(application);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Driver application approved and removed from applications list." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error approving application.", error = ex.Message });
            }
        }

    }
}
