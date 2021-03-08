using System.Collections.Generic;

namespace MemzVault.Web.Features.Common
{
    public class PagedData<T>
    {
        public IEnumerable<T> Items { get; init; }
        public int TotalCount { get; init; }

        public PagedData(IEnumerable<T> items, int totalCount)
        {
            Items = items;
            TotalCount = totalCount;
        }
    }
}
