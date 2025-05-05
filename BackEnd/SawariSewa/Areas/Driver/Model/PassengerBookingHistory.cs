using System.ComponentModel.DataAnnotations;

namespace SawariSewa.Areas.Driver.Model
{
    public class PassengerBookingHistory
    {
        [Key]
        public int HistoryId { get; set; } // Primary key

        public int DriverId { get; set; }  // References ApprovedDrivers.Id
        public string UserId { get; set; } // References AspNetUsers.Id

        public string DriverName { get; set; }
        public string DriverPhoneNumber { get; set; }

        public string VehicleNumber { get; set; }
        public string VehicleType { get; set; }

        public DateTime BookingDate { get; set; }
        public decimal Fare { get; set; }

        public string PickupPoint { get; set; }
        public string DropOffPoint { get; set; }

        public DateTime CompletedAt { get; set; }
    }

}