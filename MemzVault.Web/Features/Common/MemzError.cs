using System;
using System.Linq;
using System.Text.Json.Serialization;
using MemzVault.Core.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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

        public static MemzError FromModelState(ModelStateDictionary ms)
        {
            return new()
            {
                ErrorCode = MemzErrorCode.InvalidFields,
                ErrorMessage = string.Join(", ", ms.Values
                    .SelectMany(state => state.Errors)
                    .Select(error => error.ErrorMessage)),
                GenericDescription = "Some fields are invalid",
                Stack = null
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
