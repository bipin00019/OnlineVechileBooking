﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Driver.Model;
using SawariSewa.Areas.Vehicle.Model;
using SawariSewa.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace SawariSewa.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    public DbSet<DriverApplications> DriverApplications { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<ApprovedDrivers> ApprovedDrivers { get; set; }
    public DbSet<Fare> Fares { get; set; }
    public DbSet<VehicleAvailability> VehicleAvailability { get; set; }
    public DbSet<SeatBookings> SeatBookings { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<DriverStats> DriverStats { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<PassengerBookingHistory> PassengerBookingHistory { get; set; }

    public DbSet<DriverTripHistory> DriverTripHistory { get; set; }

    public DbSet<CancelledBookings> CancelledBookings { get; set; }
    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
        base.OnModelCreating(modelbuilder);
        // modelbuilder.Entity<PassengerDetails>().ToTable("PassengerDetails");

        
    }
}