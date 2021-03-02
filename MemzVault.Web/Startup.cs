using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using Microsoft.IdentityModel.Tokens;
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

            services.AddAuthentication(auth => 
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt =>
            {
                Config.GetSection("Jwt").Bind(jwt);
                jwt.TokenValidationParameters = jwt.TokenValidationParameters ?? new();
                jwt.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(jwtSigningKey);
            });

            services.AddAuthorization();
            services.AddLogging();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(e => e.MapControllers());
        }
    }
}
