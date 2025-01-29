using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SawariSewa.Data;


namespace SawariSewa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResetPasswordController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public ResetPasswordController (UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost ("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.NewPassword) || string.IsNullOrEmpty(model.ConfirmPassword))
            {
                return BadRequest("Email, New Password, and Confirm Password are required");
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest("New Password and Confirm Password must match");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Set the new password
            var result = await _userManager.RemovePasswordAsync(user); // Remove existing password
            if (!result.Succeeded)
            {
                return BadRequest("Failed to remove existing password");
            }

            result = await _userManager.AddPasswordAsync(user, model.NewPassword); // Add new password
            if (!result.Succeeded)
            {
                return BadRequest("Failed to set new password");
            }

            return Ok("Password has been reset successfully");
        }
    }
        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmPassword { get; set; }
        }
    }
