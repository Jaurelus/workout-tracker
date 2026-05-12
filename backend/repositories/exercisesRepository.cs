using Dapper;
using WorkoutTrackerAPI.models;
using System.Text.Json;
using Microsoft.VisualBasic;
using Mysqlx.Resultset;

namespace WorkoutTrackerAPI.repositories
{
    public class ExercisesRepository
    {
        private readonly DbConnectionFactory _db;

        public ExercisesRepository(DbConnectionFactory db)
        {
            _db = db;
        }
        public async Task addExercise(Exercises exercise)
        {

            //Set db connection variable
            using var connection = _db.CreateConnection();

            //Set sql variable   
            var sql = @"INSERT INTO Exercises (eName, primaryMuscle, secondaryMuscle, tips)
                    VALUES (@Name, @Primary, @Secondary, @Tips )";
            //awaitvariable executing sql
            await connection.ExecuteAsync(sql, new
            {
                Name = exercise.Name,
                Primary = JsonSerializer.Serialize(exercise.Primary),
                Secondary = JsonSerializer.Serialize(exercise.Secondary),
                Tips = JsonSerializer.Serialize(exercise.Tips)
            });
        }
        public async Task<IEnumerable<Exercises>> getExercises(int? id)
        {
            using var connection = _db.CreateConnection();
            if (id != null)
            {
                var row = await connection.QueryFirstOrDefaultAsync(@"SELECT * FROM Exercises WHERE eID = @id", new { id = id });
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
                var rows = await connection.QueryAsync("SELECT * FROM Exercises");

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

        public async Task<IEnumerable<string>> getExerciseNames()
        {
            //connect to db
            using var connection = _db.CreateConnection();
            //sql
            var sql = @"SELECT eName FROM Exercises";
            //execute
            return await connection.QueryAsync<string>(sql);
        }
        public async Task<int> exerciseExists(string exerciseName)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT eID
                        FROM Exercises
                        WHERE eName = @name";
            var count = await connection.ExecuteScalarAsync<int>(sql, new
            {
                name = exerciseName
            });
            if (count >= 1)
            {
                return count;
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> getTotalExercisesForWorkout(int id)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(DISTINCT exerciseID) FROM WSets
                        WHERE workoutID = @WID
                        ";

            var count = await connection.ExecuteScalarAsync<int>(sql, new { WID = id });
            return count;

        }

        public async Task<int> updateExercise(Exercises exercise)
        {
            var connection = _db.CreateConnection();
            var sql = @"UPDATE Exercises
                         SET eName = @Name,primaryMuscle = @Primary,secondaryMuscle = @Secondary, tips = @Tips
                         WHERE eID = @EID";
            var row = await connection.ExecuteAsync(sql, new
            {
                EID = exercise.Id,
                Name = exercise.Name,
                Primary = JsonSerializer.Serialize(exercise.Primary),
                Secondary = JsonSerializer.Serialize(exercise.Secondary),
                Tips = JsonSerializer.Serialize(exercise.Tips)
            });
            return row;
        }

        public async Task deleteExercise(int eid)
        {
            var connection = _db.CreateConnection();
            var sql = @"DELETE FROM Exercises
                        where eID=@EID";
            await connection.ExecuteAsync(sql, new
            {
                EID = eid
            });
        }
    }



}