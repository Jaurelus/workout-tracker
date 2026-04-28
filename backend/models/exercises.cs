namespace WorkoutTrackerAPI.models{

public class Exercises
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public List<string> Primary {get;set;} = new List<string>();    
    public List<string> Secondary {get;set;} = new List<string>();
    public List<string> Tips {get;set;} = new List<string>();

}
}