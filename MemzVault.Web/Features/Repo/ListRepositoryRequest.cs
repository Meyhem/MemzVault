using MemzVault.Web.Features.Common;

namespace MemzVault.Web.Features.Repo
{
    public class ListRepositoryRequest: ApiPagedRequest
    {
        public string[] Tags { get; set; }
    }
}
