﻿using MemzVault.Core.Config;
using MemzVault.Core.Exceptions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MemzVault.Core.Storage
{
    public class FileSystemStorage : IStorageDriver
    {
        public const string RepositoryFileName = "repository.json";

        private readonly IMemzConfigProvider config;

        public FileSystemStorage(IMemzConfigProvider config)
        {
            this.config = config;
        }

        public async Task<IEnumerable<string>> ListRepositoriesAsync()
        {
            var store = config.GetStorageFolder();

            return await Task.FromResult(
                Directory.GetDirectories(store)
                    .Select(d => NormalizeRepositoryName(Path.GetFileName(d)))
            );
        }

        public async Task<string> CreateRepositoryAsync(string repo)
        {
            repo = NormalizeRepositoryName(repo);

            var repoPath = GetRepositoryPath(repo);

            if (Directory.Exists(repoPath))
            {
                throw new MemzException(MemzErrorCode.RepositoryAlreadyExists, $"Repository named '{repo}' already exists");
            }

            Directory.CreateDirectory(repoPath);

            return await Task.FromResult(repo);
        }

        public async Task<IEnumerable<string>> ListRepositoryItemIds(string repo)
        {
            await AssertRepositoryExists(repo);
            var repoPath = GetRepositoryPath(repo);

            return Directory.EnumerateFiles(repoPath)
                .Where(p => Path.GetExtension(p).Equals(".meta", StringComparison.InvariantCultureIgnoreCase))
                .Select(p => Path.GetFileNameWithoutExtension(p));
        }

        public async Task<byte[]> ReadRepositoryManifest(string repo)
        {
            repo = NormalizeRepositoryName(repo);
            await AssertRepositoryExists(repo);

            var manifestFname = GetRepositoryManifestPath(repo);
            using var manifest = File.Open(manifestFname, FileMode.Open, FileAccess.Read, FileShare.Read);
            using var reader = new StreamReader(manifest);
            
            return ReadAllBytes(manifestFname);
        }

        public async Task WriteRepositoryManifest(string repo, byte[] manifest)
        {
            repo = NormalizeRepositoryName(repo);
            await AssertRepositoryExists(repo);

            var manifestFname = GetRepositoryManifestPath(repo);

            await File.WriteAllBytesAsync(manifestFname, manifest);
        }

        public async Task WriteMetadata(string repo, string itemId, byte[] binaryMeta)
        {
            repo = NormalizeRepositoryName(repo);
            var metaPath = GetMetadataPath(repo, itemId);

            await File.WriteAllBytesAsync(metaPath, binaryMeta);
        }

        public async Task<byte[]> ReadMetadata(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            var metaPath = GetMetadataPath(repo, itemId);

            AssertMetadataExists(repo, itemId);

            return await Task.FromResult(ReadAllBytes(metaPath));
        }

        public async Task WriteItem(string repo, string itemId, Stream encryptedStream)
        {
            repo = NormalizeRepositoryName(repo);
            await AssertRepositoryExists(repo);

            var itemPath = GetItemPath(repo, itemId);

            using var f = File.Open(itemPath, FileMode.Create);

            await encryptedStream.CopyToAsync(f);
        }

        public async Task<Stream> ReadItem(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            AssertItemExists(repo, itemId);

            var itemPath = GetItemPath(repo, itemId);
            
            return await Task.FromResult(File.Open(itemPath, FileMode.Open, FileAccess.Read, FileShare.Read));
        }

        public async Task DeleteItem(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            AssertItemExists(repo, itemId);

            var itemPath = GetItemPath(repo, itemId);
            var metaPath = GetMetadataPath(repo, itemId);

            File.Delete(itemPath);
            File.Delete(metaPath);

            await Task.CompletedTask;
        }

        private byte[] ReadAllBytes(string file)
        {
            using var fileStream = File.Open(file, FileMode.Open, FileAccess.Read, FileShare.Read);
            var buf = new byte[fileStream.Length];
            fileStream.Read(buf);

            return buf;
        }

        private string GetItemPath(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            var repoPath = GetRepositoryPath(repo);

            return Path.Join(repoPath, $"{itemId}.file");
        }

        private string GetMetadataPath(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            var repoPath = GetRepositoryPath(repo);
            
            return Path.Join(repoPath, $"{itemId}.meta");
        }

        private string GetRepositoryManifestPath(string repo)
        {
            repo = NormalizeRepositoryName(repo);
            var repoPath = GetRepositoryPath(repo);
            return Path.Join(repoPath, RepositoryFileName);
        }

        private string GetRepositoryPath(string repo)
        {
            repo = NormalizeRepositoryName(repo);
            repo = NormalizeRepositoryName(repo);
            return Path.Join(config.GetStorageFolder(), repo);
        }

        private void AssertMetadataExists(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            var metaPath = GetMetadataPath(repo, itemId);

            if (!File.Exists(metaPath))
            {
                throw new MemzException(MemzErrorCode.MetadataNotFound, $"Metadata of item {itemId} does not exist");
            }
        }

        private void AssertItemExists(string repo, string itemId)
        {
            repo = NormalizeRepositoryName(repo);
            if (!File.Exists(GetItemPath(repo, itemId)))
            {
                throw new MemzException(MemzErrorCode.ItemNotFound, $"Item {itemId} does not exist in {repo}");
            }
        }

        private async Task AssertRepositoryExists(string repo)
        {
            repo = NormalizeRepositoryName(repo);
            if (!await RepositoryExistsAsync(repo))
            {
                throw new MemzException(MemzErrorCode.RepositoryNotFound, $"Repository {repo} does not exist");
            }
        }

        public async Task<bool> RepositoryExistsAsync(string repo)
        {
            repo = NormalizeRepositoryName(repo);
            var repoPath = GetRepositoryPath(repo);

            return await Task.FromResult(Directory.Exists(repoPath));
        }

        private string NormalizeRepositoryName(string r)
        {
            return r.Replace(' ', '-').ToLower();
        }
    }
}
