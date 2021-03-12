using System.IO;
using System.Linq;
using MemzVault.Core.Storage;
using Microsoft.AspNetCore.Http;

namespace MemzVault.Web.Extensions
{
    public static class IFormFileExtensions
    {
        public static StoredItemMetadata ToStoredItemMetadata(this IFormFile self)
        {
            var filename = self.FileName ?? "";
            var sanitizedFname = Path.GetInvalidFileNameChars().Aggregate(filename, (current, c) => current.Replace(c, '-'));

            var parts = Path.GetFileNameWithoutExtension(filename).Split("-");

            return new(0x01, sanitizedFname, self.ContentType, sanitizedFname, parts, null);
        }
    }
}
