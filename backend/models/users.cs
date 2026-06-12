namespace WorkoutTrackerAPI
{
    public class User
    {
        public int ID { get; set; }
        public string firstName { get; set; } = String.Empty;
        public string lastName { get; set; } = String.Empty;
        public string email { get; set; } = String.Empty;
        public string passHash { get; set; } = String.Empty;
        public DateTime createdAt { get; set; }
    }
}