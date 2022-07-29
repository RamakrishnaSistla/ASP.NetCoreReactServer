using aspnetserver.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins("http://localhost:3000", "https://gentle-moss-0630e8600.1.azurestaticapps.net");
    });
});
// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title="ASP.NET Core Web API", Version="v1"});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(swaggerUIOptions =>
{
    swaggerUIOptions.DocumentTitle = "ASP.Net Core Web API";
    swaggerUIOptions.SwaggerEndpoint("swagger/v1/swagger.json", "A web api serving a simple Post model");
    swaggerUIOptions.RoutePrefix = String.Empty;
});

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");

app.MapGet("/get-all-posts", async () => await PostsRepository.GetPostsAsync())
.WithTags("Posts Endpoints");

app.MapGet("/get-post-by-id/{postId}", async (int postId) =>
{
    Post post = await PostsRepository.GetPostByIdAsync(postId);

    if (post != null)
    {
        return Results.Ok(post);
    }
    else
    {
        return Results.BadRequest();
    }
}).WithTags("Posts Endpoints");

app.MapPost("/create-post", async (Post postToAdd) =>
{
    bool createSuccessful = await PostsRepository.CreatePostAsync(postToAdd);

    if (createSuccessful)
    {
        return Results.Ok("Post created successfully!");
    }
    else
    {
        return Results.BadRequest();
    }
}).WithTags("Posts Endpoints");

app.MapPut("/update-post", async (Post postToUpdate) =>
{
    bool updateSuccessful = await PostsRepository.UpdatePostAsync(postToUpdate);

    if (updateSuccessful)
    {
        return Results.Ok("Post updated successfully!");
    }
    else
    {
        return Results.BadRequest();
    }
}).WithTags("Posts Endpoints");

app.MapDelete("/delete-post/{postId}", async (int postId) =>
{
    bool deleteSuccessful = await PostsRepository.DeletePostAsync(postId);

    if (deleteSuccessful)
    {
        return Results.Ok("Post deleted successfully!");
    }
    else
    {
        return Results.BadRequest();
    }
}).WithTags("Posts Endpoints");

app.Run();

