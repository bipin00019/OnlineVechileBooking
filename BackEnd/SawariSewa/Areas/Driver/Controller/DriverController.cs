//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using SawariSewa.Data;
//using System;
//using System.IO;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Hosting;
//using System.Security.Claims;
//using SawariSewa.Areas.Driver.Model;
//using SawariSewa.Areas.Driver.DTO;

//namespace SawariSewa.Areas.Driver.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DriverController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly IWebHostEnvironment _env;

//        public DriverController(ApplicationDbContext context, IWebHostEnvironment env)
//        {
//            _context = context;
//            _env = env;
//        }

//        // POST: api/Driver/apply-for-driver
//        [HttpPost("apply-for-driver")]
//        public async Task<ActionResult<DriverApplications>> ApplyForDriver([FromForm] DriverApplicationDTO driverApplicationDto)
//        {
//            // Get the UserId from the logged-in user (from the claims)
//            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            if (userId == null)
//            {
//                return Unauthorized("User not authenticated.");
//            }

//            // Check if the user exists in the database
//            var user = await _context.Users.FindAsync(userId); // Use the userId from the claims
//            if (user == null)
//            {
//                return NotFound("User not found");
//            }

//            // Generate file paths for images
//            string licensePhotoPath = await SaveFileAsync(driverApplicationDto.LicensePhoto, "licenses");
//            string driverPhotoPath = await SaveFileAsync(driverApplicationDto.DriverPhoto, "drivers");
//            string billbookPhotoPath = await SaveFileAsync(driverApplicationDto.BillbookPhoto, "billbooks");
//            string citizenshipFrontPath = await SaveFileAsync(driverApplicationDto.CitizenshipFront, "citizenships");
//            string citizenshipBackPath = await SaveFileAsync(driverApplicationDto.CitizenshipBack, "citizenships");
//            string selfieWithIDPath = await SaveFileAsync(driverApplicationDto.SelfieWithID, "selfies");

//            // Map DTO to entity
//            var driverApplication = new DriverApplications
//            {
//                UserId = userId, // Use the userId from the claims
//                LicenseNumber = driverApplicationDto.LicenseNumber,
//                VehicleType = driverApplicationDto.VehicleType,
//                VehicleNumber = driverApplicationDto.VehicleNumber,
//                LicensePhotoPath = licensePhotoPath,
//                DriverPhotoPath = driverPhotoPath,
//                BillbookPhotoPath = billbookPhotoPath,
//                CitizenshipFrontPath = citizenshipFrontPath,
//                CitizenshipBackPath = citizenshipBackPath,
//                SelfieWithIDPath = selfieWithIDPath,
//                StartingPoint = driverApplicationDto.StartingPoint,
//                DestinationLocation = driverApplicationDto.DestinationLocation,
//                Status = "Pending",  // You can set it to "Pending" or modify as per business logic
//                CreatedAt = DateTime.UtcNow
//            };

//            // Save to the database
//            _context.DriverApplications.Add(driverApplication);
//            await _context.SaveChangesAsync();

//            // Return the created driver application with proper route
//            return CreatedAtAction(nameof(ApplyForDriver), new { id = driverApplication.Id }, driverApplication);
//        }

//        // Method to save file to the server
//        private async Task<string> SaveFileAsync(IFormFile file, string folderName)
//        {
//            if (file == null || file.Length == 0)
//            {
//                return null;
//            }

//            string folderPath = Path.Combine(_env.WebRootPath, "uploads", folderName);
//            Directory.CreateDirectory(folderPath);

//            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
//            string filePath = Path.Combine(folderPath, fileName);

//            // Save the file to the server
//            try
//            {
//                using (var stream = new FileStream(filePath, FileMode.Create))
//                {
//                    await file.CopyToAsync(stream);
//                }
//                return Path.Combine("uploads", folderName, fileName);
//            }
//            catch (Exception ex)
//            {
//                // Handle file save errors and log
//                throw new Exception("File saving failed: " + ex.Message);
//            }
//        }


//    }
//}

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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

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
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "User account not found. Please register first." });
                }

                // Check if user is already a registered driver
                var existingDriver = await _context.DriverApplications
                    .FirstOrDefaultAsync(d => d.UserId == userId);

                if (existingDriver != null)
                {
                    return BadRequest(new { message = "You are already registered as a driver." });
                }

                // Check for existing pending or in-progress applications
                var existingApplication = await _context.DriverApplications
                    .Where(d => d.UserId == userId &&
                           (d.Status == "Pending" || d.Status == "In Progress"))
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
                // Log the exception details here
                return StatusCode(500, new
                {
                    message = "An error occurred while processing your application.",
                    error = ex.Message
                });
            }
        }

        // Existing SaveFileAsync method remains the same
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
                return Path.Combine("uploads", folderName, fileName);
            }
            catch (Exception ex)
            {
                throw new Exception("File saving failed: " + ex.Message);
            }
        }

        // Existing GetDriverApplications method remains the same
        [HttpGet("all-driver-applications")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<DriverApplicationSummartDTO>>> GetDriverApplications()
        {
            var driverApplications = await _context.DriverApplications
                .Join(_context.Users,
                      d => d.UserId,
                      u => u.Id,
                      (d, u) => new DriverApplicationSummartDTO
                      {
                          Id = d.Id,
                          LicenseNumber = d.LicenseNumber,
                          VehicleNumber = d.VehicleNumber,
                          StartingPoint = d.StartingPoint,
                          DestinationLocation = d.DestinationLocation,
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

        //[HttpGet("license/{id}")]
        //public async Task<ActionResult<string>> GetDriverLicense(int id)
        //{
        //    try
        //    {
        //        var driverApplication = await _context.DriverApplications
        //            .Where(d => d.Id == id)
        //            .Select(d => new { d.LicenseNumber })
        //            .FirstOrDefaultAsync();

        //        if (driverApplication == null)
        //        {
        //            return NotFound(new { message = "No driver application found with the specified ID." });
        //        }

        //        return Ok(new { licenseNumber = driverApplication.LicenseNumber });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            message = "An error occurred while retrieving the license number.",
        //            error = ex.Message
        //        });
        //    }
        //}
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
                    return BadRequest(new { message = "Application is not in pending state." });

                // Update application status
                application.Status = "Approved";
                application.ApprovedAt = DateTime.UtcNow;

                // Add user to Driver role
                await _userManager.AddToRoleAsync(application.User, "Driver");

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Driver application approved successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error approving application.", error = ex.Message });
            }
        }

    }
}


