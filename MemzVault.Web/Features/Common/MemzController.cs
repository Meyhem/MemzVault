using System.Linq;
using System.Text;
using MemzVault.Core.Crypto;
using MemzVault.Core.Exceptions;
using MemzVault.Core.Storage;
using MemzVault.Web.Extensions;
using MemzVault.Web.Features.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MemzVault.Web.Features.Common
{
    public class MemzController: Controller
    {
        private T GetService<T>()
        {
            return HttpContext.RequestServices.GetService<T>();
        }

        public ICryptoService CryptoService => GetService<ICryptoService>();
        public IRepository Repository => GetService<IRepository>();
        public IConfiguration Configuration => GetService<IConfiguration>();


        protected string GetPassphrase()
        {
            var encpps = User.Claims.SingleOrDefault(c => c.Type == Const.EncryptedPassphraseClaimType);

            if (encpps == null || encpps.Value == null)
            {
                throw new MemzException(MemzErrorCode.InvalidPassphrase, $"Identity does not contain valid {Const.EncryptedPassphraseClaimType} claim");
            }

            var raw = encpps.Value;
            var serverKey = Configuration.GetServerKey();
            var passphrase = CryptoService.PassphraseDecrypt(serverKey, PassphraseEncryptedPacket.FromString(serverKey, raw));

            return Encoding.UTF8.GetString(passphrase);
        }
    }
}
