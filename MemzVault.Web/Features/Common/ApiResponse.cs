using MemzVault.Core.Exceptions;

namespace MemzVault.Web.Features.Common
{
    public class ApiResponse<T> where T: class
    {
        public ApiResponse(T data): this(data, null) { }

        public ApiResponse(MemzError err) : this(null, err) { }

        public ApiResponse(T data, MemzError error)
        {
            Data = data;
            Error = error;
        }

        public T Data { get; private set; }
        public MemzError Error { get; private set; }
    }

    public static class ApiResponse
    {
        public static ApiResponse<T> FromData<T>(T data) where T: class
        {
            return new(data);
        }

        public static ApiResponse<object> FromError(MemzError err)
        {
            return new(err);
        }

        public static ApiResponse<object> FromMemzException(MemzException ex)
        {
            return new(null, MemzError.FromMemzException(ex));
        }
    }
}
