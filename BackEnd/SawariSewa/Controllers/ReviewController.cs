using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Data;
using SawariSewa.Models;
using SawariSewa.DTO;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReviewController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    //[HttpPost("add-reviews")]
    //[Authorize]
    //public async Task<IActionResult> AddReview([FromBody] CreateReviewDto reviewDto)
    //{
    //    if (reviewDto == null)
    //        return BadRequest("Review data is required.");

    //    var user = await _userManager.GetUserAsync(User);
    //    if (user == null) return Unauthorized();

    //    try
    //    {
    //        // Create the review record
    //        var review = new Review
    //        {
    //            ApprovedDriverId = reviewDto.ApprovedDriverId,
    //            UserId = user.Id,
    //            Rating = reviewDto.Rating,
    //            Comment = reviewDto.Comment,
    //            CreatedAt = DateTime.UtcNow
    //        };

    //        _context.Reviews.Add(review);

    //        // Find and update booking history with explicit SQL to ensure the update happens
    //        var bookingHistory = await _context.PassengerBookingHistory
    //            .Where(h => h.UserId == user.Id && h.DriverId == reviewDto.ApprovedDriverId &&
    //                   (h.Reviewed == false || h.Reviewed == null))
    //            .OrderByDescending(h => h.BookingDate)
    //            .FirstOrDefaultAsync();

    //        if (bookingHistory != null)
    //        {
    //            // Debug logging to see the state before update
    //            Console.WriteLine($"Before update: BookingHistory ID: {bookingHistory.HistoryId}, " +
    //                             $"Reviewed status: {bookingHistory.Reviewed}");

    //            // Set the value explicitly
    //            bookingHistory.Reviewed = true;

    //            // Force EF to detect changes by detaching and reattaching
    //            _context.Entry(bookingHistory).State = EntityState.Detached;
    //            _context.PassengerBookingHistory.Attach(bookingHistory);
    //            _context.Entry(bookingHistory).State = EntityState.Modified;


    //        }

    //        // Save changes
    //        var savedChanges = await _context.SaveChangesAsync();

    //        // Debug logging to confirm number of saved changes
    //        Console.WriteLine($"SaveChanges result: {savedChanges} rows affected");

    //        return Ok(new { message = "Review submitted successfully." });
    //    }
    //    catch (Exception ex)
    //    {
    //        // Log the exception details
    //        Console.WriteLine($"Error submitting review: {ex.Message}");
    //        Console.WriteLine($"Stack trace: {ex.StackTrace}");

    //        return StatusCode(500, new { message = "Failed to submit review", error = ex.Message });
    //    }
    //}

    [HttpPost("add-reviews")]
    [Authorize]
    public async Task<IActionResult> AddReview([FromBody] CreateReviewDto reviewDto)
    {
        if (reviewDto == null)
            return BadRequest("Review data is required.");

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        try
        {
            // Create the review record
            var review = new Review
            {
                ApprovedDriverId = reviewDto.ApprovedDriverId,
                UserId = user.Id,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);

            // Use HistoryId directly to update the correct booking record
            var bookingHistory = await _context.PassengerBookingHistory
                .FirstOrDefaultAsync(h => h.HistoryId == reviewDto.HistoryId && h.UserId == user.Id);

            if (bookingHistory != null)
            {
                Console.WriteLine($"Before update: BookingHistory ID: {bookingHistory.HistoryId}, " +
                                  $"Reviewed status: {bookingHistory.Reviewed}");

                bookingHistory.Reviewed = true;

                _context.Entry(bookingHistory).State = EntityState.Detached;
                _context.PassengerBookingHistory.Attach(bookingHistory);
                _context.Entry(bookingHistory).State = EntityState.Modified;
            }

            var savedChanges = await _context.SaveChangesAsync();

            Console.WriteLine($"SaveChanges result: {savedChanges} rows affected");

            return Ok(new { message = "Review submitted successfully." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error submitting review: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");

            return StatusCode(500, new { message = "Failed to submit review", error = ex.Message });
        }
    }


    [HttpGet("view-reviews/{approvedDriverId}")]
    public async Task<IActionResult> GetReviewsForDriver(int approvedDriverId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ApprovedDriverId == approvedDriverId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("my-average-rating")]
    [Authorize(Roles = "Driver")] // Optional: restrict to drivers
    public async Task<IActionResult> GetMyAverageRating()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        // Find the approved driver entry using the logged-in user's ID
        var approvedDriver = await _context.ApprovedDrivers
            .FirstOrDefaultAsync(d => d.UserId == user.Id);

        if (approvedDriver == null)
            return NotFound("You are not an approved driver.");

        // Calculate average rating
        var ratings = await _context.Reviews
            .Where(r => r.ApprovedDriverId == approvedDriver.Id)
            .Select(r => r.Rating)
            .ToListAsync();

        if (!ratings.Any())
            return Ok(new { averageRating = 0, totalReviews = 0 });

        double average = ratings.Average();

        return Ok(new
        {
            averageRating = Math.Round(average, 2),
            totalReviews = ratings.Count
        });
    }

    [HttpGet("driver-average-rating/{approvedDriverId}")]
    public async Task<IActionResult> GetAverageRatingByDriverId(int approvedDriverId)
    {
        // Check if the driver exists
        var approvedDriver = await _context.ApprovedDrivers
            .FirstOrDefaultAsync(d => d.Id == approvedDriverId);

        if (approvedDriver == null)
            return NotFound("Approved driver not found.");

        // Get all ratings for the driver
        var ratings = await _context.Reviews
            .Where(r => r.ApprovedDriverId == approvedDriverId)
            .Select(r => r.Rating)
            .ToListAsync();

        if (!ratings.Any())
            return Ok(0); // or return NotFound("No ratings found.");

        double average = ratings.Average();

        return Ok(Math.Round(average, 2));
    }

    [HttpGet("driver-reviews/{approvedDriverId}")]
    public async Task<IActionResult> GetReviewsByDriverId(int approvedDriverId)
    {
        // Step 1: Check if the driver exists
        var approvedDriver = await _context.ApprovedDrivers
            .FirstOrDefaultAsync(d => d.Id == approvedDriverId);

        if (approvedDriver == null)
            return NotFound("Approved driver not found.");

        // Step 2: Get reviews for this driver
        var reviews = await _context.Reviews
            .Where(r => r.ApprovedDriverId == approvedDriverId)
            .ToListAsync();

        // Step 3: Join with AspNetUsers to get passenger names
        var passengerIds = reviews.Select(r => r.UserId).Distinct().ToList();

        var passengers = await _context.Users
            .Where(u => passengerIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.FirstName + " " + u.LastName);

        // Step 4: Compose final response
        var result = reviews.Select(r => new
        {
            PassengerName = passengers.ContainsKey(r.UserId) ? passengers[r.UserId] : "Unknown",
            r.Rating,
            r.Comment,
            r.CreatedAt
        });

        return Ok(result);
    }


    [HttpGet("my-reviews")]
    [Authorize(Roles = "Driver")]
    public async Task<IActionResult> GetMyReviews()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        // Step 1: Get the ApprovedDriver entry using driver's UserId
        var approvedDriver = await _context.ApprovedDrivers
            .FirstOrDefaultAsync(d => d.UserId == user.Id);

        if (approvedDriver == null)
            return NotFound("You are not an approved driver.");

        // Step 2: Get reviews for this driver
        var reviews = await _context.Reviews
            .Where(r => r.ApprovedDriverId == approvedDriver.Id)
            .ToListAsync();

        // Step 3: Join with AspNetUsers to get passenger name
        var passengerIds = reviews.Select(r => r.UserId).Distinct().ToList();

        var passengers = await _context.Users
            .Where(u => passengerIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.FirstName + " " + u.LastName);

        // Step 4: Compose final response
        var result = reviews.Select(r => new
        {
            PassengerName = passengers.ContainsKey(r.UserId) ? passengers[r.UserId] : "Unknown",
            r.Rating,
            r.Comment,
            r.CreatedAt
        });

        return Ok(result);
    }

}
