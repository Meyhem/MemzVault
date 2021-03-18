using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace MemzVault.Core.Storage
{
    public interface IRepository
    {
        Task CreateRepository(string repo, string passphrase, string adminKey);
        Task DeleteItem(string repo, string passphrase, string itemId);
        Task<StoredItemMetadata> GetItemMetadata(string repo, string passphrase, string itemId);
        Task<RepositoryManifest> GetRepositoryManifest(string repo);
        Task<byte[]> GetRepositoryMasterKey(string repo, string passphrase);
        Task<(IEnumerable<StoredItemInfo>, int)> ListRepositoryAsync(string repo, string passphrase, int offset, int limit, string[] tags, Func<StoredItemInfo, bool> predicate);
        Task<bool> RepositoryExists(string repo);
        Task<(Stream, StoredItemMetadata)> RetrieveItem(string repo, string passphrase, string itemId);
        Task SetItemMetadata(string repo, string passphrase, string itemId,  StoredItemMetadata meta);
        Task SetRepositoryManifest(string repo, RepositoryManifest manifest);
        Task StoreItem(string repo, string passphrase, string itemId,  StoredItemMetadata meta, Stream dataStream);
    }
}
