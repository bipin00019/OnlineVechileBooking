using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SawariSewa.Data;

namespace SawariSewa.Areas.Vehicle.Model
{
    public class CancelledBookings
    {
        [Key]
        public int Id { get; set; }

        public int BookingId { get; set; } // This is the FK to SeatBookings

        public string UserId { get; set; } // FK to AspNetUsers

        public string KhaltiWalletNumber { get; set; }

        public decimal Fare { get; set; }

        public DateTime CancelledAt { get; set; }

        public string Reason { get; set; }

        public bool IsRefunded { get; set; }

        [ForeignKey("BookingId")]
        public virtual SeatBooking SeatBooking { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }

}
