using System.Security.Claims;
using System.Text;
using SawariSewa.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using SawariSewa.Data;
using SawariSewa.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Add Swagger support to explore the APIs
builder.Services.AddEndpointsApiExplorer();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        // Allow React app from http://localhost:5173 (Vite default port)
        builder
            .WithOrigins("http://localhost:5173") // React app origin
            .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
            .AllowAnyHeader() // Allow all headers
            .AllowCredentials(); // Allow cookies/credentials if needed
    });

    // Optionally, you can define a policy to allow all origins, but use this only in development.
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Allow all origins
              .AllowAnyHeader()  // Allow all headers
              .AllowAnyMethod(); // Allow all methods
    });
});

// Add Swagger documentation and authentication settings
builder.Services.AddSwaggerGen(options =>
{
    // Add JWT Authorization in Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Add database context with SQL Server connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT configuration for authentication
var jwtConfig = builder.Configuration.GetSection("JWT").Get<JwtConfig>();
builder.Services.AddSingleton(jwtConfig);
builder.Services.AddScoped<IJwtService, JwtService>();

// Add JWT Authentication middleware
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig.Issuer,
            ValidAudience = jwtConfig.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Secret)),
            RoleClaimType = ClaimTypes.Role
        };
    });

// Add authorization policies based on roles
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdminOnly", policy =>
        policy.RequireRole("SuperAdmin"));

    options.AddPolicy("AdminAndAbove", policy =>
        policy.RequireRole("Admin", "SuperAdmin"));

    options.AddPolicy("DriverOnly", policy =>
        policy.RequireRole("Driver"));

    options.AddPolicy("PassengerOnly", policy =>
        policy.RequireRole("Passenger"));

    options.AddPolicy("DriverAndAbove", policy =>
        policy.RequireRole("Driver", "Admin", "SuperAdmin"));

    options.AddPolicy("PassengerAndAbove", policy =>
        policy.RequireRole("Passenger", "Admin", "SuperAdmin"));

    options.AddPolicy("AllUsers", policy =>
        policy.RequireRole("SuperAdmin", "Admin", "Driver", "Passenger"));

    // Fallback policy to require authentication by default
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

// Add default identity configuration with roles
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    // Add optional password strength rules if needed
    // options.Password.RequireDigit = true;
    // options.Password.RequireLowercase = true;
    // options.Password.RequireUppercase = true;
    // options.Password.RequireNonAlphanumeric = true;
    // options.Password.RequiredLength = 6;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

// Create roles if they don't exist
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "SuperAdmin", "Admin", "Driver", "Passenger" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        // Uncomment below if you want to customize Swagger UI for different areas
        // c.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin API v1");
        // c.SwaggerEndpoint("/swagger/client/swagger.json", "Client API v1");

        // Set Swagger UI route to the root (http://localhost:5000/)
        // c.RoutePrefix = string.Empty;  
    });
}

// Use CORS policy (Make sure to call this before Authentication/Authorization)
app.UseCors("AllowReactApp");  // Apply the CORS policy for the React app

app.UseHttpsRedirection();

// Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map API controllers
app.MapControllers();

app.Run();
