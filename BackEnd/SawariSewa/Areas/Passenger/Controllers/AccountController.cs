//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Identity.UI.Services;
//using Microsoft.AspNetCore.Mvc;
//using SawariSewa.Areas.Passenger.ViewModel;
//using SawariSewa.Areas.Passenger.Models;
//using SawariSewa.Controllers;
//using SawariSewa.Data;
//using SawariSewa.Services;
//using System.Security.Claims;

//namespace SawariSewa.Areas.Passenger.Controllers
//{
//    [Authorize]  // Default authorization for all actions
//    [Area("Passengers")]
//    [Route("api/[area]/[controller]")]
//    [ApiController]
//    public class AccountController : ApiControllerBase
//    {
//        private readonly UserManager<ApplicationUser> _userManager;
//        private readonly SignInManager<ApplicationUser> _signInManager;
//        private readonly IEmailSender _emailSender;
//        private readonly ILogger _logger;
//        private readonly IJwtService _jwtService;
//        private readonly ApplicationDbContext _context;

//        public AccountController(
//            ApplicationDbContext context,
//            UserManager<ApplicationUser> userManager,
//            SignInManager<ApplicationUser> signInManager,
//            IEmailSender emailSender,
//            ILoggerFactory loggerFactory,
//            IJwtService jwtService)
//        {
//            _context = context;
//            _userManager = userManager;
//            _signInManager = signInManager;
//            _emailSender = emailSender;
//            _logger = loggerFactory.CreateLogger<AccountController>();
//            _jwtService = jwtService;
//        }



//        [HttpPost("Register")]
//        public async Task<IActionResult> Register(PassengerRegistrationViewModel model)
//        {
//            try
//            {
//                if (!ModelState.IsValid)
//                    return ValidationError();

//                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//                var user = new ApplicationUser
//                {

//                    Email = model.EmailAddress,
//                    EmailConfirmed = true,
//                    // Auto-confirm since only SuperAdmin can create users
//                };

//                var result = await _userManager.CreateAsync(user, model.Password);
//                if (result.Succeeded)
//                {
//                    await _userManager.AddToRoleAsync(user, "Passenger");
//                    var roles = await _userManager.GetRolesAsync(user);

//                    return ApiResponse(new
//                    {
//                        //token,
//                        user = new
//                        {
//                            roles,

//                        }
//                    }, "Registration successful");
//                }
//                var passengerdetails = new PassengerDetails
//                {

//                    FirstName = model.FirstName,
//                    LastName = model.LastName,
//                    UserId = userId,
//                    PhoneNumber = model.PhoneNumber,
//                    EmailAddress = model.EmailAddress,
//                    Password = model.Password,
//                    ConfirmPassword = model.ConfirmPassword

//                };



//                _context.PassengerDetails.Add(passengerdetails);
//                await _context.SaveChangesAsync();
//                return ApiResponse(new
//                {
//                    passengerId = passengerdetails.PassengerID,
//                    firstName = passengerdetails.FirstName,
//                    lastName = passengerdetails.LastName,
//                    userId = passengerdetails.UserId,
//                    phoneNumber = passengerdetails.PhoneNumber,
//                    email = passengerdetails.EmailAddress,

//                }, "Passenger Registration Completed");
//            }

//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "An error occurred while registering passenger");

//                // Return a structured error response
//                return BadRequest(new
//                {
//                    success = false,
//                    message = "An error occurred while registering passenger",
//                    errors = ex.Message // You can add more detailed error information here
//                });
//            }

//        }
//    }
//}

using System.Security.Claims;
using SawariSewa.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.IdentityModel.Tokens;
using SawariSewa.Controllers;
using SawariSewa.Data;
using SawariSewa.Services;
using SawariSewa.ViewModels;
using SawariSewa.Areas.Passenger.ViewModel;

namespace TeleMedicineApp.Areas.Passenger.Controllers;

[Authorize]  // Default authorization for all actions
[Area("Passenger")]
[Route("api/[area]/[controller]")]
[ApiController]
public class AccountController : ApiControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IEmailSender _emailSender;
    private readonly ILogger _logger;
    private readonly IJwtService _jwtService;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailSender emailSender,
        ILoggerFactory loggerFactory,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
        _logger = loggerFactory.CreateLogger<AccountController>();
        _jwtService = jwtService;
    }


    [HttpPost("Register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(PassengerRegistrationViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            var user = new ApplicationUser
            {
                UserName = model.EmailAddress,
                Email = model.EmailAddress,
                EmailConfirmed = true,
                // Auto-confirm since only SuperAdmin can create users
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} created a new account", model.EmailAddress);

                

                var roles = await _userManager.GetRolesAsync(user);
                //var token = _jwtService.GenerateToken(user, roles);

                return ApiResponse(new
                {
                    //token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        roles,
                        emailConfirmed = user.EmailConfirmed
                    }
                }, "Registration successful");
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return ApiError("Registration failed", errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for {Email}", model.EmailAddress);
            return ApiError("Internal server error", statusCode: 500);
        }
    }

   
}

