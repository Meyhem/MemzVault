using MemzVault.Core.Exceptions;

namespace MemzVault.Web.Features.Common
{
    public class ApiResponse<T>
    {
        public ApiResponse(T data, MemzException error)
        {
            Data = data;
            Error = error;
        }

        public T Data { get; private set; }
        public MemzException Error { get; private set; }
    }
}
