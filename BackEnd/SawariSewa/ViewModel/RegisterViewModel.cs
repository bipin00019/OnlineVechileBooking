using System.ComponentModel.DataAnnotations;

namespace SawariSewa.ViewModels;

public class RegisterViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "The full name must not exceed 50 characters.")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "The full name must not exceed 50 characters.")]
    public string LastName { get; set; }

    [Required]
    public string PhoneNumber { get; set; } // Phone Number property with 10-digit constraint
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }

    //public string Role { get; set; } = "User";
}