namespace SawariSewa.Areas.Passenger.Models
{
    using SawariSewa.Areas.Driver.Model;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class VehicleSchedule
    {
        [Key]
        public int ScheduleId { get; set; }

        // Foreign key references ApprovedDrivers
        public int DriverId { get; set; }
        [ForeignKey("DriverId")]

        public string DriverFirstName { get; set; }
        public string DriverLastName { get; set; }
        public string DriverPhoneNumber { get; set; }

        public string VehicleType { get; set; }
        public string VehicleNumber { get; set; }
        public string StartingPoint { get; set; }
        public string DestinationLocation { get; set; }

        public DateTime DepartureDate { get; set; }
        public string DepartureTime { get; set; }

        public int TotalSeats { get; set; }
        public int AvailableSeats { get; set; }
        public int BookedSeats { get; set; }

        // Foreign key references Fares
        public int FareId { get; set; }
        [ForeignKey("FareId")]
        public Fare Fare { get; set; }

        public decimal FareAmount { get; set; }

        public bool IsOnline { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}
