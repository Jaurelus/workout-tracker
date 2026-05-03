using System.Data.Common;
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


var app = builder.Build();

app.UseCors("AllowReactApp");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();



app.MapPost("/addExercise", async(Exercises exercise, ExercisesRepository repo) =>
{
    await repo.addExercise(exercise);
    return Results.Created($"/exercises/{exercise.Id}",exercise);
});
app.MapGet("/getExercises", async( ExercisesRepository repo) =>
{
    
     var exercises = await repo.getExercises();
    return Results.Ok(exercises);
});

app.MapGet("/getExerciseNames", async( ExercisesRepository repo) =>
{
    
     var exercises = await repo.getExerciseNames();
    return Results.Ok(exercises);
});
app.Run();

