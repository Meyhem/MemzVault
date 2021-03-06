using System;
using System.Linq;
using System.Security.Cryptography;
using MemzVault.Core.Exceptions;

namespace MemzVault.Core.Crypto
{
    public class PassphraseEncryptedPacket
    {
        public PassphraseEncryptedPacket(byte[] integrityKey, byte[] iv, byte[] ciphertext)
        {
            IV = iv;
            CipherText = ciphertext;
            Integrity = CalculateIntegrity(integrityKey, iv, ciphertext);
        }

        public byte[] IV { get; private set; }
        public byte[] CipherText { get; set; }
        public byte[] Integrity { get; }

        public override string ToString()
        {
            return $"{Convert.ToBase64String(IV)}.{Convert.ToBase64String(CipherText)}.{Convert.ToBase64String(Integrity)}";
        }

        public static PassphraseEncryptedPacket FromString(byte[] integrityKey, string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                throw new FormatException($"{nameof(PassphraseEncryptedPacket)}.{nameof(FromString)} is null or empty");
            }

            var parts = s.Split(".");
            if (parts.Length != 3)
            {
                throw new FormatException($"{nameof(PassphraseEncryptedPacket)}.{nameof(FromString)} is not in required format");
            }

            var iv = Convert.FromBase64String(parts[0]);
            var ciphertext = Convert.FromBase64String(parts[1]);
            var storedIntegrity = Convert.FromBase64String(parts[2]);

            var calculatedIntegrity = CalculateIntegrity(integrityKey, iv, ciphertext);
            if (!storedIntegrity.SequenceEqual(calculatedIntegrity))
            {
                throw new MemzException(MemzErrorCode.IntegrityCheckFailed, "Integrity verification failed. Message is corrupted or tampered.");
            }

            return new PassphraseEncryptedPacket(integrityKey, iv, ciphertext);
        }

        private static byte[] CalculateIntegrity(byte[] integrityKey, byte[] iv, byte[] cipher)
        {
            var hmac = new HMACSHA512(integrityKey);
            return hmac.ComputeHash(iv.Concat(cipher).ToArray());
        }
    }
}
