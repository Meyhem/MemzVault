using System;

namespace MemzVault.Core.Exceptions
{
    public enum MemzErrorCode 
    {
        Unknown,

        // Repository Ops
        RepositoryAlreadyExists,
        RepositoryNotfound,
        MetadataNotFound,
        ItemNotFound,

        // Crypto Ops
        IntegrityCheckFailed
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
    }
}
