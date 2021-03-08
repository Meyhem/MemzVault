namespace MemzVault.Core.Storage
{
    public record StoredItemInfo
    {
        public string ItemId { get; set; }
        public string OriginalFileName { get; set; }
        public string MimeType { get; set; }
        public string Name { get; set; }
        public string[] Tags { get; set; }
    }
}
