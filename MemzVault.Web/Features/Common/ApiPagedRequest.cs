namespace MemzVault.Web.Features.Common
{
    public class ApiPagedRequest
    {
        const int DefaultLimit = 20;

        public int Limit { get; set; }

        public int Offset { get; set; }

        public void Normalize()
        {
            if (Limit < 1) Limit = DefaultLimit;
            if (Limit > 100) Limit = 100;

            if (Offset < 0) Offset = 0;
        }
    }
}
