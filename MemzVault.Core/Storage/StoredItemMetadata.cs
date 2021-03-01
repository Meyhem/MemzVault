namespace MemzVault.Core.Storage
{
    public record StoredItemMetadata(
        int MetaVersion, 
        string OriginalFilename,
        string MimeType,
        string Name,
        string[] Tags,
        string Base64IV
    );
}
