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
        [AllowAnonymous]
        public async Task<IActionResult> CreateRepository([FromBody] CreateRepositoryRequest model)
        {
            await repo.CreateRepository(model.Repository, model.Passphrase);

            return StatusCode((int)HttpStatusCode.Created);
        }
    }
}
