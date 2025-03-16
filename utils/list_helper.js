const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
  return likes
}

const favoriteBlogs = (blogs) => {
  const favoriteBlog = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
  return favoriteBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs
}
