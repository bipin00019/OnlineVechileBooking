namespace SawariSewa.DTO
{
    public class CreateReviewDto
    {
        public int HistoryId { get; set; }
        public int ApprovedDriverId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }


    }

}
