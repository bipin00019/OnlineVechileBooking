//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.IdentityModel.Tokens;
//using SawariSewa.Controllers;
//using SawariSewa.Data;
//using SawariSewa.Services;
//using SawariSewa.ViewModels;

//namespace SawariSewa.Areas.Passenger.Controllers
//{
//    public class AccountController : Controller
//    {
//        public IActionResult Index()
//        {
//            return View();
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

namespace SawariSewa.Areas.Passenger.Controllers;

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
    public async Task<IActionResult> Register(PassengerRegisterViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                EmailConfirmed = true,
                // Auto-confirm since only SuperAdmin can create users
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} created a new account", model.Email);

                // Assign roles based on the request


                var roles = await _userManager.AddToRoleAsync(user, "Passenger");
                //var token = _jwtService.GenerateToken(user, roles);

                return ApiResponse(new
                {
                    //token,
                    user = new
                    {
                        UserName = model.UserName,
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
            _logger.LogError(ex, "Error during registration for {Email}", model.Email);
            return ApiError("Internal server error", statusCode: 500);
        }
    }
}