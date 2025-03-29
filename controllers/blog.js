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

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  await response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Blog.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogRouter.put('/:id', (request, response, next) => {
  const blog = request.body
  const { id } = request.params

  const newBlogInfo = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }

  Blog.findByIdAndUpdate(id, newBlogInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

module.exports = blogRouter
