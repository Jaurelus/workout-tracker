using Microsoft.AspNetCore.Mvc;
using WorkoutTrackerAPI;
using WorkoutTrackerAPI.models;
using WorkoutTrackerAPI.repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<ExercisesRepository>();
builder.Services.AddScoped<SetsRepository>();
builder.Services.AddScoped<WorkoutsRepository>();
builder.Services.AddScoped<UsersRepository>();

var app = builder.Build();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseMiddleware<MiddlewareRepository>();

app.UseHttpsRedirection();

// Exercise Routes
{
    app.MapPost("/addExercise", async (Exercises exercise, ExercisesRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.addExercise(exercise, userID);
        return Results.Created($"/exercises/{exercise.Id}", exercise);
    });
    app.MapGet("/getExercises", async (ExercisesRepository repo, int? id, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var exercises = await repo.getExercises(id, userID);
        return Results.Ok(exercises);
    });
    app.MapGet("/getExerciseNames", async (ExercisesRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var exercises = await repo.getExerciseNames(userID);
        return Results.Ok(exercises);
    });
    app.MapGet("/exerciseExists", async (ExercisesRepository repo, [FromQuery] string exerciseName, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var exists = await repo.exerciseExists(exerciseName, userID);
        return Results.Ok(exists);
    });
    app.MapGet("/getTotalExercises", async (ExercisesRepository repo, [FromQuery] int wID, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var total = await repo.getTotalExercisesForWorkout(wID, userID);
        return Results.Ok(total);
    });
    app.MapPut("/editExercise", async (ExercisesRepository repo, Exercises exercise, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.updateExercise(exercise, userID);
        return Results.Ok();
    });
    app.MapDelete("/deleteExercise", async (ExercisesRepository repo, [FromQuery] int eid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.deleteExercise(eid, userID);
        return Results.Ok();
    });
}

// Set Routes
{
    app.MapPost("/addSet", async (WSets set, SetsRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.addSet(set, userID);
        return Results.Created($"/sets/{set.Id}", set);
    });
    app.MapGet("/getSetByWID", async (SetsRepository repo, [FromQuery] int wid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var sets = await repo.getSetByWID(wid, userID);
        return Results.Ok(sets);
    });
    app.MapPut("/updateSet", async (WSets sets, [FromQuery] int? totalSets, SetsRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.updateSet(sets, totalSets, userID);
        return Results.Ok();
    });
    app.MapGet("/getTotalSets", async (SetsRepository repo, [FromQuery] int wID, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var total = await repo.getTotalSetsForWorkout(wID, userID);
        return Results.Ok(total);
    });
    app.MapDelete("/deleteSet", async (SetsRepository repo, [FromQuery] int sID, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.deleteSet(sID, userID);
        return Results.Ok();
    });
    app.MapPut("/editSet", async (SetsRepository repo, WSets set, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.updateSet(set, null, userID);
        return Results.Ok();
    });
    app.MapGet("/getTopSet", async (SetsRepository repo, [FromQuery] int wID, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var sets = await repo.getTopSet(wID, userID);
        Console.Write(sets);
        return Results.Ok(sets);
    });
    app.MapGet("/getTopVolumeSet", async (SetsRepository repo, [FromQuery] int wid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var set = await repo.getTopVolumeSet(wid, userID);
        return Results.Ok(set);
    });
}

// Workout Routes
{
    app.MapPost("/addWorkout", async (WorkoutsRepository repo, Workouts workout, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.addWorkout(workout, userID);
        return Results.Created($"workouts/{workout.Id}", workout);
    });
    app.MapGet("/getWorkouts", async (WorkoutsRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var workouts = await repo.getWorkouts(userID);
        return Results.Ok(workouts);
    });
    app.MapGet("/getOneWorkout", async (WorkoutsRepository repo, [FromQuery] int id, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var workout = await repo.getOneWorkout(id, userID);
        return Results.Ok(workout);
    });
    app.MapGet("/getLatestWorkout", async (WorkoutsRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var workout = await repo.getLatestWorkout(userID);
        return Results.Ok(workout);
    });
    app.MapGet("/getWorkoutsBetween", async (WorkoutsRepository repo, [FromQuery] string weekStart, [FromQuery] string weekEnd, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var workouts = await repo.getWeekWorkouts(weekStart, weekEnd, userID);
        return Results.Ok(workouts);
    });
    app.MapPut("/editWorkout", async (WorkoutsRepository repo, Workouts workout, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.editWorkout(workout, userID);
        return Results.Ok();
    });
    app.MapGet("/getTotalVolume", async (WorkoutsRepository repo, [FromQuery] int wid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var rows = await repo.getWorkoutVolume(wid, userID);
        return Results.Ok(rows);
    });
    app.MapGet("/getVolumeByExercise", async (WorkoutsRepository repo, [FromQuery] int wid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var rows = await repo.getWorkoutVolumebyExercise(wid, userID);
        return Results.Ok(rows);
    });
    app.MapGet("/getVolumesByFocus", async (WorkoutsRepository repo, [FromQuery] string? focus, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var volumes = await repo.getVolumesbyFocus(focus, userID);
        return Results.Ok(volumes);
    });
    app.MapGet("/getTopFoci", async (WorkoutsRepository repo, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var foci = await repo.getTopFoci(userID);
        return Results.Ok(foci);
    });
    app.MapGet("/getMonthWorkouts", async (WorkoutsRepository repo, [FromQuery] string monthBegin, [FromQuery] string monthEnd, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        var workouts = await repo.getMonthWorkouts(monthBegin, monthEnd, userID);
        return Results.Ok(workouts);
    });
    app.MapDelete("/deleteWorkout", async (WorkoutsRepository repo, [FromQuery] int wid, HttpContext context) =>
    {
        var userID = (int?)context.Items["userID"];
        await repo.deleteWorkout(wid, userID);
        return Results.Ok();
    });

    // User routes
    app.MapPost("/register", async (UsersRepository repo, User user) =>
    {
        await repo.registerUser(user);
        return Results.Created();
    });
    app.MapPost("/login", async (UsersRepository repo, HttpResponse response, LoginReq req) =>
    {
        var valid = await repo.loginUser(req.Email, req.PassHash);
        if (valid)
        {
            var token = Guid.NewGuid().ToString();
            response.Cookies.Append("session", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            var row = await repo.getUser(req.Email);
            await repo.saveToken(new Sessions { token = token, userID = row.ID });
            return Results.Ok(new { message = "Logged in" });
        }
        else return Results.Unauthorized();
    });
    app.MapPost("/logout", async (UsersRepository repo, HttpResponse response, HttpRequest req) =>
    {
        var cookie = req.Cookies["session"];
        await repo.logoutUser(cookie);
        response.Cookies.Delete("session");
        return Results.Ok();
    });
}

app.Run();

record LoginReq(string Email, string PassHash);
