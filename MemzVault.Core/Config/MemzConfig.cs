using System.ComponentModel.DataAnnotations;

namespace MemzVault.Core.Config
{
    public record MemzConfig
    {
        [Required]
        public string StorageFolder { get; set; }

        [Required]
        public string AdminKey { get; set; }
    }
}
