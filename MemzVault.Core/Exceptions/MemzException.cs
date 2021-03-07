using System;

namespace MemzVault.Core.Exceptions
{
    public enum MemzErrorCode 
    {
        Unknown,

        // Repository Ops
        RepositoryAlreadyExists,
        RepositoryNotFound,
        MetadataNotFound,
        ItemNotFound,

        // Crypto Ops
        IntegrityCheckFailed,

        // Auth
        InvalidPassphrase
    }


    public class MemzException : Exception
    {
        public MemzException(MemzErrorCode code)
        {
            ErrorCode = code;
        }

        public MemzException(MemzErrorCode code, string message) : base(message)
        {
            ErrorCode = code;
        }

        public MemzException(MemzErrorCode code, string message, Exception innerException) : base(message, innerException)
        {
            ErrorCode = code;
        }

        public MemzErrorCode ErrorCode { get; set; } = MemzErrorCode.Unknown;

        public override string ToString()
        {
            return $"({ErrorCode}) {Message}";
        }

        public static MemzException FromException(Exception ex, MemzErrorCode code = MemzErrorCode.Unknown)
        {
            return new MemzException(code, ex.Message, ex);
        }
    }
}
