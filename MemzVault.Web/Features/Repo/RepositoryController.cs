using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using MemzVault.Core.Exceptions;
using MemzVault.Web.Features.Common;
using MemzVault.Core.Storage;
using MemzVault.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
            await repo.CreateRepository(model.Repository, model.Passphrase, model.AdminKey);

            return StatusCode((int)HttpStatusCode.Created);
        }

        [HttpGet]
        [Route("list")]
        public async Task<ApiResponse<PagedData<StoredItemInfo>>> ListRepository([FromQuery] ListRepositoryRequest model)
        {
            model.Normalize();

            var (items, total) = await repo.ListRepositoryAsync(GetRepository(),
                GetPassphrase(),
                model.Offset,
                model.Limit,
                model.Tags,
                null);

            return ApiResponse.FromData<PagedData<StoredItemInfo>>(new(items, total));
        }

        [HttpGet]
        [Route("items/{id}")]
        public async Task<IActionResult> GetItem([FromRoute] string id)
        {
            var (stream, meta) = await repo.RetrieveItem(GetRepository(), GetPassphrase(), id);

            return File(stream, meta.MimeType, false);
        }

        [HttpDelete]
        [Route("items/{id}")]
        public async Task<IActionResult> DeleteItem([FromRoute] string id)
        {
            await repo.DeleteItem(GetRepository(), GetPassphrase(), id);

            return Ok();
        }

        [HttpPost]
        [Route("items")]
        public async Task<IActionResult> CreateItem(IFormFile[] files)
        {
            if (files == null)
            {
                throw new MemzException(MemzErrorCode.UploadFailed, "No files to upload");
            }

            var ids = new List<string>();
            foreach (var file in files)
            {
                var id = Guid.NewGuid().ToString();
                ids.Add(id);

                await repo.StoreItem(
                    GetRepository(),
                    GetPassphrase(),
                    id,
                    file.ToStoredItemMetadata(),
                    file.OpenReadStream());
            }

            var (uploadedInfos, _) = await repo.ListRepositoryAsync(GetRepository(), GetPassphrase(), 0, int.MaxValue, null, info => ids.Contains(info.ItemId));

            return Ok(ApiResponse.FromData(uploadedInfos));
        }

        [HttpPost]
        [Route("items/remote-download")]
        public async Task<IActionResult> RemoteDownloadItem([FromBody] RemoteDownloadRequest model)
        {
            HttpClient client = new();
            client.DefaultRequestHeaders.UserAgent.Clear();
            client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");

            using var resp = await client.GetAsync(model.Url);
            if (!resp.IsSuccessStatusCode)
            {
                throw new MemzException(MemzErrorCode.DownloadFailed, $"Cannot download image [{resp.StatusCode}] {model.Url}");
            }

            var mime = resp.Content.Headers.ContentType.MediaType ?? string.Empty;

            if (!MimeMappings.IsSupportedMime(mime))
            {
                throw new MemzException(MemzErrorCode.InvalidFileType, $"Invalid file type {mime}");
            }

            var stream = await resp.Content.ReadAsStreamAsync();

            var id = Guid.NewGuid().ToString();

            var name = Path.ChangeExtension(id, MimeMappings.MimeToFileExtension(mime));
            var meta = new StoredItemMetadata(0x01, name, mime, name, Array.Empty<string>(), null);

            await repo.StoreItem(GetRepository(), GetPassphrase(), id, meta, stream);

            var (info, _) = (await repo.ListRepositoryAsync(GetRepository(), GetPassphrase(), 0, 1, null, inf => inf.ItemId == id));

            return Ok(ApiResponse.FromData(info.FirstOrDefault()));
        }


        [HttpPut]
        [Route("items/{id}/meta")]
        public async Task<IActionResult> UpdateMeta([FromRoute] string id, [FromBody] StoredItemInfo meta)
        {
            var stored = await repo.GetItemMetadata(GetRepository(), GetPassphrase(), id);

            stored = stored with { Tags = meta.Tags };
            await repo.SetItemMetadata(GetRepository(), GetPassphrase(), id, stored);

            return Ok();
        }
    }
}
