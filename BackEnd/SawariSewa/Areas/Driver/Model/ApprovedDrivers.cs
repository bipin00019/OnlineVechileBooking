namespace SawariSewa.Areas.Driver.Model
{
    public class ApprovedDrivers
    {
        public int Id { get; set; }
        public string UserId { get; set; }            // Reference to the User table
        public string LicenseNumber { get; set; }
        public string VehicleType { get; set; }
        public string VehicleNumber { get; set; }
        public string LicensePhotoPath { get; set; }
        public string DriverPhotoPath { get; set; }
        public string BillbookPhotoPath { get; set; }
        public string CitizenshipFrontPath { get; set; }
        public string CitizenshipBackPath { get; set; }
        public string SelfieWithIDPath { get; set; }
        public string VehiclePhotoPath { get; set; }
        public string StartingPoint { get; set; }
        public string DestinationLocation { get; set; }


        // New fields
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }


        public DateTime ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DepartureTime {  get; set; }
        public bool? IsOnline { get; set; }
    }

}
