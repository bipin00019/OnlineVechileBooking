using SawariSewa.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using SawariSewa.Data;


namespace SawariSewa.Areas.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ILogger<OtpController> _logger;
        public static string _globalVerificationCode; // Global variable for verification code
        public static string _globalEmail; // Global variable for email
        public static DateTime _codeGeneratedTime; // Global variable for code timestamp
        public readonly TimeSpan _codeExpiryTime = TimeSpan.FromMinutes(5);
        private readonly UserManager<ApplicationUser> _userManager;

        public OtpController(EmailService emailService, ILogger<OtpController> logger, UserManager<ApplicationUser> userManager)
        {
            _emailService = emailService;
            _logger = logger;
            _userManager = userManager; // Inject UserManager for checking user existence
        }

        //public OtpController(EmailService emailService, ILogger<OtpController> logger)
        //{
        //    _emailService = emailService;
        //    _logger = logger;
        //}

        [AllowAnonymous]
        //[HttpPost("send-code-for-register")]
        //public async Task<IActionResult> SendVerificationCodeRegister([FromBody] string email)
        //{
        //    if (string.IsNullOrEmpty(email))
        //    {
        //        return BadRequest(new { success = false, message = "Email is required." });
        //    }

        //    email = email.ToLower(); // Normalize email

        //    // Check if the email is already registered
        //    var user = await _userManager.FindByEmailAsync(email);
        //    if (user != null)
        //    {
        //        // Return a message if the email is already registered
        //        return BadRequest(new { success = false, message = "This email is already registered. Cannot send verification code." });
        //    }

        //    // Check if the verification code was recently sent (optional)
        //    //if (_globalEmail == email && _codeGeneratedTime.AddMinutes(5) > DateTime.UtcNow)
        //    //{
        //    //    // Prevent sending the code if it was recently sent (within 5 minutes)
        //    //    return BadRequest("A verification code was already sent. Please wait before requesting a new one.");
        //    //}

        //    // Generate a random 6-digit code
        //    _globalVerificationCode = new Random().Next(100000, 999999).ToString();
        //    _globalEmail = email;
        //    _codeGeneratedTime = DateTime.UtcNow;

        //    _logger.LogInformation($"Generated code: {_globalVerificationCode} for email: {email}");

        //    // Send email
        //    var subject = "Your Email Verification Code";
        //    var message = $"Your verification code is: {_globalVerificationCode}";
        //    await _emailService.SendEmailAsync(email, subject, message);

        //    return Ok(new { success = true, message = "Verification code sent." });
        //}
        [HttpPost("send-code-for-register")]
        public async Task<IActionResult> SendVerificationCodeRegister([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email is required." });
            }

            email = email.ToLower(); // Normalize email

            // Check if the email is already registered
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                // Return a message if the email is already registered
                return BadRequest(new { success = false, message = "This email is already registered. Cannot send verification code." });
            }

            // Generate a random 6-digit code
            _globalVerificationCode = new Random().Next(100000, 999999).ToString();
            _globalEmail = email;
            _codeGeneratedTime = DateTime.UtcNow;

            _logger.LogInformation($"Generated code: {_globalVerificationCode} for email: {email}");

            // Send email
            var subject = "Your Email Verification Code";
            var message = $"Your verification code is: {_globalVerificationCode}";
            await _emailService.SendEmailAsync(email, subject, message);

            return Ok(new { success = true, message = "Verification code sent." });
        }



        [AllowAnonymous]
        [HttpPost("send-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            email = email.ToLower(); // Normalize email

            // Generate a random 6-digit code
            _globalVerificationCode = new Random().Next(100000, 999999).ToString();
            _globalEmail = email;
            _codeGeneratedTime = DateTime.UtcNow;

            _logger.LogInformation($"Generated code: {_globalVerificationCode} for email: {email}");

            // Send email
            var subject = "Your Email Verification Code";
            var message = $"Your verification code is: {_globalVerificationCode}";
            await _emailService.SendEmailAsync(email, subject, message);

            return Ok("Verification code sent.");
        }

        [HttpPost("verify-code")]
        [AllowAnonymous]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
            {
                return BadRequest("Email and code are required.");
            }

            var email = request.Email.ToLower();
            if (_globalEmail != email)
            {
                _logger.LogWarning($"Verification attempt for an email that does not match: {email}");
                return BadRequest("No verification code found for this email.");
            }

            // Check if code has expired
            if (DateTime.UtcNow - _codeGeneratedTime > _codeExpiryTime)
            {
                _logger.LogWarning($"Verification code expired for email: {email}");
                return BadRequest("Verification code has expired.");
            }

            if (_globalVerificationCode == request.Code)
            {
                _logger.LogInformation($"Email {email} successfully verified.");
                _globalVerificationCode = null; // Clear global variables
                _globalEmail = null;
                return Ok("Email verified successfully.");
            }

            _logger.LogWarning($"Invalid verification code for email: {email}. Entered: {request.Code}, Expected: {_globalVerificationCode}");
            return BadRequest("Invalid verification code.");
        }
    }

    public class VerifyCodeRequest
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }

}
