using System.Net;
using System.Threading.Tasks;
using MemzVault.Core.Storage;
using MemzVault.Web.Features.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MemzVault.Web.Features.Repo
{
    [Route("api/repository")]
    [Authorize]
    public class RepositoryController : MemzController
    {
        private readonly IRepository repo;

        public RepositoryController(IRepository repo)
        {
            this.repo = repo;
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> CreateRepository([FromBody] CreateRepositoryRequest model)
        {
            await repo.CreateRepository(model.Repository, model.Passphrase);

            return StatusCode((int)HttpStatusCode.Created);
        }

        [HttpGet]
        [Route("list")]
        public async Task<ApiResponse<PagedData<StoredItemInfo>>> ListRepository([FromQuery] ApiPagedRequest model)
        {
            await Task.Delay(1000);
            model.Normalize();
            var (items, total) = await repo.ListRepositoryAsync(GetRepository(), GetPassphrase(), model.Offset, model.Limit);

            return ApiResponse.FromData<PagedData<StoredItemInfo>>(new(items, total));
        }
    }
}
