using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Notes.Identity.Models;

namespace Notes.Identity.Data
{
    public class AuthDbContext : IdentityDbContext<AppUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<AppUser>(entity => entity.ToTable(name: "AspNetUsers"));
            builder.Entity<IdentityRole>(e => e.ToTable(name: "Roles"));
            builder.Entity<IdentityUserRole<string>>(e => e.ToTable(name: "UserRoles"));
            builder.Entity<IdentityUserClaim<string>>(e => e.ToTable(name: "UserClaim"));
            builder.Entity<IdentityUserLogin<string>>(e => e.ToTable(name: "UserLogins"));
            builder.Entity<IdentityUserToken<string>>(e => e.ToTable(name: "UserTokens"));
            builder.Entity<IdentityRoleClaim<string>>(e => e.ToTable("RoleClaims"));

            builder.ApplyConfiguration(new AppUserConfiguration());
        }
    }
}
