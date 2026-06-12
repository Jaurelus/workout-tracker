namespace WorkoutTrackerAPI.models
{
    public class WSets
    {
        public int Id { get; set; }
        public Exercises? Exercises { get; set; }
        public int reps { get; set; }
        public int weight { get; set; }

        public int wID { get; set; }
        public int userID { get; set; }


    }
}