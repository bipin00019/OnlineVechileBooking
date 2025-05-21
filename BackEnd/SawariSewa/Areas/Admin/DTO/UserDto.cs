namespace SawariSewa.Areas.Admin.DTO
{
    public class UserDto
    {
        public string Id { get; set; } // UserId
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Roles { get; set; } // New
    }

}
