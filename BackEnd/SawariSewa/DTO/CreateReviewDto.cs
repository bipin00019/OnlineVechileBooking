namespace SawariSewa.DTO
{
    public class CreateReviewDto
    {
        public int ApprovedDriverId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

}
