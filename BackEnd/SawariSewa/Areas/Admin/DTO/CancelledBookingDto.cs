namespace SawariSewa.Areas.Admin.DTO
{
    public class CancelledBookingDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string KhaltiWalletNumber { get; set; }
        public decimal Fare { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string Reason { get; set; }
        public bool IsRefunded { get; set; }
    }

}
