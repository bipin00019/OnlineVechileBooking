namespace SawariSewa.Areas.Vehicle.Model
{
    public class Payment
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
    }

}
