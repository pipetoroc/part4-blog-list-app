const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middlewares')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
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

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const { id } = request.params
    const user = request.user

    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'You are not allowed to delete this blog' })
    }

    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
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
