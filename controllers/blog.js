const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Blog.findById(id).then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = blog.save()
  await response.status(201).json(savedBlog)
})

module.exports = blogRouter
