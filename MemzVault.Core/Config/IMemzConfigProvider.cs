namespace MemzVault.Core.Config
{
    public interface IMemzConfigProvider
    {
        string GetAdminKey();
        string GetStorageFolder();
    }
}
