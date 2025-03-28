using System.Threading.Tasks;

namespace SawariSewa.Areas.Vehicle.Services
{
    public interface IBookingService
    {
        // Method to book the seat after payment
        Task<bool> BookSeatAsync(int bookingId, string userId, string seatNumbers);
    }
}
