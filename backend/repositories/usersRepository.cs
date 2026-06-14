using Dapper;
using WorkoutTrackerAPI.models;
using BC = BCrypt.Net.BCrypt;


namespace WorkoutTrackerAPI.repositories
{

    public class UsersRepository
    {
        private readonly DbConnectionFactory _db;

        public UsersRepository(DbConnectionFactory db)
        {
            _db = db;
        }
        public async Task registerUser(User user)
        {
            using var connection = _db.CreateConnection();
            var sql = @"INSERT INTO Users (firstName, lastName, email, passHash)
                        VALUES (@F, @L, @E, @P )";
            await connection.ExecuteAsync(sql, new { F = user.firstName, L = user.lastName, E = user.email, P = BC.HashPassword(user.passHash) });
        }

        public async Task<User> getUser(string email)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Users
                        WHERE email=@Email";
            var row = await connection.QueryFirstOrDefaultAsync(sql, new { Email = email });
            if (row == null) return new User { };
            return new User
            {
                ID = row.uID,
                firstName = row.firstName,
                lastName = row.lastName,
                email = row.email,
                passHash = row.passHash
            };
        }
        public async Task<bool> loginUser(string email, string password)
        {
            var expectedUser = await getUser(email);
            if (expectedUser.email == "") return false;
            return BC.Verify(password, expectedUser.passHash);

        }

        public async Task logoutUser(string token)
        {
            using var connection = _db.CreateConnection();


            var sql = @"DELETE FROM Sessions
                        WHERE token=@T";

            await connection.ExecuteAsync(sql, new { T = token });

        }

        public async Task saveToken(Sessions session)
        {
            using var connection = _db.CreateConnection();
            var sql = @"INSERT INTO Sessions(token, userID)
                        VALUES (@TOKEN, @UID)";
            await connection.ExecuteAsync(sql, new { TOKEN = session.token, UID = session.userID });
        }
    }

}