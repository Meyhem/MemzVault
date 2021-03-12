using System;
using System.Text.Json.Serialization;
using MemzVault.Core.Exceptions;

namespace MemzVault.Web.Features.Common
{
    public class MemzError
    {
        public string ErrorMessage { get; init; }
        public string GenericDescription { get; init; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public MemzErrorCode ErrorCode { get; init; }
        public string Stack { get; init; }

        public static MemzError FromMemzException(MemzException ex)
        {
            return new()
            {
                ErrorCode = ex.ErrorCode,
                ErrorMessage = ex.Message,
                Stack = ex.StackTrace,
                GenericDescription = ex.ErrorCode.ToString()
            };
        }

        public static MemzError FromException(Exception ex)
        {
            return new()
            {
                ErrorCode = MemzErrorCode.Unknown,
                ErrorMessage = ex.Message,
                Stack = ex.StackTrace,
                GenericDescription = MemzErrorCode.Unknown.ToString()
            };
        }
    }
}
