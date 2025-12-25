using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Notes.Application;
using Notes.Application.Common.Mappings;
using Notes.Application.Interfaces;
using Notes.Persistence;
using Notes.WebApi;
using Notes.WebApi.Middleware;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Notes.WebApi.Services;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAutoMapper(config =>
{
    config.AddProfile(new AssemblyMappingProfile(Assembly.GetExecutingAssembly()));
    config.AddProfile(new AssemblyMappingProfile(typeof(INotesDbContext).Assembly));
});

builder.Services.AddApplication();
builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowAnyOrigin();
    });

});

builder.Services.AddAuthentication(config =>
{
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "https://localhost:7057";
        options.Audience = "NotesWebAPI";
        options.RequireHttpsMetadata = false;
    });

builder.Services.AddVersionedApiExplorer(options =>
options.GroupNameFormat = "'v'VVV");
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>,
    ConfigureSwaggerOptions> ();
builder.Services.AddSwaggerGen();

builder.Services.AddApiVersioning();

builder.Services.AddSingleton<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpContextAccessor();
builder.Host.UseSerilog((context, config) =>
{
    config
        .WriteTo.Console() // Для примера добавим вывод в консоль
        .WriteTo.File("NotesWebAppLog-.txt", rollingInterval: RollingInterval.Day)
        .ReadFrom.Configuration(context.Configuration); // Позволяет читать настройки из appsettings.json
});
var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    try
    {
        var context = serviceProvider.GetRequiredService<NotesDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "An error occured while app initialization");
    }
}

app.UseSwagger();
app.UseSwaggerUI(config =>
{
    var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
    config.RoutePrefix = string.Empty;

    foreach (var description in provider.ApiVersionDescriptions)
    {
        config.SwaggerEndpoint(
            $"/swagger/{description.GroupName}/swagger.json",
            description.GroupName.ToUpperInvariant());
    }

    config.SwaggerEndpoint("/swagger/v1/swagger.json", "Notes API");
});
app.UseCustomExceptionHandler();
app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
app.UseApiVersioning();
app.MapControllers();

app.Run();