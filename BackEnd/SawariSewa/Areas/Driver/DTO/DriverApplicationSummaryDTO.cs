namespace SawariSewa.Areas.Driver.DTO
{
    public class DriverApplicationSummaryDTO
    {
        public int Id { get; set; }  // Add the Id property
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LicenseNumber { get; set; }
        public string VehicleNumber { get; set; }
        public string StartingPoint { get; set; }
        public string DestinationLocation { get; set; }
        
    }
}
