using Microsoft.EntityFrameworkCore;

namespace aspnetserver.Data
{
    internal static class PostsRepository
    {
        internal async static Task<List<Post>> GetPostsAsync()
        {
            using (var db = new AppDBContext())
            {
                return await db.Posts.ToListAsync();
            }
        }

        internal async static Task<Post> GetPostByIdAsync(int postId)
        {
            using (var db = new AppDBContext())
            {
#pragma warning disable CS8603 // Possible null reference return.
                return await db.Posts.FirstOrDefaultAsync(p => p.PostId == postId);
#pragma warning restore CS8603 // Possible null reference return.
            }
        }

        internal async static Task<bool> CreatePostAsync(Post postToAdd)
        {
            using (var db = new AppDBContext())
            {
                try
                {
                    await db.Posts.AddAsync(postToAdd);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch(Exception ex)
                {
                    return false;
                }
            }
        }

        internal async static Task<bool> UpdatePostAsync(Post postToUpdate)
        {
            using (var db = new AppDBContext())
            {
                try
                {
                    db.Posts.Update(postToUpdate);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        internal async static Task<bool> DeletePostAsync(int postId)
        {
            using (var db = new AppDBContext())
            {
                try
                {
                    Post postToDelete = await GetPostByIdAsync(postId);
                    db.Posts.Remove(postToDelete);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
    }
}
