using System.Security.Cryptography.X509Certificates;

namespace WorkoutTrackerAPI
{
    public class Sessions
    {
        public int userID { get; set; }
        public string token { get; set; } = "";
        public DateTime expiresAt { get; set; }
        public DateTime createdAt { get; set; }

    }
}