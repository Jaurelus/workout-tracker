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
    public async Task addExercise(Exercises exercise)
        {
        Console.WriteLine($"Name: {exercise.Name}");
        Console.WriteLine($"Primary: {string.Join(", ", exercise.Primary)}");
        Console.WriteLine($"Secondary: {string.Join(", ", exercise.Secondary)}");
        Console.WriteLine($"Tips: {string.Join(", ", exercise.Tips)}");
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
                var row = await connection.QueryFirstOrDefaultAsync(@"SELECT * FROM Exercises WHERE eID = @id");
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
            else {var rows = await connection.QueryAsync("SELECT * FROM Exercises");

        return rows.Select(row => new Exercises
    {
        Id = row.eID,
        Name = row.eName,
        Primary = JsonSerializer.Deserialize<List<string>>(row.primaryMuscle),
        Secondary = JsonSerializer.Deserialize<List<string>>(row.secondaryMuscle),
        Tips = JsonSerializer.Deserialize<List<string>>(row.tips)
    });            }
                
        }
    
    public async Task<IEnumerable<string>> getExerciseNames()
        {
            //connect to db
            using var connection = _db.CreateConnection();
            //sql
            var sql =@"SELECT eName FROM Exercises";
            //execute
            return await connection.QueryAsync<string>(sql);
        }
}


}