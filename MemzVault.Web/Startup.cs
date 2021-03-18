using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MemzVault.Core.Extensions;
using MemzVault.Core.Config;
using Microsoft.AspNetCore.Http.Features;
using MemzVault.Web.Features.Common;
using MemzVault.Web.Extensions;

namespace MemzVault.Web
{
    public class Startup
    {
        public IConfiguration Config { get; }

        public Startup(IConfiguration config)
        {
            Config = config;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var jwtSigningKey = Config.GetIssuerSigningKey();

            services.Configure<MemzConfig>(Config.GetSection("Memz"));
            
            services.AddAuthentication(auth => 
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt =>
            {
                Config.GetSection("Jwt").Bind(jwt);
                jwt.IncludeErrorDetails = true;
                jwt.TokenValidationParameters ??= new();
                jwt.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(jwtSigningKey);
            });

            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = int.MaxValue; // if don't set default value is: 128 MB
                options.MultipartHeadersLengthLimit = int.MaxValue;
            });

            services.AddAuthorization();
            services.AddLogging();

            services.AddMemz();
            services.AddControllers(c => c.Filters.Add(new ExceptionInterceptor()));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors(c => c.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(e => e.MapDefaultControllerRoute());
        }
    }
}
