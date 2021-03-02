namespace MemzVault.Web.Features.Auth
{
    public record CreateTokenModel
    {
        public string Repository { get; set; }

        public string Passphrase { get; set; }
    }
}
