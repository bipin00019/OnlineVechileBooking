namespace SawariSewa.Areas.Vehicle.DTO
{
    public class VehicleScheduleDto
    {
        public int DriverId { get; set; }  // Driver ID to fetch vehicle details
        public int TotalSeats { get; set; }  // Total seats for the vehicle
        public decimal Fare { get; set; }  // Admin sets the fare for the trip
        public DateTime ? DepartureDate { get; set; }
    }
}
