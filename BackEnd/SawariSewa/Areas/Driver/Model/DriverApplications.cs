﻿using Microsoft.Identity.Client;
using SawariSewa.Data;

namespace SawariSewa.Areas.Driver.Model
{
    public class DriverApplications
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string LicenseNumber { get; set; }
        public string VehicleType { get; set; }
        public string VehicleNumber { get; set; }
        public string LicensePhotoPath { get; set; }
        public string DriverPhotoPath { get; set; }
        public string BillbookPhotoPath { get; set; }
        public string CitizenshipFrontPath { get; set; }
        public string CitizenshipBackPath { get; set; }
        public string SelfieWithIDPath { get; set; }
        public string StartingPoint { get; set; }
        public string DestinationLocation { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string VehiclePhotoPath { get; set; }
        public string DepartureTime { get; set; }
        public string PickupPoint { get; set; }
        public string DropOffPoint { get; set; }

        // Navigation property to link with AspNetUsers table
        public virtual ApplicationUser User { get; set; }
    }
}
