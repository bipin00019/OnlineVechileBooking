using SawariSewa.Areas.Driver.Model;
using SawariSewa.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SawariSewa.Areas.Driver.Model;


namespace SawariSewa.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ApprovedDriverId { get; set; }
        public string UserId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public ApprovedDrivers ApprovedDriver { get; set; }
        public ApplicationUser User { get; set; }
    }

}