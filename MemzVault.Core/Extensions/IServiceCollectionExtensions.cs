using MemzVault.Core.Config;
using MemzVault.Core.Crypto;
using MemzVault.Core.Storage;
using MemzVault.Web.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace MemzVault.Web.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddMemz(this IServiceCollection self)
        {
            self.AddTransient<IMemzConfigProvider, MemzConfigProvider>();
            self.AddTransient<IStorageDriver, FileSystemStorage>();
            self.AddTransient<ICryptoService, CryptoService>();
            self.AddTransient<IRepository, Repository>();

            return self;
        }
    }
}
