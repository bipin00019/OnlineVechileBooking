namespace SawariSewa.Areas.Admin.DTO
{
    public class ChangeUserRoleDto
    {
        public string TargetUserId { get; set; }
        public string NewRole { get; set; } // e.g. "Admin"
    }

}
