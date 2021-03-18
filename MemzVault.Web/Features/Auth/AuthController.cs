using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MemzVault.Core.Exceptions;
using MemzVault.Core.Extensions;
using MemzVault.Web.Features.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MemzVault.Web.Features.Auth
{
    [Route("api/auth")]
    public class AuthController : MemzController
    {
        private readonly JwtBearerOptions jwtOptions;

        public AuthController(IOptionsMonitor<JwtBearerOptions> jwtOptions)
        {
            this.jwtOptions = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme);
        }

        [HttpPost]
        [Route("token")]
        public async Task<IActionResult> CreateToken([FromBody] CreateTokenModel model)
        {
            if (!await Repository.RepositoryExists(model.Repository))
            {
                return BadRequest(
                    ApiResponse.FromMemzException(
                        new MemzException(
                            MemzErrorCode.RepositoryNotFound, 
                            $"Repository {model.Repository} not found"
                        )
                    )
                );
            }

            try
            {
                await Repository.GetRepositoryMasterKey(model.Repository, model.Passphrase);
            } 
            catch (MemzException ex) when (ex.ErrorCode == MemzErrorCode.IntegrityCheckFailed)
            {
                return BadRequest(ApiResponse.FromMemzException(new MemzException(MemzErrorCode.InvalidPassphrase, "Invalid repository passphrase")));
            }
            
            var jwt = new JwtSecurityTokenHandler();
            var key = Configuration.GetIssuerSigningKey();
            var serverKey = Configuration.GetServerKey();

            var encryptedPassphrase = CryptoService.PassphraseEncrypt(serverKey, Encoding.UTF8.GetBytes(model.Passphrase));

            var tok = jwt.CreateToken(new() 
            {
                Issuer = jwtOptions.TokenValidationParameters.ValidIssuer,
                Audience = jwtOptions.TokenValidationParameters.ValidAudience,
                Expires = DateTime.UtcNow.AddHours(1),
                Subject = new ClaimsIdentity(new Claim[] 
                { 
                    new(Const.RepositoryNameClaimType, model.Repository),
                    new(Const.EncryptedPassphraseClaimType, encryptedPassphrase.ToString()),
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            });

            var str = jwt.WriteToken(tok);

            return Ok(ApiResponse.FromData(str));
        }

        [HttpPost]
        [Route("test")]
        [Authorize]
        public IActionResult Validity()
        {
            var p = GetPassphrase();

            return Ok();
        }
    }
}
