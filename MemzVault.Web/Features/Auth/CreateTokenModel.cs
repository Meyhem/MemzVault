using System.ComponentModel.DataAnnotations;

namespace MemzVault.Web.Features.Auth
{
    public record CreateTokenModel
    {
        [Required]
        public string Repository { get; set; }

        [Required]
        public string Passphrase { get; set; }
    }
}
