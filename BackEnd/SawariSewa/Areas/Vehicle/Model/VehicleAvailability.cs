using SawariSewa.Areas.Driver.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SawariSewa.Areas.Vehicle.Model
{
    public class VehicleAvailability
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("ApprovedDriver")]
        public int DriverId { get; set; }
        public ApprovedDrivers Driver { get; set; }

        [Required]
        public string VehicleType { get; set; }

        [Required, MaxLength(50)]
        public string VehicleNumber { get; set; }

        [Required]
        public int TotalSeats { get; set; }

        public int AvailableSeats { get; set; }

        public int BookedSeats { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string Destination { get; set; }

        [Required]
        public DateTime ? DepartureDate { get; set; }

        [Required]
        public string DepartureTime { get; set; }

        [Required]
        public decimal Fare { get; set; }

        [Required]
        public string Status { get; set; } = "Available"; // Default status

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public string PickupPoint { get; set; }
        public string DropOffPoint { get; set; }
        public string DriverPhoneNumber { get; set; }
        public string DriverFirstName { get; set; }
        public string DriverLastName { get; set; }
       
    }
}
