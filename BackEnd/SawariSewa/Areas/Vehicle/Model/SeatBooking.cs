using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SawariSewa.Data;  // Assuming ApplicationUser is here

namespace SawariSewa.Areas.Vehicle.Model
{
    public class SeatBooking
    {
        [Key]
        public int BookingId { get; set; }

        public int VehicleAvailabilityId { get; set; }  // FK to VehicleAvailability

        public string SeatNumber { get; set; }  // Example: "A1", "B2"

        public string UserId { get; set; }  // FK to AspNetUsers

        public DateTime BookingDate { get; set; }

        public string BookingStatus { get; set; }

        public string RideStatus { get; set; }

        public decimal Fare { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string PickupPoint { get; set; }

        public string DropOffPoint { get; set; }

        [ForeignKey("VehicleAvailabilityId")]
        public virtual VehicleAvailability VehicleAvailability { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        // Optional manual booking fields
        public string? ManualPassengerName { get; set; }

        public string? ManualPassengerPhoneNumber { get; set; }
    }
}
