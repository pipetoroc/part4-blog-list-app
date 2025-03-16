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

const mostBlogs = (blogs) => {
  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.entries(authorCount).reduce((max, [author, count]) => count > max.blogs ? { author, blogs: count } : max, { author: null, blogs: 0 })

  return topAuthor
}

const mostLikes = (blogs) => {
  const { author, likes } = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])

  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes
}
