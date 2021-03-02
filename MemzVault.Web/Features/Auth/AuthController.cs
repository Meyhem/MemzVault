using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using MemzVault.Web.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace MemzVault.Web.Features.Auth
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IConfiguration config;
        private readonly JwtBearerOptions jwtOptions;

        public AuthController(IConfiguration config, IOptionsMonitor<JwtBearerOptions> jwtOptions)
        {
            this.config = config;
            this.jwtOptions = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme);
        }

        [Route("token")]
        public async Task CreateToken([FromBody] CreateTokenModel model)
        {
            var jwt = new JwtSecurityTokenHandler();
            var key = config.GetIssuerSigningKey();

            jwt.CreateToken(new() 
            {
                
            });

            await Task.CompletedTask;
        }
    }
}
