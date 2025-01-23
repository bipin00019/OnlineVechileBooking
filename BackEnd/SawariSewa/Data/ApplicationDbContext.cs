﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SawariSewa.Areas.Passenger.Models;
using SawariSewa.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace SawariSewa.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<PassengerDetails> PassengerDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
        base.OnModelCreating(modelbuilder);
        modelbuilder.Entity<PassengerDetails>().ToTable("PassengerDetails");
    }
}