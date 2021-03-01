using System.IO;

namespace MemzVault.Core.Extensions
{
    public static class StreamExtensions
    {
        public static byte[] ReadExact(this Stream s, int length)
        {
            var buf = new byte[length];
            var read = s.Read(buf, 0, length);

            if (read != length)
            {
                throw new InvalidDataException($"Expected to read {length} bytes but got only {read}");
            }

            return buf;
        }

    }
}
