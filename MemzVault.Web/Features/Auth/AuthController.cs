using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MemzVault.Core.Crypto;
using MemzVault.Web.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace MemzVault.Web.Features.Auth
{
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IConfiguration config;
        private readonly ICryptoService cryptoService;
        private readonly JwtBearerOptions jwtOptions;

        public AuthController(
            IConfiguration config, 
            IOptionsMonitor<JwtBearerOptions> jwtOptions, 
            ICryptoService cryptoService)
        {
            this.config = config;
            this.cryptoService = cryptoService;
            this.jwtOptions = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme);
        }

        [Route("token")]
        public async Task CreateToken([FromBody] CreateTokenModel model)
        {
            var jwt = new JwtSecurityTokenHandler();
            var key = config.GetIssuerSigningKey();
            var serverKey = config.GetServerKey();


            var encryptedPassphrase = cryptoService.PassphraseEncrypt(serverKey, Encoding.UTF8.GetBytes(model.Passphrase));


            jwt.CreateToken(new() 
            {
                Issuer = jwtOptions.Authority,
                Audience = jwtOptions.Audience,
                Expires = DateTime.UtcNow.AddHours(1),
                Subject = new ClaimsIdentity(new Claim[] { new("encryptedPassphrase", encryptedPassphrase.ToString()) })
            });

            await Task.CompletedTask;
        }
    }
}
