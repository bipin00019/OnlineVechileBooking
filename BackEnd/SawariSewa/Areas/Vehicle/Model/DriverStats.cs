namespace SawariSewa.Areas.Vehicle.Model
{
    public class DriverStats
    {
        public int Id { get; set; }

        // This is the foreign key to your Identity User (Driver)
        public int DriverId { get; set; }

        public int TotalRides { get; set; }

        public decimal TotalIncome { get; set; }

        public decimal TodaysIncome { get; set; }

        public DateTime LastUpdated { get; set; }

        // Optional: Navigation property (if needed)
        // public ApplicationUser Driver { get; set; }
    }

}
