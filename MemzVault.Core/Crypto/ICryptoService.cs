using System.IO;

namespace MemzVault.Core.Crypto
{
    public interface ICryptoService
    {
        Stream CreateDecryptionStream(Stream src, byte[] key, byte[] iv);
        Stream CreateEncryptionStream(Stream src, byte[] key, byte[] iv);
        byte[] GenerateRandomBytes(int length);
        byte[] GenerateRandomIV();
        byte[] PassphraseDecrypt(byte[] passphrase, PassphraseEncryptedPacket pak);
        PassphraseEncryptedPacket PassphraseEncrypt(byte[] passphrase, byte[] plaintext);
        byte[] StretchKey(byte[] key, int length);
    }
}
