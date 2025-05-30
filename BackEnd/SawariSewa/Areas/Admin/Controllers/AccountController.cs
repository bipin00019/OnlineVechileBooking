﻿using System.Security.Claims;
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
using Microsoft.EntityFrameworkCore;

namespace TeleMedicineApp.Areas.Admin.Controllers;

[Authorize]  // Default authorization for all actions
[Area("Admin")]
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


    [HttpPost("Login")]
    [AllowAnonymous]  // Override the controller-level authorization for login
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            var user = await _userManager.FindByEmailAsync(model.Email);

            // Check if the email is registered
            if (user == null)
            {
                _logger.LogWarning("Unregistered email attempted login: {Email}", model.Email);
                return UnauthorizedError("Unregistered email");
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var (token, refreshToken) = await _jwtService.GenerateTokensAsync(user, roles);

                _logger.LogInformation("User {Email} logged in successfully", model.Email);

                return ApiResponse(new
                {
                    token,
                    refreshToken,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        roles,

                    }
                }, "Login successful");
            }

            if (result.RequiresTwoFactor)
            {
                return ApiResponse(new { requiresTwoFactor = true });
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning("User {Email} account locked out", model.Email);
                return ApiError("Account locked out", statusCode: 423);
            }

            _logger.LogWarning("Invalid credentials for {Email}", model.Email);
            return UnauthorizedError("Invalid credentials");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", model.Email);
            return ApiError("Internal server error", statusCode: 500);
        }
    }


    [HttpPost("RefreshToken")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
    {
        try
        {
            var (newToken, newRefreshToken) = await _jwtService.RefreshTokenAsync(refreshToken);

            return ApiResponse(new
            {
                token = newToken,
                refreshToken = newRefreshToken
            }, "Token refreshed successfully");
        }
        catch (SecurityTokenException ex)
        {
            return UnauthorizedError(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return ApiError("Internal server error", statusCode: 500);
        }
    }


    //[HttpPost("Register")]
    //[AllowAnonymous]
    //public async Task<IActionResult> Register(RegisterViewModel model)
    //{
    //    try
    //    {
    //        if (!ModelState.IsValid)
    //            return ValidationError();

    //        var user = new ApplicationUser
    //        {
    //            UserName = model.Email,
    //            PhoneNumber = model.PhoneNumber,
    //            Email = model.Email,// Auto-confirm email during registration
    //            FirstName = model.FirstName,
    //            LastName = model.LastName,
    //            EmailConfirmed = true,



    //        };

    //        var result = await _userManager.CreateAsync(user, model.Password);

    //        if (result.Succeeded)
    //        {
    //            _logger.LogInformation("User {Email} created a new account", model.Email);

    //            // Assign the default role "Passenger" to all new users
    //            await _userManager.AddToRoleAsync(user, "Passenger");

    //            var roles = await _userManager.GetRolesAsync(user);

    //            var (token, refreshToken) = await _jwtService.GenerateTokensAsync(user, roles);

    //            return ApiResponse(new
    //            {
    //                token,
    //                refreshToken,
    //                user = new
    //                {
    //                    id = user.Id,
    //                    email = user.Email,
    //                    roles,
    //                    emailConfirmed = user.EmailConfirmed,
    //                    user.PhoneNumber,
    //                    user.FirstName,
    //                    user.LastName,
    //                }
    //            }, "Registration successful");
    //        }

    //        var errors = result.Errors.Select(e => e.Description).ToList();
    //        return ApiError("Registration failed", errors);
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error during registration for {Email}", model.Email);
    //        return ApiError("Internal server error", statusCode: 500);
    //    }
    //}

    [HttpPost("Register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            // Check if a user with the same phone number already exists
            var existingUserWithPhone = await _userManager.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);

            if (existingUserWithPhone != null)
            {
                return ApiError("A user with this phone number already exists.");
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                PhoneNumber = model.PhoneNumber,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} created a new account", model.Email);

                await _userManager.AddToRoleAsync(user, "Passenger");

                var roles = await _userManager.GetRolesAsync(user);

                var (token, refreshToken) = await _jwtService.GenerateTokensAsync(user, roles);

                return ApiResponse(new
                {
                    token,
                    refreshToken,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        roles,
                        emailConfirmed = user.EmailConfirmed,
                        user.PhoneNumber,
                        user.FirstName,
                        user.LastName,
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


    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out");
        return ApiResponse(true, "Logout successful");
    }

    [HttpPost("ConfirmEmail")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string userId, string code)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            return ValidationError("User ID and confirmation code are required");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFoundError("User not found");

        var result = await _userManager.ConfirmEmailAsync(user, code);
        if (result.Succeeded)
            return ApiResponse(true, "Email confirmed successfully");

        var errors = result.Errors.Select(e => e.Description).ToList();
        return ApiError("Email confirmation failed", errors);
    }

    private void AddErrors(IdentityResult result)
    {
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
    }


}