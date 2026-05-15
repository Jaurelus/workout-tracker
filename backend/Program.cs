using System.Data;
using System.Data.Common;
using System.Numerics;
using Microsoft.AspNetCore.Mvc;
using WorkoutTrackerAPI;
using WorkoutTrackerAPI.models;
using WorkoutTrackerAPI.repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<ExercisesRepository>();
builder.Services.AddScoped<SetsRepository>();
builder.Services.AddScoped<WorkoutsRepository>();




var app = builder.Build();

app.UseCors("AllowReactApp");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

//API Routes
{   // Exercise Routes
    {
        app.MapPost("/addExercise", async (Exercises exercise, ExercisesRepository repo) =>
    {
        await repo.addExercise(exercise);
        return Results.Created($"/exercises/{exercise.Id}", exercise);
    });
        app.MapGet("/getExercises", async (ExercisesRepository repo, int? id) =>
        {

            var exercises = await repo.getExercises(id);
            return Results.Ok(exercises);
        });

        app.MapGet("/getExerciseNames", async (ExercisesRepository repo) =>
        {

            var exercises = await repo.getExerciseNames();
            return Results.Ok(exercises);
        });
        app.MapGet("/exerciseExists", async (ExercisesRepository repo, [FromQuery] string exerciseName) =>
        {
            var exists = await repo.exerciseExists(exerciseName);
            return Results.Ok(exists);
        });
        app.MapGet("/getTotalExercises", async (ExercisesRepository repo, [FromQuery] int wID) =>
        {
            var total = await repo.getTotalExercisesForWorkout(wID);
            return Results.Ok(total);
        });
        app.MapPut("/editExercise", async (ExercisesRepository repo, Exercises exercise) =>
        {
            await repo.updateExercise(exercise);
            return Results.Ok();
        });
        app.MapDelete("/deleteExercise", async (ExercisesRepository repo, [FromQuery] int eid) =>
        {
            await repo.deleteExercise(eid);
            return Results.Ok();
        });
    }
    // Set Routes
    {
        app.MapPost("/addSet", async (WSets set, SetsRepository repo) =>
    {
        await repo.addSet(set);
        return Results.Created($"/sets/{set.Id}", set);
    });
        app.MapGet("/getSetByWID", async (SetsRepository repo, [FromQuery] int wid) =>
        {
            var sets = await repo.getSetByWID(wid);
            return Results.Ok(sets);
        });

        app.MapPut("/updateSet", async (WSets sets, [FromQuery] int? totalSets, SetsRepository repo) =>
        {
            await repo.updateSet(sets, totalSets);
            return Results.Ok();
        });
        app.MapGet("/getTotalSets", async (SetsRepository repo, [FromQuery] int wID) =>
        {
            var total = await repo.getTotalSetsForWorkout(wID);
            return Results.Ok(total);
        });
        app.MapDelete("/deleteSet", async (SetsRepository repo, [FromQuery] int sID) =>
        {
            await repo.deleteSet(sID);
            return Results.Ok();
        });
        app.MapPut("/editSet", async (SetsRepository repo, WSets set) =>
        {
            await repo.updateSet(set, null);
            return Results.Ok();
        });
        app.MapGet("/getTopSet", async (SetsRepository repo, [FromQuery] int wID) =>
        {
            var sets = await repo.getTopSet(wID);
            return Results.Ok(sets);
        });
    }

    //Workout Routes
    {
        app.MapPost("/addWorkout", async (WorkoutsRepository repo, Workouts workout) =>
        {
            await repo.addWorkout(workout);
            return Results.Created($"workouts/{workout.Id}", workout);
        });

        app.MapGet("/getWorkouts", async (WorkoutsRepository repo) =>
        {
            var workouts = await repo.getWorkouts();
            return Results.Ok(workouts);
        });
        app.MapGet("/getOneWorkout", async (WorkoutsRepository repo, [FromQuery] int id) =>
        {
            var workout = await repo.getOneWorkout(id);
            return Results.Ok(workout);
        });
        app.MapGet("/getLatestWorkout", async (WorkoutsRepository repo) =>
        {
            var workout = await repo.getLatestWorkout();
            return Results.Ok(workout);
        });
        app.MapGet("/getWorkoutsBetween", async (WorkoutsRepository repo, [FromQuery] string weekStart, [FromQuery] string weekEnd) =>
        {
            var workouts = await repo.getWeekWorkouts(weekStart, weekEnd);
            return Results.Ok(workouts);
        });
        app.MapPut("/editWorkout", async (WorkoutsRepository repo, Workouts workout) =>
        {
            await repo.editWorkout(workout);
            return Results.Ok();
        });
        app.MapGet("/getTotalVolume", async (WorkoutsRepository repo, [FromQuery] int wid) =>
        {
            var rows = await repo.getWorkoutVolume(wid);
            return Results.Ok(rows);
        });
        app.MapGet("/getVolumeByExercise", async (WorkoutsRepository repo, [FromQuery] int wid) =>
        {
            var rows = await repo.getWorkoutVolumebyExercise(wid);
            return Results.Ok(rows);
        });
    }

}
app.Run();

