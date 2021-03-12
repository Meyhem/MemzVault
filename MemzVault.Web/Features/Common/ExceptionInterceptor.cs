using System;
using System.Net;
using MemzVault.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MemzVault.Web.Features.Common
{
    public class ExceptionInterceptor : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var ex = context.Exception;

            var res = new JsonResult(ex switch
            {
                MemzException memzException => ApiResponse.FromMemzException(memzException),
                Exception exception => ApiResponse.FromError(MemzError.FromException(exception))
            });

            res.StatusCode = (int)HttpStatusCode.InternalServerError;

            context.Result = res;
        }
    }
}
