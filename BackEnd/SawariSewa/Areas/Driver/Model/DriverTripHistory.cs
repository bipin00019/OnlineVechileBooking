using System;
using System.ComponentModel.DataAnnotations;

namespace SawariSewa.Areas.Driver.Model
{
    public class DriverTripHistory
    {
        [Key] // Primary Key
        public int HistoryId { get; set; }

        // User and Driver Information
        public string UserId { get; set; }  // User who made the booking (Passenger)
     

     
     
        // Booking details
        public DateTime BookingDate { get; set; }
        public decimal Fare { get; set; }

        // Pickup and Drop-off points
        public string PickupPoint { get; set; }
        public string DropOffPoint { get; set; }

        // Completion time
        public DateTime CreatedAt { get; set; }
    }
}
