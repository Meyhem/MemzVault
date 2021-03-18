using System.ComponentModel.DataAnnotations;

namespace MemzVault.Web.Features.Repo 
{ 
    public class CreateRepositoryRequest
    {
        [Required]
        public string Repository { get; set; }

        [Required]
        public string Passphrase { get; set; }

        [Required]
        public string AdminKey { get; set; }
    }
}
