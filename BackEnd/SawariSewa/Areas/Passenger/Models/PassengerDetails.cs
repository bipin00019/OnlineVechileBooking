using SawariSewa.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SawariSewa.Areas.Passenger.Models
{
    public class PassengerDetails
    {
        [Key]
        public int PassengerID { get; set; } // Primary Key

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } // Foreign Key to ApplicationUser

        public ApplicationUser User { get; set; } // Navigation Property

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } // Passenger's First Name

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } // Passenger's Last Name

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } // Passenger's Phone Number

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; } // Passenger's Email Address

        [Required]
        [MaxLength(100, ErrorMessage = "Password cannot exceed 100 characters")]
        public string Password { get; set; } // Passenger's Password

        [Required]
        [MaxLength(100, ErrorMessage = "Confirm Password cannot exceed 100 characters")]
        [Compare("Password", ErrorMessage = "Password and Confirm Password do not match")]
        public string ConfirmPassword { get; set; } // Passenger's Confirm Password
    }
}
