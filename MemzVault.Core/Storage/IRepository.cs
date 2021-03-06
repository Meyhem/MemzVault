using System.IO;
using System.Threading.Tasks;

namespace MemzVault.Core.Storage
{
    public interface IRepository
    {
        Task CreateRepository(string repo, string passphrase);
        Task<StoredItemMetadata> GetItemMetadata(string repo, string itemId, string passphrase);
        Task<RepositoryManifest> GetRepositoryManifest(string repo);
        Task<byte[]> GetRepositoryMasterKey(string repo, string passphrase);
        Task<bool> RepositoryExists(string repo);
        Task<(Stream, StoredItemMetadata)> RetrieveItem(string repo, string itemId, string passphrase);
        Task SetItemMetadata(string repo, string itemId, string passphrase, StoredItemMetadata meta);
        Task SetRepositoryManifest(string repo, RepositoryManifest manifest);
        Task StoreItem(string repo, string itemId, string passphrase, StoredItemMetadata meta, Stream dataStream);
    }
}