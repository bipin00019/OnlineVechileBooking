using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SawariSewa.Data;

namespace SawariSewa.Areas.Vehicle.Model
{
    public class SeatBookings
    {
        [Key] // Marks this property as the primary key
        public int BookingId { get; set; }

        public int VehicleAvailabilityId { get; set; } // Foreign key to VehicleAvailability
        public string SeatNumber { get; set; } // Example: "A1", "B2"
        public string UserId { get; set; }  // Foreign key from AspNetUsers table
        public DateTime BookingDate { get; set; }
        public string BookingStatus { get; set; }
        public decimal Fare { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string PickupPoint { get; set; }
        public string DropOffPoint { get; set; }

        [ForeignKey("VehicleAvailabilityId")]
        public virtual VehicleAvailability VehicleAvailability { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}
