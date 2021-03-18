using Microsoft.Extensions.Options;
using System;
using System.IO;

namespace MemzVault.Core.Config
{
    public class MemzConfigProvider : IMemzConfigProvider
    {
        private MemzConfig config;

        public MemzConfigProvider(IOptions<MemzConfig> memzConfig)
        {
            config = memzConfig.Value ?? throw new ArgumentNullException(nameof(memzConfig));
        }

        public string GetStorageFolder()
        {
            return Path.GetFullPath(config.StorageFolder);
        }

        public string GetAdminKey()
        {
            return config.AdminKey;
        }
    }
}
