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

    [HttpPost("add-reviews")]
    [Authorize]
    public async Task<IActionResult> AddReview([FromBody] CreateReviewDto reviewDto)
    {
        if (reviewDto == null)
            return BadRequest("Review data is required.");

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var review = new Review
        {
            ApprovedDriverId = reviewDto.ApprovedDriverId,
            UserId = user.Id,
            Rating = reviewDto.Rating,
            Comment = reviewDto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review submitted successfully." });
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

}
