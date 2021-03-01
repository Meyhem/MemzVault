using MemzVault.Core.Crypto;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace MemzVault.Core.Test
{
    class TestCryptoService
    {
        CryptoService service;

        [SetUp]
        public void Setup()
        {
            service = new CryptoService();
        }

        [Test]
        public void TestEncryptionDescriptionCorrectness()
        {
            var buf = new byte[] { 1, 2, 3 };
            var pass = Encoding.UTF8.GetBytes("Sneed");
            var enc = service.PassphraseEncrypt(pass, buf);
            var dec = service.PassphraseDecrypt(pass, enc);
            
            Assert.AreEqual(buf, dec);
        }

        [Test]
        public void TestCreateEncryptStream()
        {
            var plain = Encoding.UTF8.GetBytes("Hello");
            var key = new byte[32];
            var iv = service.GenerateRandomBytes(CryptoService.IvSize);
            Array.Fill(key, (byte)0);

            var src = new MemoryStream(plain);
            MemoryStream dst = new MemoryStream();

            var encryption = service.CreateEncryptionStream(src, key, iv);
            encryption.CopyTo(dst);
            encryption.Close();

            var enc = dst.ToArray();

            src = new MemoryStream(enc);
            dst = new MemoryStream();

            var decryption = service.CreateDecryptionStream(src, key, iv);
            decryption.CopyTo(dst);
            decryption.Close();

            var dec = dst.ToArray();

            Assert.AreEqual(plain, dec);
        }
    }
}
