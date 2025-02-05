namespace SawariSewa.Areas.Driver.DTO
{
    public class DriverApplicationDTO
    {
       
        public string LicenseNumber { get; set; }
        public string VehicleType { get; set; }
        public string VehicleNumber { get; set; }
        public IFormFile LicensePhoto { get; set; }
        public IFormFile DriverPhoto { get; set; }
        public IFormFile BillbookPhoto { get; set; }
        public IFormFile CitizenshipFront { get; set; }
        public IFormFile CitizenshipBack { get; set; }
        public IFormFile SelfieWithID { get; set; }
        public string StartingPoint { get; set; }
        public string DestinationLocation { get; set; }
        //public DateTime CreatedAt { get; set; }
        //public string ApprovedBy { get; set; }
        //public DateTime? ApprovedAt { get; set; }
    }
}
