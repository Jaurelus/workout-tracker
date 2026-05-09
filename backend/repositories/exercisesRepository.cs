using Dapper;
using WorkoutTrackerAPI.models;
using System.Text.Json;
using Microsoft.VisualBasic;

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
        public async Task<bool> exerciseExists(string exerciseName)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(*)
                        FROM Exercises
                        WHERE eName = @name";
            var count = await connection.ExecuteScalarAsync<int>(sql, new
            {
                name = exerciseName
            });
            if (count == 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<int> getTotalExercisesForWorkout(int id)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(DISTINCT exerciseID) FROM WSets
                        WHERE workoutID = @WID
                        ";

            var count = await connection.ExecuteScalarAsync<int>(sql, new { WID = id });
            Console.WriteLine(count);
            return count;

        }
    }



}