using Dapper;
using WorkoutTrackerAPI;
using System.Text.Json;

namespace WorkoutTrackerAPI.models
{
    public class SetsRepository{
    private  readonly DbConnectionFactory _db;
    public  SetsRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    //Task
    public async Task addSet(WSets set)
        {
            Console.Write(set);
            var connection = _db.CreateConnection();

            var sql = @"
            INSERT INTO WSets(exerciseID, Reps, Weight)
            SELECT eID, @Reps, @Weight
            FROM Exercises WHERE eName = @Name";

            await connection.ExecuteAsync(sql, new
         {
             Reps = set.reps,
             Weight = set.weight,
             Name = set.Exercises?.Name
         });
             
        }

    public async Task updateSet(WSets set)
        {
         var connection = _db.CreateConnection();
         //----- LOG 
//find rows with = wID, 
         var sql=@"" ;  
         //----- VIEW
        }
}
}