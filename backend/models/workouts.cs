namespace WorkoutTrackerAPI.models
{
    public class Workouts
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Focus { get; set; } = String.Empty;
        public int userID { get; set; }
    }
}