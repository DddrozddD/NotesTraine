using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Notes.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Notes.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services,
            IConfiguration configuration)
        {
            var connctionString = configuration["DbConnection"];
            services.AddDbContext<NotesDbContext>(options =>
            {
                options.UseSqlite(connctionString);
            });
            services.AddScoped<INotesDbContext>(provider => 
            (INotesDbContext)provider.GetService<NotesDbContext>());
            return services;
        }
    }
}
