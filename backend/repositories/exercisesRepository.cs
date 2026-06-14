using Dapper;
using WorkoutTrackerAPI.models;
using System.Text.Json;

namespace WorkoutTrackerAPI.repositories
{
    public class ExercisesRepository
    {
        private readonly DbConnectionFactory _db;

        public ExercisesRepository(DbConnectionFactory db)
        {
            _db = db;
        }

        public async Task addExercise(Exercises exercise, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"INSERT INTO Exercises (eName, primaryMuscle, secondaryMuscle, tips, userID)
                    VALUES (@Name, @Primary, @Secondary, @Tips, @UID)";
            await connection.ExecuteAsync(sql, new
            {
                Name = exercise.Name,
                Primary = JsonSerializer.Serialize(exercise.Primary),
                Secondary = JsonSerializer.Serialize(exercise.Secondary),
                Tips = JsonSerializer.Serialize(exercise.Tips),
                UID = userID
            });
        }

        // id == null or 0 returns all exercises for the user
        public async Task<IEnumerable<Exercises>> getExercises(int? id, int? userID)
        {
            using var connection = _db.CreateConnection();
            if (id != null && id != 0)
            {
                var row = await connection.QueryFirstOrDefaultAsync(
                    @"SELECT * FROM Exercises WHERE eID = @id AND userID = @UID",
                    new { id = id, UID = userID });
                return new List<Exercises>
                {
                    new Exercises
                    {
                        Id = row.eID,
                        Name = row.eName,
                        Primary = JsonSerializer.Deserialize<List<string>>(row.primaryMuscle),
                        Secondary = JsonSerializer.Deserialize<List<string>>(row.secondaryMuscle),
                        Tips = JsonSerializer.Deserialize<List<string>>(row.tips)
                    }
                };
            }
            else
            {
                var rows = await connection.QueryAsync(
                    "SELECT * FROM Exercises WHERE userID = @UID",
                    new { UID = userID });
                return rows.Select(row => new Exercises
                {
                    Id = row.eID,
                    Name = row.eName,
                    Primary = JsonSerializer.Deserialize<List<string>>(row.primaryMuscle),
                    Secondary = JsonSerializer.Deserialize<List<string>>(row.secondaryMuscle),
                    Tips = JsonSerializer.Deserialize<List<string>>(row.tips)
                });
            }
        }

        public async Task<IEnumerable<string>> getExerciseNames(int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT eName FROM Exercises WHERE userID = @UID";
            return await connection.QueryAsync<string>(sql, new { UID = userID });
        }

        public async Task<int> exerciseExists(string exerciseName, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT eID FROM Exercises WHERE eName = @name AND userID = @UID";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { name = exerciseName, UID = userID });
            return count >= 1 ? count : 0;
        }

        public async Task<int> getTotalExercisesForWorkout(int id, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(DISTINCT exerciseID) FROM WSets
                        WHERE workoutID = @WID AND userID = @UID";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { WID = id, UID = userID });
            return count;
        }

        public async Task<int> updateExercise(Exercises exercise, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"UPDATE Exercises
                         SET eName = @Name, primaryMuscle = @Primary, secondaryMuscle = @Secondary, tips = @Tips
                         WHERE eID = @EID AND userID = @UID";
            var row = await connection.ExecuteAsync(sql, new
            {
                EID = exercise.Id,
                Name = exercise.Name,
                Primary = JsonSerializer.Serialize(exercise.Primary),
                Secondary = JsonSerializer.Serialize(exercise.Secondary),
                Tips = JsonSerializer.Serialize(exercise.Tips),
                UID = userID
            });
            return row;
        }

        public async Task deleteExercise(int eid, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"DELETE FROM Exercises WHERE eID = @EID AND userID = @UID";
            await connection.ExecuteAsync(sql, new { EID = eid, UID = userID });
        }
    }
}
