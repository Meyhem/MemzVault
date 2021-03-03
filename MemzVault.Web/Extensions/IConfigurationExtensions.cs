using System;
using Microsoft.Extensions.Configuration;

namespace MemzVault.Web.Extensions
{
    public static class IConfigurationExtensions
    {
        const string IssuerSigningKeySelector = "Jwt:TokenValidationParameters:IssuerSigningKey";
        const string ServerKeySelector = "Memz:ServerKey";

        public static byte[] GetIssuerSigningKey(this IConfiguration self)
        {
            var key = self.GetValue<string>(IssuerSigningKeySelector);
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException($"Configuration doesn't contain required base64 value {IssuerSigningKeySelector}");
            }

            return Convert.FromBase64String(key);
        }

        public static byte[] GetServerKey(this IConfiguration self)
        {
            var key = self.GetValue<string>(ServerKeySelector);
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException($"Configuration doesn't contain required base64 value {ServerKeySelector}");
            }

            return Convert.FromBase64String(key);
        }
    }
}
