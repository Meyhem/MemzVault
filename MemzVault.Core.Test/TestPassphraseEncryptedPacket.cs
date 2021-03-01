using MemzVault.Core.Crypto;
using NUnit.Framework;
using System;

namespace MemzVault.Core.Test
{
    class TestPassphraseEncryptedPacket
    {
        [Test]
        public void TestInit()
        {
            var pak = new PassphraseEncryptedPacket(new byte[0], new byte[0]);

            Assert.IsEmpty(pak.CipherText);
            Assert.IsEmpty(pak.IV);
        }

        [Test]
        public void TestToBase64ConversionEmpty()
        {
            var pak = new PassphraseEncryptedPacket(new byte[0], new byte[0]);
            Assert.AreEqual(pak.ToString(), ".");
        }

        [Test]
        public void TestToBase64Conversion()
        {
            var buf = new byte[] { 1, 2, 3 };
            var base64buf = Convert.ToBase64String(buf);
            var pak = new PassphraseEncryptedPacket(buf, buf);

            Assert.AreEqual(pak.ToString(), $"{base64buf}.{base64buf}");
        }

        [Test]
        public void TestFromBase64Conversion()
        {
            var buf = new byte[] { 1, 2, 3 };
            var base64buf = Convert.ToBase64String(buf);
            var pak = PassphraseEncryptedPacket.FromString($"{base64buf}.{base64buf}");

            Assert.AreEqual(pak.IV, buf);
            Assert.AreEqual(pak.CipherText, buf);
        }
    }
}
