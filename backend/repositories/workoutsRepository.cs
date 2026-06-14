using Dapper;
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

        public async Task addWorkout(Workouts workout, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"INSERT INTO Workouts (wDate, focus, userID)
                        VALUES (@Date, @Focus, @UID)";
            await connection.ExecuteAsync(sql, new
            {
                Date = workout.Date,
                Focus = workout.Focus,
                UID = userID
            });
        }

        public async Task<IEnumerable<Workouts>> getWorkouts(int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Workouts WHERE userID = @UID ORDER BY wDate DESC";
            var rows = await connection.QueryAsync(sql, new { UID = userID });
            return rows.Select((row) => new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            });
        }

        public async Task<Workouts?> getOneWorkout(int id, int? userID)
        {
            using var connection = _db.CreateConnection();
            var row = await connection.QueryFirstOrDefaultAsync(
                "SELECT * FROM Workouts WHERE wID = @ID AND userID = @UID",
                new { ID = id, UID = userID });
            if (row == null) return null;
            return new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus,
            };
        }

        public async Task<Workouts> getLatestWorkout(int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Workouts WHERE userID = @UID ORDER BY wID DESC LIMIT 1";
            var row = await connection.QueryFirstOrDefaultAsync(sql, new { UID = userID });
            Console.WriteLine(row + "\n\n\n");
            return new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            };
        }

        public async Task<IEnumerable<Workouts>> getWeekWorkouts(string weekStart, string weekEnd, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT * FROM Workouts
                        WHERE wDate BETWEEN @WS AND @WE AND userID = @UID";
            var rows = await connection.QueryAsync(sql, new { WS = weekStart, WE = weekEnd, UID = userID });
            return rows.GroupBy(row => row.wDate).Select(group => group.First()).Select((row) => new Workouts
            {
                Id = row.wID,
                Date = row.wDate,
                Focus = row.focus
            });
        }

        public async Task editWorkout(Workouts workout, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"UPDATE Workouts
                        SET wDate = @DATE, focus = @FOCUS
                        WHERE wID = @WID AND userID = @UID";
            await connection.ExecuteAsync(sql, new { DATE = workout.Date, FOCUS = workout.Focus, WID = workout.Id, UID = userID });
        }

        public async Task<IEnumerable<dynamic>> getWorkoutVolumebyExercise(int wid, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"WITH eVol AS(
                        SELECT *, SUM(Weight*Reps)
                        OVER (PARTITION BY exerciseID) AS setVolume
                        FROM WSets
                        WHERE workoutID = @WID AND userID = @UID)
                        SELECT DISTINCT exerciseID, setVolume, eName FROM eVol
                        JOIN Exercises ON exerciseID = eID";
            var rows = await connection.QueryAsync(sql, new { WID = wid, UID = userID });
            return rows.Select((row) => new
            {
                Id = row.exerciseID,
                exerciseName = row.eName,
                exerciseVolume = row.setVolume
            });
        }

        public async Task<int> getWorkoutVolume(int wid, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT SUM(Weight*Reps) FROM WSets WHERE workoutID = @WID AND userID = @UID";
            var res = await connection.ExecuteScalarAsync<int>(sql, new { WID = wid, UID = userID });
            return res;
        }

        public async Task<IEnumerable<dynamic>> getVolumesbyFocus(string? focus, int? userID)
        {
            using var connection = _db.CreateConnection();
            if (focus == null)
            {
                var sql = @"WITH mostFrq AS(
                            SELECT focus
                            FROM Workouts
                            WHERE userID = @UID
                            GROUP BY focus
                            ORDER BY Count(*) DESC
                            LIMIT 1)
                            SELECT w.focus, SUM(Weight*Reps) AS totals, w.wDate
                            FROM mostFRQ m
                            JOIN Workouts w ON m.focus = w.focus
                            JOIN WSets ON workoutID = w.wID
                            WHERE w.userID = @UID
                            GROUP BY wDate, w.focus";
                var rows = await connection.QueryAsync(sql, new { UID = userID });
                return rows.Select((row) => new
                {
                    Date = row.wDate.ToString("yyyy-MM-dd"),
                    Volume = row.totals,
                    Focus = row.focus
                });
            }
            else
            {
                var sql = @"SELECT SUM(Weight*Reps) AS totals, wDate
                            FROM Workouts
                            JOIN WSets ON workoutID = wID
                            WHERE focus = @FOCUS AND Workouts.userID = @UID
                            GROUP BY wDate";
                var rows = await connection.QueryAsync(sql, new { FOCUS = focus, UID = userID });
                return rows.Select((row) => new
                {
                    date = row.wDate.ToString("yyyy-MM-dd"),
                    volume = row.totals
                });
            }
        }

        public async Task<IEnumerable<string>> getTopFoci(int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT focus FROM Workouts
                        WHERE userID = @UID
                        GROUP BY focus
                        ORDER BY Count(*) DESC
                        LIMIT 5";
            return await connection.QueryAsync<string>(sql, new { UID = userID });
        }

        public async Task<IEnumerable<string>> getMonthWorkouts(string monthStart, string monthEnd, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"SELECT wDate FROM Workouts
                        WHERE wDate >= @BEGIN AND wDate < @END AND userID = @UID";
            return await connection.QueryAsync<string>(sql, new { BEGIN = monthStart, END = monthEnd, UID = userID });
        }

        public async Task deleteWorkout(int wid, int? userID)
        {
            using var connection = _db.CreateConnection();
            var sql = @"DELETE FROM Workouts WHERE wID = @WID AND userID = @UID";
            await connection.ExecuteAsync(sql, new { WID = wid, UID = userID });
        }
    }
}
