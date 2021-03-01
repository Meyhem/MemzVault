using System;
using System.Linq;
using System.Security.Cryptography;

namespace MemzVault.Core.Crypto
{
    public class PassphraseEncryptedPacket
    {
        public PassphraseEncryptedPacket(byte[] integrityKey, byte[] iv, byte[] ciphertext)
        {
            IV = iv;
            CipherText = ciphertext;

            var hmac = new HMACSHA512(integrityKey);
            Integrity = hmac.ComputeHash(IV.Concat(CipherText).ToArray());
        }

        public byte[] IV { get; private set; }
        public byte[] CipherText { get; set; }
        public byte[] Integrity { get; }

        public bool CheckIntegrity(byte[] integrityKey)
        {
            var hmac = new HMACSHA512(integrityKey);
            var computed = hmac.ComputeHash(IV.Concat(CipherText).ToArray());

            // TODO: Constant time compare
            return Integrity.SequenceEqual(computed);
        }

        public override string ToString()
        {
            return $"{Convert.ToBase64String(IV)}.{Convert.ToBase64String(CipherText)}";
        }

        public static PassphraseEncryptedPacket FromString(byte[] integrityKey, string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                throw new FormatException($"{nameof(PassphraseEncryptedPacket)}.{nameof(FromString)} is null or empty");
            }

            var parts = s.Split(".");
            if (parts.Length != 2)
            {
                throw new FormatException($"{nameof(PassphraseEncryptedPacket)}.{nameof(FromString)} is not in required format");
            }

            var iv = Convert.FromBase64String(parts[0]);
            var ciphertext = Convert.FromBase64String(parts[1]);

            return new PassphraseEncryptedPacket(integrityKey, iv, ciphertext);
        }
    }
}
