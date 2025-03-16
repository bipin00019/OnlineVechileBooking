namespace SawariSewa.Areas.Vehicle.DTO
{
    public class EditVehicleScheduleDto
    {
        
        public int TotalSeats { get; set; }  // Total seats for the vehicle
        public decimal Fare { get; set; }  // Admin sets the fare for the trip
        public DateTime? DepartureDate { get; set; }
        public int BookedSeats { get; set; }
    }
}
