using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace MemzVault.Core.Storage
{
    public interface IStorageDriver
    {
        Task<string> CreateRepositoryAsync(string name);
        Task<byte[]> ReadRepositoryManifest(string name);
        Task<IEnumerable<string>> ListRepositoriesAsync();
        Task<byte[]> ReadMetadata(string repo, string item);
        Task WriteMetadata(string repo, string item, byte[] binaryMeta);
        Task WriteItem(string repo, string itemId, Stream encryptedStream);
        Task<Stream> ReadItem(string repo, string itemId);
        Task WriteRepositoryManifest(string repo, byte[] manifest);
        Task<bool> RepositoryExistsAsync(string repo);
    }
}
