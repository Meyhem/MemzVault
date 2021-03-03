using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MemzVault.Web.Extensions;
using MemzVault.Core.Config;
using MemzVault.Core.Crypto;

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
                jwt.TokenValidationParameters ??= new();
                jwt.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(jwtSigningKey);
            });

            services.AddAuthorization();
            services.AddLogging();

            services.AddTransient<ICryptoService, CryptoService>();

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
