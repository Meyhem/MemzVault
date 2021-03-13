using System;
using System.Collections.Generic;

namespace MemzVault.Web.Features.Common
{
    public static class MimeMappings
    {
        static Dictionary<string, string> map = new(StringComparer.OrdinalIgnoreCase)
        {
            { "image/bmp", ".bmp" },
            { "image/gif", ".gif" },
            { "image/x-icon", ".ico" },
            { "image/jpeg", ".jpg" },
            { "image/png", ".png" },
            { "image/svg+xml", ".svg" },
            { "image/webp", ".webp" },
            { "image/x-xbitmap", ".xbm" },
            { "image/x-xpixmap", ".xpm" },
            { "image/x-xwindowdump", ".xwd" },
            { "video/mp4", ".mp4" },
            { "video/mpeg", ".mpeg" },
            { "video/webm", ".webm" },
            { "video/x-ms-wmv", ".wmv" },
        };

        public static bool IsSupportedMime(string mime)
        {
            return map.ContainsKey(mime);
        }

        public static string MimeToFileExtension(string mime)
        {
            return map.GetValueOrDefault(mime);
        }
    }
}
