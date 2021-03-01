using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MemzVault.Core.Crypto;
using MemzVault.Core.Exceptions;

namespace MemzVault.Core.Storage
{
    public class Repository
    {
        const int RepositoryVersion = 0x0001;

        private readonly IStorageDriver driver;
        private readonly CryptoService crypto;

        public Repository(IStorageDriver driver, CryptoService crypto)
        {
            this.driver = driver;
            this.crypto = crypto;
        }

        public async Task CreateRepository(string repo, string passphrase)
        {
            var repoKey = crypto.GenerateRandomBytes(128);
            var repoKeyPacket = crypto.PassphraseEncrypt(Encoding.UTF8.GetBytes(passphrase), repoKey);

            RepositoryManifest manifest = new(RepositoryVersion, repoKeyPacket.ToString());

            await driver.CreateRepositoryAsync(repo);
            await SetRepositoryManifest(repo, manifest);
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

        public async Task SetItemMetadata(string repo, string itemId, string passphrase, StoredItemMetadata meta)
        {
            var rawJson = JsonSerializer.Serialize(meta, new() { WriteIndented = false });
            var binaryJson = Encoding.UTF8.GetBytes(rawJson);
            var metadataPacket = crypto.PassphraseEncrypt(Encoding.UTF8.GetBytes(passphrase), binaryJson);

            var serializedPacket = metadataPacket.ToString();
            var encryptedMetadata = Encoding.ASCII.GetBytes(serializedPacket);

            await driver.WriteMetadata(repo, itemId, encryptedMetadata);
        }

        public async Task<StoredItemMetadata> GetItemMetadata(string repo, string itemId, string passphrase)
        {
            var encryptedMetadata = await driver.ReadMetadata(repo, itemId);

            var serializedPacket = Encoding.ASCII.GetString(encryptedMetadata);
            var encodedPassphrase = Encoding.UTF8.GetBytes(passphrase);
            var packet = PassphraseEncryptedPacket.FromString(encodedPassphrase, serializedPacket);
            

            if (!packet.CheckIntegrity(encodedPassphrase))
            {
                throw new MemzException(MemzErrorCode.IntegrityCheckFailed, $"Integrity verification failed for metadata {itemId}");
            }

            var binaryMetadata = crypto.PassphraseDecrypt(encodedPassphrase, packet);
            var rawJson = Encoding.UTF8.GetString(binaryMetadata);

            return JsonSerializer.Deserialize<StoredItemMetadata>(rawJson);
        }

        public async Task StoreItem(string repo, string itemId, string passphrase, StoredItemMetadata meta, Stream dataStream)
        {
            var masterKey = await GetRepositoryMasterKey(repo, passphrase);

            var iv = crypto.GenerateRandomIV();
            meta = meta with { Base64IV = Convert.ToBase64String(iv) };

            var encryptedStream = crypto.CreateEncryptionStream(dataStream, masterKey, iv);

            await SetItemMetadata(repo, itemId, passphrase, meta);
            await driver.WriteItem(repo, itemId, encryptedStream);
        }

        public async Task<(Stream, StoredItemMetadata)> RetrieveItem(string repo, string itemId, string passphrase)
        {
            var masterKey = await GetRepositoryMasterKey(repo, passphrase);

            var meta = await GetItemMetadata(repo, itemId, passphrase);
            var encryptedStream = await driver.ReadItem(repo, itemId);
            var dataStream = crypto.CreateDecryptionStream(encryptedStream, masterKey, Convert.FromBase64String(meta.Base64IV));

            return (dataStream, meta);
        }

        private async Task<byte[]> GetRepositoryMasterKey(string repo, string passphrase)
        {
            var manifest = await GetRepositoryManifest(repo);
            var repositoryPassphrase = Encoding.UTF8.GetBytes(passphrase);
            var repositoryMasterKey = PassphraseEncryptedPacket.FromString(repositoryPassphrase, manifest.MasterKey);

            return crypto.PassphraseDecrypt(repositoryPassphrase, repositoryMasterKey);
        }
    }
}
