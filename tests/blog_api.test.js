const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./tests_helper')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Unique identifier property of the blog is id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.ok(blog.id, 'The field id must be defined')
      assert.strictEqual(blog._id, undefined, 'The field __id must not be defined')
    })
  })
})

test('HTTP post create an unique blog', async () => {
  const newBlog = {
    title: 'Studing Jest and Test',
    author: 'PipeToroC',
    url: 'www.hotmail.com',
    likes: 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Studing Jest and Test'))
})

describe('Creating a test with a default property', () => {
  test('if the likes property does not exist the number of likes is 0', async () => {
    const newBlog = {
      title: 'Studing Jest and Test',
      author: 'PipeToroC',
      url: 'www.hotmail.com'
    }

    const responsePost = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(responsePost.body.likes, 0, 'likes should default to 0')
  })
})

describe('Creating a valid blog', async () => {
  test('Create a new blog with title and url', async () => {
    const newBlog = {
      title: 'Creating a new test',
      author: 'felipetorocastilla',
      url: 'theurlofmyblog.com'
    }

    const blogPosted = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.ok(blogPosted.body.title, newBlog.title, 'The title should be present')
    assert.ok(blogPosted.body.url, 'The URL should be present')
  })
})

test('Delete a blog by id', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDB()

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('Update a blog by id', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToUppdate = blogsAtStart[0]

  const newBlogInfo = {
    title: 'Este es mi nuevo blog',
    author: 'Felipe Toro',
    url: 'www.facebook.com',
    likes: 1000
  }

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUppdate.id}`)
    .send(newBlogInfo)
    .expect(200)

  assert.strictEqual(updatedBlog.body.likes, 1000)
})

after(async () => {
  await mongoose.connection.close()
})
