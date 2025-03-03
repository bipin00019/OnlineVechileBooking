﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Driver.Model;
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


    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
        base.OnModelCreating(modelbuilder);
       // modelbuilder.Entity<PassengerDetails>().ToTable("PassengerDetails");
    }
}