const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Este es mi nuevo blog',
    author: 'Felipe Toro',
    url: 'www.facebook.com',
    likes: 10
  },
  {
    title: 'Un blog de programación',
    author: 'Laura Toro',
    url: 'www.snapchat.com',
    likes: 23
  }
]

const initialUsers = [
  {
    username: 'Ftoca',
    name: 'joe doe',
    password: 'The secret password'
  },
  {
    username: 'newUser',
    name: 'Another user',
    password: 'The secret password'
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDB, initialUsers
}
