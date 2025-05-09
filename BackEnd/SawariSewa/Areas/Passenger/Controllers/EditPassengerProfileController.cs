using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SawariSewa.Areas.Passenger.DTO;
using SawariSewa.Data;  


namespace SawariSewa.Areas.Passenger.Controllers
{
    public class EditPassengerProfileController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        // Inject the UserManager
        public EditPassengerProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: Show the current user profile
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User); // Get the currently logged-in user
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Return the user profile data to the view
            return View(user);
        }

        // POST: Update the user profile (PUT request)
        [HttpPost("Edit-Profile")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto profileDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            var user = await _userManager.GetUserAsync(User); // Get logged-in user

            if (user == null)
            {
                return Unauthorized();
            }

            // Update only the necessary fields
            user.FirstName = profileDto.FirstName;
            user.LastName = profileDto.LastName;
            user.PhoneNumber = profileDto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok("Profile updated successfully.");
            }

            // If it fails, return errors
            return BadRequest(result.Errors);
        }
    }
}
