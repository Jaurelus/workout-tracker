using Dapper;
using WorkoutTrackerAPI.models;
using System.Text.Json;
using Mysqlx.Resultset;
using System.Data;
using System.Globalization;

namespace WorkoutTrackerAPI.repositories
{
    public class SetsRepository
    {
        private readonly DbConnectionFactory _db;
        public SetsRepository(DbConnectionFactory db)
        {
            _db = db;
        }

        //Task
        public async Task addSet(WSets set)
        {
            using var connection = _db.CreateConnection();

            var sql = @"
            INSERT INTO WSets(exerciseID, Reps, Weight, workoutID)
            SELECT eID, @Reps, @Weight, @WID
            FROM Exercises WHERE eName = @Name";

            await connection.ExecuteAsync(sql, new
            {
                Reps = set.reps,
                Weight = set.weight,
                Name = set.Exercises?.Name,
                WID = set.wID
            });

        }

        public async Task updateSet(WSets set, int? totalSets)
        {
            using var connection = _db.CreateConnection();

            if (totalSets != null)
            {
                var sql = @"UPDATE WSets 
                           SET exerciseID= @EID, Reps=@Reps, Weight=@Weight
                           ORDER BY sID DESC
                           LIMIT @N";
                await connection.ExecuteAsync(sql, new
                {
                    EID = set.Exercises.Id,
                    Reps = set.reps,
                    Weight = set.weight,
                    N = totalSets
                });

            }
            //----- VIEW
            //find rows with an = wID, sorted by ID; update
            if (totalSets == null)
            {
                var sql = @"UPDATE WSets
                            SET exerciseID= @EID, Reps=@Reps, Weight=@Weight
                            WHERE workoutID = @WID AND sID= @SID";


                await connection.ExecuteAsync(sql, new
                {
                    EID = set.Exercises.Id,
                    Reps = set.reps,
                    Weight = set.weight,
                    WID = set.wID,
                    SID = set.Id
                });
            }
        }





        public async Task<IEnumerable<WSets>> getSetByWID(int wid)

        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT w.sID, w.Reps, w.Weight, w.workoutID,
                        e.eID as exerciseID, e.eName, e.primaryMuscle, e.secondaryMuscle, e.tips
                        FROM WSets w
                       JOIN Exercises e ON w.exerciseID=e.eID
                        WHERE workoutID = @WID
                        ORDER BY exerciseID";
            var rows = await connection.QueryAsync(sql, new
            {
                WID = wid
            });
            return rows.Select((row) => new WSets
            {
                Id = row.sID,
                Exercises = new Exercises
                {
                    Id = row.exerciseID,
                    Name = row.eName,
                    Primary = JsonSerializer.Deserialize<List<string>>(row.primaryMuscle),
                    Secondary = JsonSerializer.Deserialize<List<string>>(row.secondaryMuscle),
                    Tips = JsonSerializer.Deserialize<List<string>>(row.tips)
                },
                reps = row.Reps,
                weight = row.Weight,
                wID = row.workoutID
            });
        }
        public async Task<int> getTotalSetsForWorkout(int wid)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(*) FROM WSets
                        WHERE workoutID = @WID";
            int count = await connection.ExecuteScalarAsync<int>(sql, new
            {
                WID = wid,
            });
            return count;


        }

        public async Task deleteSet(int sID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"DELETE FROM WSets
                        WHERE sID=@SID";
            await connection.ExecuteAsync(sql, new { SID = sID });

        }

        public async Task<IEnumerable<WSets>> getTopSet(int wID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"WITH SetRnks AS (
                        SELECT *, 
                        ROW_NUMBER() OVER(PARTITION BY exerciseID ORDER BY Weight DESC) AS row_num
                        FROM WSets
                        WHERE workoutID= @WID
                        ) 
                        SELECT * FROM SetRnks
                        JOIN Exercises
                        ON exerciseID= eID 
                        WHERE row_num=1";
            var rows = await connection.QueryAsync(sql, new { WID = wID });
            return rows.Select((row) => new WSets
            {
                Id = row.sID,
                Exercises = new Exercises { Id = row.exerciseID, Name = row.eName },
                reps = row.Reps,
                weight = row.Weight,
                wID = row.workoutID
            });
        }

        public async Task<IEnumerable<dynamic>> getTopVolumeSet(int wid)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT eName, 
                    Reps*Weight AS volume
                    FROM WSets 
                    JOIN Exercises 
                    ON exerciseID= eID
                    WHERE workoutID=@WID
                    ORDER BY volume DESC
                    LIMIT 1;";
            var row = await connection.QueryAsync(sql, new { WID = wid });
            return row.Select((row) => new
            {
                volume = row.volume,
                ExerciseName = row.eName,
            });
        }

    }


}