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
        public async Task InvokeAsync(HttpContext context)
        {
            string[] publicRoutes = { "/login", "/register", "/getExercises", "/exerciseExists" };
            using var connection = _db.CreateConnection();
            //Get user sent cookie
            var cookie = context.Request.Cookies["session"];
            var sql = @"SELECT userID FROM Sessions
                        WHERE token =@C";

            var path = context.Request.Path.Value;
            if (publicRoutes.Contains(path))
            {
                await _next(context);
                return;
            }

            var id = await connection.QueryFirstOrDefaultAsync<int?>(sql, new { C = cookie });


            //Compare to store token
            if (id != null)
            {
                //User authenticated
                //pass next
                context.Items["userID"] = id;

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