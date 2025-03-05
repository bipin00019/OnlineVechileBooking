public class Fare
{
    public int FareId { get; set; }
    public string VehicleType { get; set; }
    public string StartingPoint { get; set; }
    public string DestinationLocation { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
