﻿using System.Collections.Generic;
using System.Linq;

namespace MemzVault.Core.Extensions
{
    public static class IEnumerableExtensions
    {
        public static bool IsNullOrEmpty<T>(this IEnumerable<T> self)
        {
            return self == null || !self.Any();
        }
    }
}
