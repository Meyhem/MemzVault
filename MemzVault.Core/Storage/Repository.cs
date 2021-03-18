using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MemzVault.Core.Config;
using MemzVault.Core.Crypto;
using MemzVault.Core.Exceptions;
using MemzVault.Core.Extensions;
using MemzVault.Core.Storage;

namespace MemzVault.Web.Storage
{
    public class Repository : IRepository
    {
        const int RepositoryVersion = 0x0001;

        private readonly IStorageDriver driver;
        private readonly ICryptoService crypto;
        private readonly IMemzConfigProvider configProvider;

        public Repository(IStorageDriver driver, ICryptoService crypto, IMemzConfigProvider configProvider)
        {
            this.driver = driver;
            this.crypto = crypto;
            this.configProvider = configProvider;
        }

        public async Task CreateRepository(string repo, string passphrase, string adminKey)
        {
            if (!configProvider.GetAdminKey().Equals(adminKey))
            {
                throw new MemzException(MemzErrorCode.InvalidAdminKey, "Invalid admin key");
            }

            var repoKey = crypto.GenerateRandomBytes(128);
            var repoKeyPacket = crypto.PassphraseEncrypt(Encoding.UTF8.GetBytes(passphrase), repoKey);

            RepositoryManifest manifest = new(RepositoryVersion, repoKeyPacket.ToString());

            await driver.CreateRepositoryAsync(repo);
            await SetRepositoryManifest(repo, manifest);
        }

        public async Task<(IEnumerable<StoredItemInfo>, int)> ListRepositoryAsync(string repo,
            string passphrase,
            int offset,
            int limit,
            string[] tags,
            Func<StoredItemInfo, bool> predicate)
        {
            var ids = await driver.ListRepositoryItemIds(repo);
            List<StoredItemInfo> items = new();

            foreach (var id in ids)
            {
                var meta = await GetItemMetadata(repo, passphrase, id);
                var tagMatchScore = 1;
                if (!tags.IsNullOrEmpty())
                {
                    var storedTags = meta.Tags ?? Array.Empty<string>();

                    tagMatchScore = storedTags.Intersect(tags, StringComparer.InvariantCultureIgnoreCase).Count();
                }

                if (tagMatchScore == 0) continue;

                var info = new StoredItemInfo
                {
                    ItemId = id,
                    MimeType = meta.MimeType,
                    Name = meta.Name,
                    OriginalFileName = meta.OriginalFilename,
                    Tags = meta.Tags,
                    TagMatchScore = tagMatchScore
                };

                if (predicate != null && !predicate(info)) continue;

                items.Add(info);
            }
            items = items.OrderByDescending(i => i.TagMatchScore).ToList();
            var ret = items.Skip(offset).Take(limit);

            return (ret, items.Count);
        }

        public async Task<bool> RepositoryExists(string repo)
        {
            return await driver.RepositoryExistsAsync(repo);
        }

        public async Task<RepositoryManifest> GetRepositoryManifest(string repo)
        {
            var encoded = await driver.ReadRepositoryManifest(repo);
            var rawJson = Encoding.UTF8.GetString(encoded);

            return JsonSerializer.Deserialize<RepositoryManifest>(rawJson);
        }

        public async Task SetRepositoryManifest(string repo, RepositoryManifest manifest)
        {
            var rawJson = JsonSerializer.Serialize(manifest, new() { WriteIndented = false });
            var encoded = Encoding.UTF8.GetBytes(rawJson);

            await driver.WriteRepositoryManifest(repo, encoded);
        }

        public async Task SetItemMetadata(string repo, string passphrase, string itemId,  StoredItemMetadata meta)
        {
            var rawJson = JsonSerializer.Serialize(meta, new() { WriteIndented = false });
            var binaryJson = Encoding.UTF8.GetBytes(rawJson);
            var metadataPacket = crypto.PassphraseEncrypt(Encoding.UTF8.GetBytes(passphrase), binaryJson);

            var serializedPacket = metadataPacket.ToString();
            var encryptedMetadata = Encoding.ASCII.GetBytes(serializedPacket);

            await driver.WriteMetadata(repo, itemId, encryptedMetadata);
        }

        public async Task<StoredItemMetadata> GetItemMetadata(string repo, string passphrase, string itemId)
        {
            var encryptedMetadata = await driver.ReadMetadata(repo, itemId);

            var serializedPacket = Encoding.ASCII.GetString(encryptedMetadata);
            var encodedPassphrase = Encoding.UTF8.GetBytes(passphrase);
            var packet = PassphraseEncryptedPacket.FromString(encodedPassphrase, serializedPacket);

            var binaryMetadata = crypto.PassphraseDecrypt(encodedPassphrase, packet);
            var rawJson = Encoding.UTF8.GetString(binaryMetadata);

            return JsonSerializer.Deserialize<StoredItemMetadata>(rawJson);
        }

        public async Task StoreItem(string repo, string passphrase, string itemId, StoredItemMetadata meta, Stream dataStream)
        {
            var masterKey = await GetRepositoryMasterKey(repo, passphrase);

            var iv = crypto.GenerateRandomIV();
            meta = meta with { Base64IV = Convert.ToBase64String(iv) };

            var encryptedStream = crypto.CreateEncryptionStream(dataStream, masterKey, iv);

            await SetItemMetadata(repo, passphrase, itemId, meta);
            await driver.WriteItem(repo, itemId, encryptedStream);
        }

        public async Task<(Stream, StoredItemMetadata)> RetrieveItem(string repo, string passphrase, string itemId)
        {
            var masterKey = await GetRepositoryMasterKey(repo, passphrase);

            var meta = await GetItemMetadata(repo, passphrase, itemId);
            var encryptedStream = await driver.ReadItem(repo, itemId);
            var dataStream = crypto.CreateDecryptionStream(encryptedStream, masterKey, Convert.FromBase64String(meta.Base64IV));

            return (dataStream, meta);
        }

        public async Task DeleteItem(string repo, string passphrase, string itemId)
        {
            await GetRepositoryMasterKey(repo, passphrase);

            await driver.DeleteItem(repo, itemId);
        }

        public async Task<byte[]> GetRepositoryMasterKey(string repo, string passphrase)
        {
            var manifest = await GetRepositoryManifest(repo);
            var repositoryPassphrase = Encoding.UTF8.GetBytes(passphrase);
            var repositoryMasterKey = PassphraseEncryptedPacket.FromString(repositoryPassphrase, manifest.MasterKey);

            return crypto.PassphraseDecrypt(repositoryPassphrase, repositoryMasterKey);
        }
    }
}
