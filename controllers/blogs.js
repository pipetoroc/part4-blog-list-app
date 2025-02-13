const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Blog.findById(id).then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

blogsRouter.post('/', (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then(savedBlog => {
    response.json(savedBlog)
  })
})

module.exports = blogsRouter
