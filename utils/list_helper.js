const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
  return likes
}

module.exports = {
  dummy,
  totalLikes
}
