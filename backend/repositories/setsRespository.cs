using Dapper;
using WorkoutTrackerAPI;
using System.Text.Json;
using Mysqlx.Resultset;
using System.Data;
using System.Globalization;

namespace WorkoutTrackerAPI.models
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
            var connection = _db.CreateConnection();

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

        public async Task updateSet(List<WSets> set, int? totalSets)
        {
            var connection = _db.CreateConnection();
            //----- LOG 
            //find last n rows where n is length or rep count array
            //check that the new values aare diff from old then add
            if (totalSets != null)
            {
                var sqlSelect = @" SELECT * from WSets
                    ORDER BY sID DESC
                    LIMIT @N";

                var res = await connection.QueryAsync(sqlSelect, new
                {
                    N = totalSets,
                });
                //For each row get set ID, then update rows in sets with id
                int i = 0;
                foreach (var row in res)
                {
                    var sqlUpdate = @"UPDATE WSets
                                SET exerciseID = @ExerciseID, Reps = @Reps, Weight=@Weight
                                WHERE sID = @ID";

                    await connection.ExecuteAsync(sqlUpdate, new
                    {
                        ID = row.sID,
                        Weight = set[i].weight,
                        Reps = set[i].reps,
                        ExerciseID = set[i].Exercises?.Id
                    });
                    i++;
                }
            }
            //----- VIEW
            //find rows with an = wID, sorted by ID; update
            if (totalSets == null)
            {
                var sqlSelect1 = @"SELECT * FROM WSets
                            WHERE workoutID = @wID";
                var res = await connection.QueryAsync(sqlSelect1, new
                {
                    wID = set[0].wID
                });
                foreach (var row in res)
                {
                    //Update row where sID

                    var sqlResult1 = @"UPDATE WSets
                                SET exerciseID = @EID, Reps = @Reps, Weight= @Weight
                                WHERE sID EQUALS @SID";
                    await connection.ExecuteAsync(sqlResult1, new
                    {
                        EID = row.exerciseID,
                        Reps = row.Reps,
                        Weight = row.Weight,
                        SID = row.ID,

                    });
                }
            }



        }

        public async Task<IEnumerable<WSets>> getSetByWID(int wid)

        {
            var connection = _db.CreateConnection();
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
            var connection = _db.CreateConnection();
            var sql = @"SELECT COUNT(*) FROM WSets
                        WHERE workoutID = @WID";
            int count = await connection.ExecuteScalarAsync<int>(sql, new
            {
                WID = wid,
            });
            return count;


        }

    }


}