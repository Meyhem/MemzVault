using System.IO;
using System.Security.Cryptography;

namespace MemzVault.Core.Crypto
{
    public class CryptoService : ICryptoService
    {
        public const int KeySize = 256 / 8;
        public const int BlockSize = 128 / 8;
        public const int IvSize = BlockSize;

        public byte[] StretchKey(byte[] key, int length)
        {
            var pbkdf2 = new Rfc2898DeriveBytes(key, new byte[] { 0, 0, 0, 0, 0, 0, 0, 0 }, 1);
            return pbkdf2.GetBytes(length);
        }

        public byte[] GenerateRandomBytes(int length)
        {
            var buf = new byte[length];

            RandomNumberGenerator.Fill(buf);

            return buf;
        }

        public byte[] GenerateRandomIV()
        {
            return GenerateRandomBytes(IvSize);
        }

        public PassphraseEncryptedPacket PassphraseEncrypt(byte[] passphrase, byte[] plaintext)
        {
            var aes = CreateCipher(GenerateRandomBytes(IvSize), StretchKey(passphrase, KeySize));

            var transform = aes.CreateEncryptor();

            using var output = new MemoryStream();
            using var cs = new CryptoStream(output, transform, CryptoStreamMode.Write);

            cs.Write(plaintext);
            cs.Close();

            return new PassphraseEncryptedPacket(passphrase, aes.IV, output.ToArray());
        }

        public byte[] PassphraseDecrypt(byte[] passphrase, PassphraseEncryptedPacket pak)
        {
            var aes = CreateCipher(pak.IV, StretchKey(passphrase, KeySize));

            var transform = aes.CreateDecryptor();

            using var input = new MemoryStream(pak.CipherText);
            using var cs = new CryptoStream(input, transform, CryptoStreamMode.Read);

            var decr = new MemoryStream();
            cs.CopyTo(decr);
            cs.Close();

            return decr.ToArray();
        }

        public Stream CreateEncryptionStream(Stream src, byte[] key, byte[] iv)
        {
            key = StretchKey(key, KeySize);
            iv = StretchKey(iv, IvSize);

            var aes = CreateCipher(iv, key);

            var transform = aes.CreateEncryptor();
            return new CryptoStream(src, transform, CryptoStreamMode.Read);
        }

        public Stream CreateDecryptionStream(Stream src, byte[] key, byte[] iv)
        {
            key = StretchKey(key, KeySize);
            iv = StretchKey(iv, IvSize);

            var aes = CreateCipher(iv, key);

            var transform = aes.CreateDecryptor();
            return new CryptoStream(src, transform, CryptoStreamMode.Read);
        }

        private SymmetricAlgorithm CreateCipher(byte[] iv, byte[] key)
        {
            var aes = Aes.Create();

            aes.BlockSize = BlockSize * 8;
            aes.KeySize = KeySize * 8;
            aes.Mode = CipherMode.CBC;
            aes.IV = iv;
            aes.Key = key;

            return aes;
        }
    }
}
