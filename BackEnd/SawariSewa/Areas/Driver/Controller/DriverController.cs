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
using System.Security.Cryptography.Xml;
using SawariSewa.Services;

namespace SawariSewa.Areas.Driver.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly IEmailService _emailServices;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<ApplicationUser> _userManager;

        public DriverController(ApplicationDbContext context, IWebHostEnvironment env, UserManager<ApplicationUser> userManager, IEmailService emailServices)
        {
            _context = context;
            _env = env;
            _userManager = userManager;
            _emailServices = emailServices;
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
                //var existingDriver = await _context.DriverApplications.FirstOrDefaultAsync(d => d.UserId == userId);
                //if (existingDriver != null)
                //{
                //    return BadRequest(new { message = "You are already registered as a driver." });
                //}

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
                string vehiclePhotoPath = await SaveFileAsync(driverApplicationDto.VehiclePhoto, "vehicles");

                // Validate all required documents are uploaded
                if (string.IsNullOrEmpty(licensePhotoPath) ||
                    string.IsNullOrEmpty(driverPhotoPath) ||
                    string.IsNullOrEmpty(billbookPhotoPath) ||
                    string.IsNullOrEmpty(citizenshipFrontPath) ||
                    string.IsNullOrEmpty(citizenshipBackPath) ||
                    string.IsNullOrEmpty(selfieWithIDPath)||
                    string.IsNullOrEmpty(vehiclePhotoPath))

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
                    CreatedAt = DateTime.UtcNow,
                    VehiclePhotoPath = vehiclePhotoPath
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


        

        [HttpGet("all-driver-applications")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<DriverApplicationReviewDTO>>> GetDriverApplications(
        int page = 1,
        int pageSize = 5)
        {
            // Validate page and pageSize
            page = page > 0 ? page : 1;
            pageSize = pageSize > 0 ? pageSize : 5;

            var driverApplicationsQuery = _context.DriverApplications
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
                        VehiclePhotoPath = d.VehiclePhotoPath,
                        StartingPoint = d.StartingPoint,
                        DestinationLocation = d.DestinationLocation,
                        Status = d.Status,
                        CreatedAt = d.CreatedAt,
                        ApprovedAt = d.ApprovedAt,
                        FirstName = u.FirstName,
                        LastName = u.LastName
                    });

            // Apply pagination (skip and take)
            var pagedApplications = await driverApplicationsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get total count for pagination metadata
            var totalCount = await driverApplicationsQuery.CountAsync();

            if (!pagedApplications.Any())
            {
                return Ok(new { data = new List<DriverApplicationReviewDTO>(), totalCount = 0 });
            }

            // Return paginated data along with total count for pagination UI
            return Ok(new
            {
                data = pagedApplications,
                totalCount = totalCount
            });
        }

        


        [HttpGet("single-driver-application/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<DriverApplicationReviewDTO>> GetSingleDriverApplication(int id)
        {
            var driverApplication = await _context.DriverApplications
                .Where(d => d.Id == id)
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
                    VehiclePhotoPath = d.VehiclePhotoPath,
                    StartingPoint = d.StartingPoint,
                    DestinationLocation = d.DestinationLocation,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber
                })
                .FirstOrDefaultAsync();
            if (driverApplication == null)
            {
                return NotFound(new {message = "Driver application not found."});
            }
            return Ok(driverApplication);
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

                // Create an ApprovedDriver record
                var approvedDriver = new ApprovedDrivers
                {
                    UserId = application.UserId,
                    LicenseNumber = application.LicenseNumber,
                    VehicleNumber = application.VehicleNumber,
                    VehicleType = application.VehicleType,
                    LicensePhotoPath = application.LicensePhotoPath,
                    DriverPhotoPath = application.DriverPhotoPath,
                    BillbookPhotoPath = application.BillbookPhotoPath,
                    CitizenshipFrontPath = application.CitizenshipFrontPath,
                    CitizenshipBackPath = application.CitizenshipBackPath,
                    SelfieWithIDPath = application.SelfieWithIDPath,
                    VehiclePhotoPath = application.VehiclePhotoPath,
                    StartingPoint = application.StartingPoint,
                    DestinationLocation = application.DestinationLocation,
                    PhoneNumber = application.User.PhoneNumber,
                    FirstName = application.User.FirstName,
                    LastName = application.User.LastName,
                    Email = application.User.Email,
                    ApprovedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                // Add the approved driver to the ApprovedDrivers table
                _context.ApprovedDrivers.Add(approvedDriver);

                // Remove the driver application after approval
                _context.DriverApplications.Remove(application);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Send email notification
                var subject = "Sawari Sewa: Driver Application Approved";
                var body = $"Dear {application.User.FirstName},<br><br>"
                    + "Congratulations! Your driver application has been approved. You can now start accepting rides. <br><br>"
                    + "Best Regards, <br> Sawari Sewa Team";

                await _emailServices.SendEmailAsync(application.User.Email, subject, body);

                return Ok(new { message = "Driver application approved and added to ApprovedDrivers table." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error approving application.", error = ex.Message });
            }
        }

        [HttpPost("reject-driver/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> RejectDriverApplication(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var application = await _context.DriverApplications
                    .Include(d => d.User)  // Include User data
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (application == null)
                    return NotFound(new { message = "Application not found." });

                if (application.Status != "Pending")
                    return BadRequest(new { message = "Application is not in a pending state." });

                // Remove the application after rejection
                _context.DriverApplications.Remove(application);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Send rejection email
                var subject = "Sawari Sewa: Driver Application Rejected";
                var body = $"Dear {application.User.FirstName},<br><br>"
                    + "We regret to inform you that your driver application has been rejected. <br><br>"
                    + "Best Regards, <br> Sawari Sewa Team";

                await _emailServices.SendEmailAsync(application.User.Email, subject, body);

                return Ok(new { message = "Driver application rejected." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error rejecting application.", error = ex.Message });
            }
        }



        [HttpGet ("driver-count")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task <ActionResult> GetDriverCounts()
        {
            var totalApplications = await _context.DriverApplications.CountAsync(); 
            var approvedDrivers = await _context.ApprovedDrivers.CountAsync();

            return Ok(new
            {
                totalApplications,
                approvedDrivers
            });
        }

        [HttpGet("all-approved-drivers")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<ApprovedDrivers>>> GetApprovedDriver(
            int page = 1,
            int pageSize = 5
            )
        {
            page = page > 0 ? page : 1;
            pageSize = pageSize > 0 ? pageSize : 5;

            var approvedDriversQuery = _context.ApprovedDrivers
                .Join(_context.Users,
                d => d.UserId,
                u => u.Id,
                (d, u) => new ApprovedDrivers
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
                    VehiclePhotoPath = d.VehiclePhotoPath,
                    StartingPoint = d.StartingPoint,
                    DestinationLocation = d.DestinationLocation,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                });
            var pagedApplications = await approvedDriversQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var totalCount = await approvedDriversQuery.CountAsync();

            if (!pagedApplications.Any())
            {
                return Ok(new { data = new List<DriverApplicationReviewDTO>(), totalCount = 0 });
            }

            // Return paginated data along with total count for pagination UI
            return Ok(new
            {
                totalCount = totalCount,
                data = pagedApplications

            });

        }

        [HttpGet("single-approved-driver/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<DriverApplicationReviewDTO>> GetSingleApprovedDriver(int id)
        {
            var driverApplication = await _context.ApprovedDrivers
                .Where(d => d.Id == id)
                .Join(_context.Users,
                d => d.UserId,
                u => u.Id,
                (d, u) => new ApprovedDrivers
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
                    VehiclePhotoPath = d.VehiclePhotoPath,
                    StartingPoint = d.StartingPoint,
                    DestinationLocation = d.DestinationLocation,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber
                })
                .FirstOrDefaultAsync();
            if (driverApplication == null)
            {
                return NotFound(new { message = "Driver application not found." });
            }
            return Ok(driverApplication);
        }

        
        // In your ApprovedDriversController
        [HttpGet("get-starting-points")]
       
        public IActionResult GetStartingPoints()
        {
            var startingPoints = _context.ApprovedDrivers.Select(d => d.StartingPoint).Distinct().ToList();
            return Ok(startingPoints);
        }
        [HttpGet("get-destination-location")]
      
        public IActionResult GetDestinationPoints()
        {
            var destinationLocations = _context.ApprovedDrivers.Select(d => d.DestinationLocation).Distinct().ToList();
            return Ok(destinationLocations);
        }

    }
}
