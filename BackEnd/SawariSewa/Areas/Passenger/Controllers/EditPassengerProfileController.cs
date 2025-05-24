using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SawariSewa.Areas.Passenger.DTO;
using SawariSewa.Data;
using Microsoft.AspNetCore.Authorization;


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
        [Authorize] // Ensure the user is logged in
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto profileDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            var user = await _userManager.GetUserAsync(User); // Get the logged-in user

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            // Update only the necessary fields
            user.FirstName = profileDto.FirstName;
            user.LastName = profileDto.LastName;
            user.PhoneNumber = profileDto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Profile updated successfully." });
            }

            return BadRequest(result.Errors);
        }

    }
}
