using Microsoft.Extensions.Options;
using MemzVault.Core.Config;
using MemzVault.Core.Storage;
using System;
using MemzVault.Core.Crypto;
using System.IO;

var cs = new CryptoService();
var k = Convert.ToBase64String(cs.GenerateRandomBytes(128));
var iv = Convert.ToBase64String(cs.GenerateRandomBytes(16));

var cfg = new OptionsWrapper<MemzConfig>(new MemzConfig("C:/dev/MemzVault/MemzVault.Playground/Storage", k));
var cp = new MemzConfigProvider(cfg);
var fss = new FileSystemStorage(cp);
var repo = new Repository(fss, cs);

StoredItemMetadata meta = new(0x0001, "pepe.jpeg", "image/jpeg", "Pepeee", new string[] { "pepe", "rekt" }, iv);
var id = Guid.NewGuid().ToString();
var passphrase = "heilung";

//await repo.CreateRepository("MyRepo", passphrase);

await repo.StoreItem("MyRepo", id, passphrase, meta, File.OpenRead("Z:/assasins-keks.jpg"));
var (dec, storedMeta) = await repo.RetrieveItem("MyRepo", id, passphrase);

var decFile = File.OpenWrite("C:/Users/meria/Pictures/assasins-keks.jpg");
await dec.CopyToAsync(decFile);


