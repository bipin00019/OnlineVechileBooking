//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using SawariSewa.Data; // Adjust this based on your project's namespace
//using SawariSewa.Models; // Adjust this based on your project's namespace
//using System.Linq;
//using System.Threading.Tasks;

//namespace SawariSewa.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class RoleManagementController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly UserManager<ApplicationUser> _userManager;

//        public RoleManagementController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
//        {
//            _context = context;
//            _userManager = userManager;
//        }

//        [HttpPost("switch-role/{userId}")]
//        public async Task<IActionResult> SwitchRole(string userId)
//        {
//            // Fetch the user from the database
//            var user = await _userManager.FindByIdAsync(userId);
//            if (user == null)
//            {
//                return NotFound("User not found");
//            }

//            // Check if the user is an approved driver
//            var approvedDriver = await _context.ApprovedDrivers
//                                               .FirstOrDefaultAsync(d => d.UserId == userId);

//            if (approvedDriver == null || string.IsNullOrEmpty(approvedDriver.UserId))
//            {
//                return BadRequest("User is not an approved driver or UserId is null.");
//            }

//            // Fetch user roles
//            var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();

//            if (roles.Contains("Driver"))
//            {
//                // Switch to Passenger mode
//                await _userManager.RemoveFromRoleAsync(user, "Driver");
//                if (!roles.Contains("Passenger"))
//                {
//                    await _userManager.AddToRoleAsync(user, "Passenger");
//                }
//            }
//            else
//            {
//                // Switch to Driver mode
//                await _userManager.RemoveFromRoleAsync(user, "Passenger");
//                if (!roles.Contains("Driver"))
//                {
//                    await _userManager.AddToRoleAsync(user, "Driver");
//                }
//            }

//            return Ok("Role switched successfully.");
//        }


//    }
//}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data; // Adjust based on your project structure
using SawariSewa.Models; // Adjust based on your project structure
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SawariSewa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ensures only authenticated users can switch roles
    public class RoleManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleManagementController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        /// <summary>
        /// API to switch user roles (Driver ↔ Passenger)
        /// </summary>
        [HttpPost("switch-role/{userId}")]
        public async Task<IActionResult> SwitchRole(string userId)
        {
            // Fetch user from the database
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            // Fetch user's roles
            var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();

            // Check if the user is an approved driver
            bool isApprovedDriver = await _context.ApprovedDrivers.AnyAsync(d => d.UserId == userId);

            if (roles.Contains("Driver"))
            {
                // Switch to Passenger Mode
                await _userManager.RemoveFromRoleAsync(user, "Driver");
                if (!roles.Contains("Passenger"))
                {
                    await _userManager.AddToRoleAsync(user, "Passenger");
                }
            }
            else if (roles.Contains("Passenger") && isApprovedDriver)
            {
                // Switch to Driver Mode (Only if Approved)
                await _userManager.RemoveFromRoleAsync(user, "Passenger");
                await _userManager.AddToRoleAsync(user, "Driver");
            }
            else
            {
                return BadRequest("User is not an approved driver and cannot switch to Driver mode.");
            }

            return Ok(new { message = "Role switched successfully." });
        }

        // In your API controller
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the authenticated user
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var isApprovedDriver = await _context.ApprovedDrivers
                                                  .AnyAsync(d => d.UserId == userId);

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                User = user,
                Roles = roles,
                IsApprovedDriver = isApprovedDriver
            });
        }



    }
}
