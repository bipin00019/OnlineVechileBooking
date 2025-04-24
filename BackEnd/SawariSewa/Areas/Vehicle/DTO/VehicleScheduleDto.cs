namespace SawariSewa.Areas.Vehicle.DTO
{
    public class VehicleScheduleDto
    {       
        public int TotalSeats { get; set; }  // Total seats for the vehicle
        public decimal Fare { get; set; }  // Admin sets the fare for the trip
        public int bookedSeats { get; set; }
        public DateTime ? DepartureDate { get; set; }
    }
}
