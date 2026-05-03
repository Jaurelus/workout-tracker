using MySql.Data.MySqlClient;
using System.Data;

namespace WorkoutTrackerAPI
{
    public class DbConnectionFactory
    {
        private readonly string _connectionString;

        public DbConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration
                .GetConnectionString("workoutDatabase")!;
        }

        public IDbConnection CreateConnection()
        {
            return new MySqlConnection(_connectionString);
        }
    }
}