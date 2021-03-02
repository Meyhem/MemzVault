using System;
using Microsoft.Extensions.Configuration;

namespace MemzVault.Web.Extensions
{
    public static class IConfigurationExtensions
    {
        public static byte[] GetIssuerSigningKey(this IConfiguration self)
        {
            var key = self.GetValue<string>("Jwt:TokenValidationParameters:IssuerSigningKey");
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("Configuration doesn't contain required value Jwt:TokenValidationParameters:IssuerSigningKey");
            }

            return Convert.FromBase64String(key);
        }
    }
}
