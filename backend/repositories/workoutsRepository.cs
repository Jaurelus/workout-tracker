using System.Data.Common;
using Dapper;
using Microsoft.VisualBasic;
using Mysqlx.Resultset;
using WorkoutTrackerAPI.models;

namespace WorkoutTrackerAPI
{
    public class WorkoutsRepository
    {
        private readonly DbConnectionFactory _db;
        public WorkoutsRepository(DbConnectionFactory db)
        {
            _db = db;
        }

        public async Task addWorkout(Workouts workout)
        {
            var connection = _db.CreateConnection();
            var sql = @"INSERT INTO Workouts (wDate, focus)
                        VALUES (@Date, @Focus)";
            await connection.ExecuteAsync(sql, new
            {
                Date = workout.Date,
                Focus = workout.Focus
            });
        }

        public async Task<IEnumerable<Workouts>> getWorkouts()
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Workouts
                        ORDER BY wDate DESC";
            var rows = await connection.QueryAsync(sql);
            return rows.Select((row) => new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            });
        }
        public async Task<Workouts?> getOneWorkout(int id)
        {
            var connection = _db.CreateConnection();
            var row = await connection.QueryFirstOrDefaultAsync("SELECT * FROM Workouts WHERE wID = @ID", new { ID = id });
            if (row == null) return null;
            return new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus,
            };

        }

        public async Task<Workouts> getLatestWorkout()
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Workouts
                    ORDER BY wID DESC 
                    LIMIT 1";
            var row = await connection.QueryFirstOrDefaultAsync(sql);
            Console.WriteLine(row + "\n\n\n");
            return new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            };


        }

        public async Task<IEnumerable<Workouts>> getWeekWorkouts(string weekStart, string weekEnd)
        {
            var connection = _db.CreateConnection();

            var sql = @"SELECT * FROM Workouts
                        WHERE wDate BETWEEN @WS and @WE";
            var rows = await connection.QueryAsync(sql, new
            {
                WS = weekStart,
                WE = weekEnd
            });
            return rows.Select((row) => new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            });
        }

        public async Task editWorkout(Workouts workout)
        {
            var connection = _db.CreateConnection();
            var sql = @"UPDATE Workouts
                        SET wDate = @DATE, focus =@FOCUS
                        WHERE wID = @WID";
            await connection.ExecuteAsync(sql, new { DATE = workout.Date, FOCUS = workout.Focus, WID = workout.Id });
        }
        public async Task<IEnumerable<dynamic>> getWorkoutVolumebyExercise(int wid)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT *, SUM(Weight*Reps) 
                      OVER (PARTITION BY exerciseID) AS setVolume
                     FROM WSets
                    WHERE workoutID = @WID";
            var rows = await connection.QueryAsync(sql, new { WID = wid });
            return rows.Select((row) => new
            {
                Id = row.sID,
                ExerciseID = row.exerciseID,
                reps = row.Reps,
                weight = row.Weight,
                wID = row.workoutID,
                exerciseVolume = row.setVolume,
            });
        }

        public async Task<int> getWorkoutVolume(int wid)
        {
            var connection = _db.CreateConnection();
            var sql = @"SELECT SUM(Weight*Reps) FROM WSets
                    WHERE workoutID = @WID";
            var res = await connection.ExecuteScalarAsync<int>(sql, new { wid = wid });
            return res;
        }
    }

}
