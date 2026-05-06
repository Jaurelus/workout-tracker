using System.Data.Common;
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



var app = builder.Build();

app.UseCors("AllowReactApp");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

//API Routes
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

    app.MapPost("/addSet", async (WSets set, SetsRepository repo) =>
    {
        await repo.addSet(set);
        return Results.Created($"/sets/{set.Id}", set);
    });

    app.MapPut("/updateSet", async (List<WSets> sets, [FromQuery] int? totalSets, SetsRepository repo) =>
    {
        await repo.updateSet(sets, totalSets);
        return Results.NoContent();
    });

    app.MapGet("/exerciseExists", async (ExercisesRepository repo, [FromQuery] string exerciseName) =>
{
    var exists = await repo.exerciseExists(exerciseName);
    return Results.Ok(exists);
});

}
app.Run();

