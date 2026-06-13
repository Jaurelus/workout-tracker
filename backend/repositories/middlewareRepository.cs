using Dapper;

namespace WorkoutTrackerAPI
{
    public class MiddlewareRepository

    {
        private readonly DbConnectionFactory _db;
        private readonly RequestDelegate _next;
        public MiddlewareRepository(DbConnectionFactory db, RequestDelegate next)
        {
            _next = next;
            _db = db;
        }
        public async Task InvokeAsync(HttpRequest req, HttpContext context)
        {

            using var connection = _db.CreateConnection();
            //Get user sent cookie
            var cookie = req.Cookies["session"];
            var sql = @"SELECT userID FROM Sessions
                        WHERE token =@C";
            var id = await connection.QueryFirstOrDefaultAsync<int?>(sql, new { C = cookie });
            var path = context.Request.Path.Value;
            if (path == "/login" || path == "/register")
            {
                await _next(context);
                return;
            }

            //Compare to store token
            if (id != null)
            {
                //User authenticated
                //pass next
                await _next(context);
            }
            else
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized: invalid or expired session");

                return;
            }
        }
    }
}